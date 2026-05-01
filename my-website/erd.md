---
title: ERD-диаграммы
sidebar_position: 1
---

## Концептуальная модель

```plantuml

@startuml Концептуальная модель TutorTok

entity user
entity tutor
entity video
entity chat
entity message
entity lesson
entity payment
entity document
entity language
entity specialization

user ||--o| tutor
tutor ||--o{ video
tutor ||--o{ document
user ||--o{ chat
tutor ||--o{ chat
chat ||--o{ message
chat ||--o{ lesson
lesson ||--o| payment
user }o--o{ video : "лайк"
tutor }o--o{ specialization
tutor }o--o{ language

@enduml

```





## Логическая модель

```plantuml
@startuml Логическая модель

entity user {
  * id <<PK>>
  --
  * email <<UNIQUE>>
  * password_hash
  * first_name
  * last_name
  avatar_url
  * role <<ENUM>>
  * email_verified
  * created_at
  updated_at
}

entity tutor {
  * id <<PK>>
  * user_id <<FK, UNIQUE>>
  --
  * nickname <<UNIQUE>>
  * price_per_hour
  * experience_years
  rating
  about
  * is_verified
  * created_at
  updated_at
}


entity video {
  * id <<PK>>
  * tutor_id <<FK>>
  --
  title
  description
  * preview_url
  * video_url
  * duration
  * status: enum
  * type <<ENUM>>
  * created_at
  updated_at
}

entity chat {
  * id <<PK>>
  * student_id <<FK>>
  * tutor_id <<FK>>
  --
  * created_at
  last_message_at
}

entity message {
  * id <<PK>>
  * chat_id <<FK>>
  * sender_id <<FK>>
  --
  * text
  * created_at
  edited_at
  * is_edited
  * is_read
}

entity lesson_status {
  * id <<PK>>
  --
  * code <<UNIQUE>>
  * name
}

entity lesson {
  * id <<PK>>
  * chat_id <<FK>>
  * status_id <<FK>>
  --
  * scheduled_at
  * duration_minutes
  * price
  * created_at
  expires_at
}

entity payment {
  * id <<PK>>
  * lesson_id <<FK, UNIQUE>>
  --
  * status: enum
  * amount
  external_payment_id
  * created_at
  updated_at
}

entity document {
  * id <<PK>>
  * tutor_id <<FK>>
  --
  * status: enum
  * document_url
  admin_comment
  * uploaded_at
  reviewed_at
}

entity language {
  * id <<PK>>
  --
  * code <<UNIQUE>>
  * name
  * is_active
}

entity specialization {
  * id <<PK>>
  --
  * code <<UNIQUE>>
  * name
  * is_active
}

entity tutor_language {
  * id <<PK>>
  * tutor_id <<FK>>
  * language_id <<FK>>
  --
  * created_at
}

entity tutor_specialization {
  * id <<PK>>
  * tutor_id <<FK>>
  * specialization_id <<FK>>
  --
  * created_at
}

entity like {
  * id <<PK>>
  * user_id <<FK>>
  * video_id <<FK>>
  --
  * created_at
}

entity lesson_status_history {
  * id <<PK>>
  * lesson_id <<FK>>
  old_status_id <<FK>>
  * new_status_id <<FK>>
  * changed_at
  changed_by <<FK>>
}


lesson ||--o{ lesson_status_history
user ||--o{ lesson_status_history
lesson_status ||--o{ lesson_status_history

user ||--o| tutor
tutor ||--o{ video
tutor ||--o{ document

user ||--o{ chat : "student"
tutor ||--o{ chat : "tutor"
chat ||--o{ message
chat ||--o{ lesson

lesson_status ||--o{ lesson
lesson ||--o| payment

tutor ||--o{ tutor_language
language ||--o{ tutor_language

tutor ||--o{ tutor_specialization
specialization ||--o{ tutor_specialization

user ||--o{ like
video ||--o{ like

@enduml
```


Паттерны, которые были применены: 



**L1. Промежуточные таблицы связей (M:N+)**

Связь M:N: tutor - language. Раскрыта с помощью промежуточной таблицы tutor_language. Репетитор знает много языков, язык знают много репетиторов.

 Связь M:N: tutor - specialization. Раскрыта с помощью промежуточной таблицы tutor_specialization. Репетитор может иметь много спеицализаций, специализация может быть присуща многим репетиторам. 

