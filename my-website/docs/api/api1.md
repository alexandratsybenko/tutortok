---
title: API 1
sidebar_position: 8
---

#API 1

Ссылка на доску с экранами: 

[https://unidraw.io/app/board/3a80d2a036081c13792e](https://unidraw.io/app/board/3a80d2a036081c13792e)

#### Сущности и их атрибуты, которые будут необходимы фронту для реализации экранов из предыдущего задания:

1. Элемент ленты. Содержит краткие данные о репетиторе внизу страницы, само видео, данные о лайке.

```JSON
{
  "tutorId": "550e8400-e29b-41d4-a716-446655440000",
  "videoUrl": "https://cdn.tutortok.ru/trailers/anna-ivanova.mp4",
  "tutorName": "annatutor",
  "isVerified": true,
  "avatarUrl": "https://cdn.tutortok.ru/avatars/annatutor.jpg",
  "language": "ENGLISH",
  "pricePerHour": 1500.00,
  "rating": 4.92,
  "isLiked": false
}
```



1. Доступные фильтры. Используется на экране /feed. Возвращает справочник доступных значений фильтров.

```JSON
{
  "languages": [
    {"value": "ENGLISH", "label": "Английский"},
    {"value": "GERMAN", "label": "Немецкий"},
    { "value": "SPANISH", "label": "Испанский"}
  ],
  "specializations": [
    {"value": "IELTS", "label": "IELTS"},
    {"value": "EGE", "label": "ЕГЭ"},
    {"value": "BUSINESS", "label": "Бизнес-английский"},
    {"value": "TRAVEL", "label": "Для путешествий"}
  ],
  "priceRange": { "min": 500, "max": 5000 },
  "sortOptions": [
    {"value": "rating", "label": "По рейтингу"},
    {"value": "price_asc", "label": "Сначала дешевле"},
    {"value": "price_desc", "label": "Сначала дороже"},
    {"value": "experience", "label": "По опыту"}
  ]
}
```



1. Профиль репетитора. Передаются полные данные репетитора, также ссылка на видеовизитку. Используется на экране /tutor/{tutorId}.

```JSON
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "firstName": "Анна",
  "lastName": "Иванова",
  "nickname": "annatutor",
  "avatarUrl": "https://cdn.tutortok.ru/avatars/annatutor.jpg",
  "isVerified": true,
  "language": "ENGLISH",
  "specializations": ["IELTS", "Business English", "Speaking Practice"],
  "pricePerHour": 1500,
  "experienceYears": 5,
  "rating": 5.0,
  "about": "Дипломированный преподаватель с опытом работы в США",
  "videoTrailerUrl": "https://cdn.tutortok.ru/trailers/anna-ivanova.mp4"
}
```



1. Бесплатный урок. Используется на экране /tutor/{tutorId}. Передается массивом (может быть пустым или содержать один/несколько уроков).

```JSON
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "title": "Present Perfect за 10 минут",
  "previewUrl": "https://cdn.tutortok.ru/lessons/preview/present-perfect.jpg",
  "videoUrl": "https://cdn.tutortok.ru/lessons/present-perfect3995.mp4",
  "duration": 600,
  "description": "Разбираем случаи употребления Present Perfect с понятными примерами"
}
```



1. Данные чата.  Вместо того чтобы заставлять клиентское приложение отправлять три отдельных запроса, сервер возвращает единый объект, который содержит: 1)  метаданные чата (chatId), детальную информацию о репетиторе-собеседнике (вложенный объект tutor), историю текстовых сообщений (массив masseges) см. экран №5, а также сведения об активном ожидающем оплаты уроке, если такие существуют (вложенный объект pendingLesson). 

Использование одного запроса позволяет отобразить шапку профиля, ленту переписки и кнопку оплаты сразу после загрузки страницы.



```JSON
{
  "chatId": "880e8400-e29b-41d4-a716-446655440003",
  "tutor": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Anna",
    "isVerified": true
    "avatarUrl": "https://cdn.tutortok.ru/avatars/annatutor.jpg",
    "isOnline": false,
    "lastSeenAt": "2026-04-16T11:30:00Z"
  },
  "messages": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "senderId": "660e8400-e29b-41d4-a716-446655440001",
      "text": "Здравствуйте! Есть свободные окошки?",
      "createdAt": "2026-04-16T10:25:00Z",
      "editedAt": null,
      "isEdited": false
    }
  ],
  "pendingLesson": {
    "lessonId": "990e8400-e29b-41d4-a716-446655440004",
    "date": "2026-04-20",
    "time": "19:00",
    "durationMinutes": 60,
    "price": 1500.00,
    "status": "AWAITING_PAYMENT"
  }
}
```



