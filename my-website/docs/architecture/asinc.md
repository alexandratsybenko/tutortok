---
title: Асинхронное взаимодействие
sidebar_position: 11
---

#Асинхронное взаимодействие

### Асинхронное взаимодействие: Транскодирование и сжатие видео, загруженных репетитором.

Почему был выбрано?

1) Пользователю важно быстро посмотреть видео в формате скроллинга и не ждать долгой загрузки. Для тяжелых файлов загрузка занимала бы секунды для каждого короткого видео.

2) Финансовая выгода. Большие медиафайлы дороже хранить и особенно вызывать в многократном размере из хранилища S3.



#### Взаимодействие происходит между тремя компонентами архитектуры (Backend-to-Backend):

1. Сервер: основной сервер обрабатывает запросы от клиента. Выступает в роли продюсера (отправитель сообщения).

2. RabbitMQ (Брокер сообщений): выступает в роли обменника.

3. Сервис обработки видео: отдельный микросервис, чья задача - скачивать видео, конвертировать их в кодек H.264 и загружать обратно. Выступает в роли консьюмера **(получатель сообщения).



#### Как происходит процесс:

1. Репетитор загружает видеовизитку или видеоурок. Нажимает на кнопку «Опубликовать». Сервер сохраняет необработанный файл в облаке (S3).

2. Сервер формирует JSON-сообщение с uri видео в S3 и отпрвляет его в RabbitMQ.

3. Сервер не ждет окончания обработки и сразу отвечает пользователю: "Видео загружено, скоро появится в профиле" (Асинхронное взаимодействие). Код: 202 Accepted.

4. Консьюмер берет это сообщение из RabbitMQ, скачивает необработанное видео, сжимает его, загружает готовые файлы обратно в S3.

5. Консюмер отправляет ответное сообщение с новой ссылкой в S3 в Обменник, чтобы Сервер узнал об успехе и обновил статус видео в базе данных. 



У нас есть выбор: RabbitMQ, Apache Kafka, NATS, Websocket, gRPC.



#### Как была выбрана технология?

Websocket: предназначен для реализации асинхронного взаимодействия между фронтэндовым клиентом и сервером. Не подходит, так как рассматриваем взаимодействие бэкенд-бэкэнд.

gRPC: технология удаленного вызова процедур. Если обработчик временно упадет, сервер не сможет передать ему видео. gRPC требует одновременной работоспособности обеих систем.  Отсутствует встроенный механизм сохранения сообщений (очередей). Не подходит.

Apache Kafka: оптимальна для потоковой обработки огромных массивов данных (Event Streaming) и хранения логов. Для данного взаимодействия (распределение разовых задач) Kafka избыточна и сложна в настройке.

NATS: очень быстрый брокер, но слаб в гарантированной доставке сложных задач с повторами. 

**RabbitMQ:** обеспечивает классический событийно-ориентированный обмен сообщениями. Идеально подходит для фоновых задач с гарантией доставки (at-least-once). При падении воркера RabbitMQ сохранит задачу в памяти. Также позволяет настроить Dead Letter Queue (очередь "мертвых" сообщений) для битых видеофайлов, которые не удалось сжать после нескольких попыток.

В рамках интеграции через брокер передаются только JSON-сообщения со ссылками на файлы в S3, а не сами файлы. Это снимает ограничения RabbitMQ на передачу больших объемов данных и делает его доступным для использования. 

Выбрала RabbitMQ, так как он оптимален для паттерна "Очередь задач" (Task Queue) и обеспечивает гарантированную доставку сообщений (at-least-once). Формат передачи данных - JSON, поэтому для описания контракта используем AsyncAPI.



Для описания контракта выбрана версия AsyncAPI 3.1.0, так как она является актуальным стандартом для документирования асинхронных API: поддерживает разделение каналов (channels) и операций (operations).



```YAML
asyncapi: 3.1.0
info:
  title: TutorTok Video Processing API
  version: '1.0.0'
  description: Асинхронное взаимодействие для транскодирования и сжатия видеовизиток и бесплатных уроков
servers:
  production:
    host: rabbitmq.tutortok.internal:5672
    protocol: amqp
    description: Внутренний кластер брокера RabbitMQ
    security:
      - type: userPassword

channels:
  videoTasksChannel:
    address: 'video.processing.tasks'
    description: Очередь команд на обработку загруженных видеофайлов
    messages:
      taskMessage:
        $ref: '#/components/messages/VideoProcessingCommand'

  videoResultsChannel:
    address: 'video.processing.results'
    description: Очередь событий с результатами обработки видео
    messages:
      resultMessage:
        $ref: '#/components/messages/VideoProcessingResultEvent'

operations:
  sendVideoTask:
    action: 'send'
    channel:
      $ref: '#/channels/videoTasksChannel'
    summary: Сервер отправляет задачу после загрузки необработанного файла в S3.

  receiveVideoResult:
    action: 'receive'
    channel:
      $ref: '#/channels/videoResultsChannel'
    summary: Core API получает результат (успех или ошибку) от консьюмера для обновления статуса в БД.

components:
  messages:
    VideoProcessingCommand:
      title: Команда на сжатие видео
      contentType: application/json
      payload:
        $ref: '#/components/schemas/VideoTaskPayload'

    VideoProcessingResultEvent:
      title: Событие завершения обработки
      contentType: application/json
      payload:
        $ref: '#/components/schemas/VideoResultPayload'

  schemas:
    VideoTaskPayload:
      type: object
      required:
        - video_id
        - raw_video_url
        - video_type
      properties:
        video_id:
          type: string
          format: uuid
          description: Уникальный идентификатор видео в БД.
        raw_video_url:
          type: string
          format: uri
          description: Ссылка на скачивание сырого видео из временного S3 бакета.
        video_type:
          type: string
          enum: [TRAILER, LESSON]
          description: Тип видео (визитка сжимается под вертикальный формат, урок — под 16:9).

    VideoResultPayload:
      type: object
      required:
        - video_id
        - status
      properties:
        video_id:
          type: string
          format: uuid
        status:
          type: string
          enum: [SUCCESS, FAILED]
          description: Результат работы воркера.
        processed_video_url:
          type: string
          format: uri
          description: Ссылка на сжатое mp4 видео в S3 (обязательно при SUCCESS).
        preview_image_url:
          type: string
          format: uri
          description: Ссылка на сгенерированную обложку-превью (обязательно при SUCCESS).
        error_message:
          type: string
          description: Причина сбоя (битый файл, неподдерживаемый кодек). Заполняется при FAILED.
```