Связь M:N user - video. Раскрыта с помощью промежуточной таблицы like.  Ученик ставит много лайков, видео получает много лайков. 

Кроме связи, эти таблицы хранят атрибуты самой связи (сreated-at - когда поставлен лайк или добавлена специализация).



**L2. Справочники**

Использовано три справочника: language, specialization и lesson_status_dict. 

**language и specialization**

Нет заранее определенного и точного списка языков и специализаций, закладываем расширение фильтров. Использование справочников позволит бизнесу добавлять новые языки и специализации через административный интерфейс (INSERT) без изменения схемы базы данных и деплоя кода.

**lesson_status_dict**

Статусы урока фиксированы (AWAITING_PAYMENT, PAID, CONFIRMED, COMPLETED, CANCELED, DISPUTED) и могли бы быть ENUM. Однако справочник использован для обеспечения ссылочной целостности с таблицей lesson_status_history - внешние ключи old_status_id и new_status_id ссылаются на конкретный статус и гарантируют, что в историю не попадёт несуществующий статус.

Статусы video (PENDING_MODERATION, APPROVED, REJECTED), payment (PENDING, HELD, CAPTURED, REFUNDED) и document (PENDING, APPROVED, REJECTED) реализованы как ENUM. Их набор фиксирован бизнес-логикой, не требует динамического расширения, и на них не ссылаются другие таблицы через внешние ключи.



**L3. История изменений** 

Паттерн применен для таблицы lesson, так как для аналитики, разрешения спорных ситуаций и отсдеживания прошлых статусов необходимо хранить все эти данные. Должны знать, когда произошла смена статуса и кто инициатор (ученик, репетитор или система по таймауту). Создана таблица lesson_status_history.



**L5. Подтипы сущностей** 

Есть общая сущность user c общими полями. Типы объектов ученик, репетитор, администратор имеют общие поля, но репетитор имеет много уникальных атрибутов. Если бы оставили все данные о репетиторе в таблице user, при описании других типов присутствовало большое количество null столбцов.

Базовая таблица: user, табдлица подтипа: tutor. Связаны как 1:N - user может быть репетитором (не обязательно), но репетитор обязательно должен быть user.



## Физическая модель