1. Сообщение. Используется на экране /chat/{chatId}. Представляет одно сообщение в истории переписки.

```JSON
{
  "id": "770e8400-e29b-41d4-a716-446655440000",
  "senderId": "660e8400-e29b-41d4-a716-446655440001",
  "text": "Здравствуйте! Есть свободные окошки?",
  "createdAt": "2026-04-16T10:25:00Z",
  "editedAt": null,
  "isEdited": false
}
```



#### Разделение сущностей на источники данных (endpoints):

|Сущность|Источник данных|Метод|
|-|-|-|
|Элемент ленты (FeedItem[])|/api/v1/feed|GET|
|Доступные фильтры (Filters)|/api/v1/filters|GET|
|Профиль репетитора (TutorProfile)|/api/v1/tutors/{tutorId}|GET|
|Бесплатный урок (VideoLesson[])|/api/v1/tutors/{tutorId}/lessons|GET|
|Идентификатор созданного чата|/api/v1/chats|POST|
|Данные чата (ChatData)|/api/v1/chats/{chatId}|GET|
|Сообщение (ChatMessage)|/api/v1/chats/{chatId}/messages|POST|



#### Модели запросов и ответов, параметры:

**1. Лента видео**

**GET /api/v1/feed**

Path-params: Нет.

Query-params:

- limit (integer, default: 10, max: 50) - передаем видео порциями (пагинация).

-  offset (integer, default: 0) - смещение для пагинации.

-  language (string, Enum: ENGLISH, GERMAN, SPANISH, FRENCH, CHINESE) - фильтрация по языку.

- minPrice (integer) - минимальная цена за час.

- maxPrice (integer) - максимальная цена за час.

- specializations (array[string]) - фильтрация по направлениям. Может повторяться: specializations[]=IELTS&specializations[]=BUSINESS (explode: true)

- sort (string, Enum: rating, priceasc, pricedesc, experience) - сортировка.

Модель запроса (Body): Пусто (GET-запрос).

Модель ответа: Объект с массивом элементов ленты. См. cущность 1.

Пример запроса с фильтрами и пагинацией:

GET /api/v1/feed?language=ENGLISH&maxPrice=2000&specializations[]=IELTS&specializations[]=BUSINESS&sort=rating&limit=20&offset=0

**2. Справочник фильтров**

**GET /api/v1/filters**

Path-params: Нет.

Query-params: Нет.

Модель запроса (Body): Пусто.

Модель ответа: Объект Filters (содержит массивы опций и вложенный объект priceRange). См. Сущность 2.

**3. Профиль репетитора**

**GET /api/v1/tutors/{tutorId}**

Path-params: tutorId (string, UUID, обязательный) - уникальный идентификатор репетитора.

Query-params: Нет.

Модель запроса (Body): Пусто.

Модель ответа: Объект TutorProfile (содержит полную информацию о репетиторе, включая ссылку на видеовизитку). См. сущность 3.

**4. Бесплатные уроки репетитора**

**GET /api/v1/tutors/{tutorId}/lessons**

Path-params: tutorId (string, UUID, обязательный) - идентификатор репетитора

Query-params: Нет.

Модель запроса (Body): Пусто.

Модель ответа: Массив объектов VideoLesson (Array) - массив. Cм. сущность 4

**5. Создание чата**

**POST /api/v1/chats**

Path-params: Нет.

Query-params: Нет.

Модель запроса (Body): Фронтенд должен передать ID репетитора, с которым ученик хочет начать переписку. Если чат уже существует, сервер вернёт идентификатор существующего чата (идемпотентность).

```JSON
{
  "tutorId": "550e8400-e29b-41d4-a716-446655440000"
}
```

Ответ: объект с идентификатором созданного (или уже существующего) чата

```JSON
{
  "chatId": "880e8400-e29b-41d4-a716-446655440003"
}
```

**6. Получение данных чата (Агрегированный запрос)**

**GET /api/v1/chats/{chatId}**

Path-params: chatId (string, UUID, обязательный) - идентификатор чата.

Query-params:

- limit (integer, default: 50) - количество сообщений для подгрузки.

- before (string, datetime) - курсос для пагинации (сообщения до этой даты).

Модель запроса (Body): Пусто.

Модель ответа: Объект ChatData. Содержит вложенный объект tutor, массив объектов messages (Array<ChatMessage>) и вложенный объект pendingLesson (если есть урок, ожидающий оплаты). См. сущность 5 "Данные чата".