```plantuml

@startuml Физическая модель

entity user {
  * id : UUID <<PK>>
  --
  * email : VARCHAR(255) <<UNIQUE>>
  * password_hash : VARCHAR(255)
  * first_name : VARCHAR(100)
  * last_name : VARCHAR(100)
  avatar_url : VARCHAR(500)
  * role : ENUM('STUDENT', 'TUTOR', 'ADMIN')
  * email_verified : BOOLEAN
  * created_at : TIMESTAMPTZ
  updated_at : TIMESTAMPTZ
}

entity tutor {
  * id : UUID <<PK>>
  * user_id : UUID <<FK, UNIQUE>>
  --
  * nickname : VARCHAR(50) <<UNIQUE>>
  * price_per_hour : DECIMAL(10,2)
  * experience_years : INT
  rating : DECIMAL(3,2)
  about : TEXT
  * is_verified : BOOLEAN
  * created_at : TIMESTAMPTZ
  updated_at : TIMESTAMPTZ
}

entity tutor_active {
  * tutor_id : UUID <<PK, FK>>
  --
  * last_active_at : TIMESTAMPTZ
  * updated_at : TIMESTAMPTZ
}

entity video {
  * id : UUID <<PK>>
  * tutor_id : UUID <<FK>>
  --
  title : VARCHAR(255)
  description : TEXT
  * preview_url : VARCHAR(500)
  * video_url : VARCHAR(500)
  * duration : INT
  * status : ENUM('PENDING_MODERATION', 'APPROVED', 'REJECTED')
  * type : ENUM('TRAILER', 'LESSON')
  * created_at : TIMESTAMPTZ
  updated_at : TIMESTAMPTZ
}

entity chat {
  * id : UUID <<PK>>
  * student_id : UUID <<FK>>
  * tutor_id : UUID <<FK>>
  --
  * created_at : TIMESTAMPTZ
  last_message_at : TIMESTAMPTZ
}

entity message {
  * id : UUID <<PK>>
  * chat_id : UUID <<FK>>
  * sender_id : UUID <<FK>>
  --
  * text : TEXT
  * created_at : TIMESTAMPTZ
  edited_at : TIMESTAMPTZ
  * is_edited : BOOLEAN
  * is_read : BOOLEAN
}

entity lesson_status {
  * id :INT <<PK>>
  --
  * code : VARCHAR(50) <<UNIQUE>>
  * name : VARCHAR(100)
}

entity lesson {
  * id : UUID <<PK>>
  * chat_id : UUID <<FK>>
  * status_id :INT <<FK>>
  --
  * scheduled_at : TIMESTAMPTZ
  * duration_minutes : INT
  * price : DECIMAL(10,2)
  * created_at : TIMESTAMPTZ
  expires_at : TIMESTAMPTZ
}

entity payment {
  * id : UUID <<PK>>
  * lesson_id : UUID <<FK, UNIQUE>>
  --
  * status : ENUM('PENDING', 'HELD', 'CAPTURED', 'REFUNDED')
  * amount : DECIMAL(10,2)
  external_payment_id : VARCHAR(255)
  * created_at : TIMESTAMPTZ
  updated_at : TIMESTAMPTZ
}

entity document {
  * id : UUID <<PK>>
  * tutor_id : UUID <<FK>>
  --
  * status : ENUM('PENDING', 'APPROVED', 'REJECTED')
  * document_url : VARCHAR(500)
  admin_comment : TEXT
  * uploaded_at : TIMESTAMPTZ
  reviewed_at : TIMESTAMPTZ
}

entity language {
  * id : INT <<PK>>
  --
  * code : VARCHAR(10) <<UNIQUE>>
  * name : VARCHAR(100)
  * is_active : BOOLEAN
}

entity specialization {
  * id : INT <<PK>>
  --
  * code : VARCHAR(50) <<UNIQUE>>
  * name : VARCHAR(100)
  * is_active : BOOLEAN
}

entity tutor_language {
  * id : SERIAL <<PK>>
  * tutor_id : UUID <<FK>>
  * language_id :INT <<FK>>
  --
  * created_at : TIMESTAMPTZ
}

entity tutor_specialization {
  * id : SERIAL <<PK>>
  * tutor_id : UUID <<FK>>
  * specialization_id : INT <<FK>>
  --
  * created_at : TIMESTAMPTZ
}

entity like {
  * id : BIGSERIAL <<PK>>
  * user_id : UUID <<FK>>
  * video_id : UUID <<FK>>
  --
  * created_at : TIMESTAMPTZ
}


entity lesson_status_history {
  * id : BIGSERIAL <<PK>>
  * lesson_id : UUID <<FK>>
  old_status_id : INT <<FK>>
  * new_status_id : INT <<FK>>
  * changed_at : TIMESTAMPTZ
  changed_by: UUID <<FK>>
}


user ||--o| tutor
tutor ||--|| tutor_active
tutor ||--o{ video
tutor ||--o{ document
user ||--o{ chat : "student"
tutor ||--o{ chat : "tutor"
chat ||--o{ message
chat ||--o{ lesson
lesson ||--o| payment

lesson ||--o{ lesson_status_history
lesson_status ||--o{ lesson_status_history
lesson_status ||--o{ lesson
user ||--o{ lesson_status_history

tutor ||--o{ tutor_language
language ||--o{ tutor_language

tutor ||--o{ tutor_specialization
specialization ||--o{ tutor_specialization

user ||--o{ like
video ||--o{ like

@enduml

```

Примененные паттерны: 

**P1. Разделение горячих данных** 

Поле last_active_at в таблице tutor обновляются при каждом действии репетитора (открытие чата, загрузка видео, ответ ученику). Хранение в таблице tutor приводит к тому, что каждое обновление блокирует всю строку, создавая конкуренцию с параллельными чтениями профиля учениками.

Горячие поля вынесены в отдельную таблицу tutor_active, связанную с tutor отношением 1:1. Позволяет обновлять статус активности, не затрагивая основную таблицу репетитора.



**Осознанная денормализация**

Денормализация в таблице lesson - поле price. В нормализованной схеме цена должна браться из tutor.price_per_hour по внешнему ключу, но мы сознательно дублируем её в lesson.price, потому что репетитор может изменить свою ставку после того, как ученик создал урок. Если бы мы всегда читали актуальную цену из таблицы репетитора, то при оплате ученик увидел бы новую цену вместо той, по которой бронировал урок, а в финансовых отчётах за прошлые периоды появились бы искажения. Поэтому при создании урока мы копируем текущее значение из tutor price_per_hour в lesson.price, и в дальнейшем эта цена никогда не перезаписывается - это осознанное нарушение 3NF в модели.