Пример запроса с пагинацией:

GET /api/v1/chats/880e8400-e29b-41d4-a716-446655440003?limit=50&before=2026-04-16T10:25:00Z

**7. Отправка сообщения в чат**

**POST /api/v1/chats/{chatId}/messages**

Path-params: chatId (string, UUID, обязательный) - идентификатор чата.

Query-params: Нет.

Модель запроса (Body): Текст нового сообщения (от 1 до 1000 символов).

```JSON
{
  "text": "Здравствуйте!Есть свободные окошки?"
}
```

Модель ответа: Объект ChatMessage. Сервер возвращает сформированное сообщение с присвоенным id, датой создания createdAt и т.д., чтобы фронтенд мог добавить его в список на экране. См. сущность 6



#### Спецификация в формате OpenAPI:

```YAML
openapi: 3.0.3
info:
  title: TutorTok API
  description: API платформа для поиска репетиторов иностранных языков с видеовизитками
  version: 1.0.0

servers:
  - url: https://api.tutortok.ru/api/v1

security:
  - BearerAuth: []

paths:
  /feed:
    get:
      summary: Получить ленту видеовизиток
      description: Возвращает список элементов ленты с поддержкой пагинации и фильтрации
      tags:
        - Feed
      parameters:
        - $ref: '#/components/parameters/LimitParam'
        - $ref: '#/components/parameters/OffsetParam'
        - name: language
          in: query
          schema:
            $ref: '#/components/schemas/LanguageEnum'
        - name: minPrice
          in: query
          description: Минимальная цена за час
          schema:
            type: integer
            minimum: 0
        - name: maxPrice
          in: query
          description: Максимальная цена за час
          schema:
            type: integer
            minimum: 0
        - name: specializations
          in: query
          style: form
          explode: true
          schema:
            type: array
            items:
              type: string
        - name: sort
          in: query
          schema:
            $ref: '#/components/schemas/SortEnum'
      responses:
        '200':
          description: Успешная загрузка ленты
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/FeedItem'
        '401':
          $ref: '#/components/responses/UnauthorizedError'

  /filters:
    get:
      summary: Получить справочник фильтров
      tags:
        - Feed
      responses:
        '200':
          description: Справочник доступных фильтров
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Filters'

  /tutors/{tutorId}:
    get:
      summary: Получить профиль репетитора
      tags:
        - Tutors
      parameters:
        - $ref: '#/components/parameters/TutorIdParam'
      responses:
        '200':
          description: Данные профиля репетитора
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TutorProfile'
        '404':
          $ref: '#/components/responses/NotFoundError'

  /tutors/{tutorId}/lessons:
    get:
      summary: Получить бесплатные уроки репетитора
      tags:
        - Tutors
      parameters:
        - $ref: '#/components/parameters/TutorIdParam'
      responses:
        '200':
          description: Список видеоуроков
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/VideoLesson'

  /chats:
    post:
      summary: Создать чат с репетитором
      description: Идемпотентный метод. Если чат уже существует, возвращает его ID
      tags:
        - Chats
      parameters:
      - name: x-idempotency-key
        in: header
        required: false
        description: Ключ идемпотентности для безопасного повтора запросов
        schema:
          $ref: '#/components/schemas/UUID'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [tutorId]
              properties:
                tutorId:
                  $ref: '#/components/schemas/UUID'
      responses:
        '201':
          description: Новый чат успешно создан
          content:
            application/json:
              schema:
                type: object
                properties:
                  chatId:
                    $ref: '#/components/schemas/UUID'
        '200':
          description: Чат уже существует, возвращен существующий ID
          content:
            application/json:
              schema:
                type: object
                properties:
                  chatId:
                    $ref: '#/components/schemas/UUID'
        '400':
          $ref: '#/components/responses/ValidationError'

  /chats/{chatId}:
    get:
      summary: Получить данные чата
      tags:
        - Chats
      parameters:
        - $ref: '#/components/parameters/ChatIdParam'
        - $ref: '#/components/parameters/LimitParam'
        - name: before
          in: query
          schema:
            type: string
            format: date-time
      responses:
        '200':
          description: Агрегированные данные чата (сообщения, статус репетитора, ожидающий урок)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ChatData'
        '404':
          $ref: '#/components/responses/NotFoundError'

  /chats/{chatId}/messages:
    post:
      summary: Отправить сообщение в чат
      tags:
        - Chats
      parameters:
        - $ref: '#/components/parameters/ChatIdParam'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [text]
              properties:
                text:
                  type: string
                  maxLength: 1000
      responses:
        '201':
          description: Сообщение создано
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ChatMessage'
        '400':
          $ref: '#/components/responses/ValidationError'
        '401':
          $ref: '#/components/responses/UnauthorizedError'
        '404':
          $ref: '#/components/responses/NotFoundError'

components:

  parameters:
    LimitParam:
      name: limit
      in: query
      description: Максимальное количество возвращаемых записей
      schema:
        type: integer
        default: 10
        maximum: 50
    OffsetParam:
      name: offset
      in: query
      description: Смещение для пагинации
      schema:
        type: integer
        default: 0
    TutorIdParam:
      name: tutorId
      in: path
      required: true
      schema:
        $ref: '#/components/schemas/UUID'
    ChatIdParam:
      name: chatId
      in: path
      required: true
      schema:
        $ref: '#/components/schemas/UUID'

  responses:
    NotFoundError:
      description: Ресурс не найден
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorStructure'
    UnauthorizedError:
      description: Пользователь не авторизован
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorStructure'
    ValidationError:
      description: Ошибка валидации данных
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorStructure'

  schemas:
    UUID:
      type: string
      format: uuid

    LanguageEnum:
      type: string
      enum: [ENGLISH, GERMAN, SPANISH, FRENCH, CHINESE]

    SortEnum:
      type: string
      enum: [rating, price_asc, price_desc, experience]

    ErrorStructure:
      type: object
      properties:
        errorCode:
          type: string
        message:
          type: string

    FilterOption:
      type: object
      properties:
        value:
          type: string
        label:
          type: string

    FeedItem:
      type: object
      properties:
        tutorId:
          $ref: '#/components/schemas/UUID'
        videoUrl:
          type: string
          format: uri
        tutorName:
          type: string
        avatarUrl:
          type: string
          format: uri
        isVerified:
          type: boolean
        language:
          $ref: '#/components/schemas/LanguageEnum'
        pricePerHour:
          type: number
          format: float
        rating:
          type: number
          format: float
        isLiked:
          type: boolean

    Filters:
      type: object
      properties:
        languages:
          type: array
          items:
            $ref: '#/components/schemas/FilterOption'
        specializations:
          type: array
          items:
            $ref: '#/components/schemas/FilterOption'
        priceRange:
          type: object
          properties:
            min:
              type: integer
            max:
              type: integer
        sortOptions:
          type: array
          items:
            $ref: '#/components/schemas/FilterOption'

    TutorProfile:
      type: object
      properties:
        id:
          $ref: '#/components/schemas/UUID'
        firstName:
          type: string
        lastName:
          type: string
        nickname:
          type: string
        avatarUrl:
          type: string
          format: uri
        isVerified:
          type: boolean
        language:
          $ref: '#/components/schemas/LanguageEnum'
        specializations:
          type: array
          items:
            type: string
        pricePerHour:
          type: number
          format: float
        experienceYears:
          type: integer
        rating:
          type: number
          format: float
        about:
          type: string
        videoTrailerUrl:
          type: string
          format: uri

    VideoLesson:
      type: object
      properties:
        id:
          $ref: '#/components/schemas/UUID'
        title:
          type: string
        previewUrl:
          type: string
          format: uri
        videoUrl:
          type: string
          format: uri
        duration:
          type: integer
        description:
          type: string

    ChatMessage:
      type: object
      properties:
        id:
          $ref: '#/components/schemas/UUID'
        senderId:
          $ref: '#/components/schemas/UUID'
        text:
          type: string
        createdAt:
          type: string
          format: date-time
        editedAt:
          type: string
          format: date-time
          nullable: true
        isEdited:
          type: boolean

    PendingLesson:
      type: object
      properties:
        lessonId:
          $ref: '#/components/schemas/UUID'
        date:
          type: string
          format: date
        time:
          type: string
        durationMinutes:
          type: integer
        price:
          type: number
          format: float
        status:
          type: string
          enum: [AWAITING_PAYMENT, PAID, CANCELLED]

    ChatData:
      type: object
      properties:
        chatId:
          $ref: '#/components/schemas/UUID'
        tutor:
          type: object
          properties:
            id:
              $ref: '#/components/schemas/UUID'
            name:
              type: string
            avatarUrl:
              type: string
              format: uri
            isVerified:
              type: boolean
            isOnline:
              type: boolean
            lastSeenAt:
              type: string
              format: date-time
        messages:
          type: array
          items:
            $ref: '#/components/schemas/ChatMessage'
        pendingLesson:
          $ref: '#/components/schemas/PendingLesson'
          nullable: true
          
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: Авторизация по JWT токену
```

