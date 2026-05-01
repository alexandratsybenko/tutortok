---
title: API 1
sidebar_position: 2
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



1. Профиль репетитора. Передаются полные данные репетитора, также ссылка на видеовизитку. Используется на экране /tutor/`{tutorId}`.

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



1. Бесплатный урок. Используется на экране /tutor/`{tutorId}`. Передается массивом (может быть пустым или содержать один/несколько уроков).

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
    "isVerified": true,
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



1. Сообщение. Используется на экране /chat/\{chatId\}. Представляет одно сообщение в истории переписки.

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
|Профиль репетитора (TutorProfile)|/api/v1/tutors/`{tutorId}`|GET|
|Бесплатный урок (VideoLesson[])|/api/v1/tutors/`{tutorId}`/lessons|GET|
|Идентификатор созданного чата|/api/v1/chats|POST|
|Данные чата (ChatData)|/api/v1/chats/`{chatId}`|GET|
|Сообщение (ChatMessage)|/api/v1/chats/`{chatId}`/messages|POST|



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

**GET /api/v1/tutors/\{tutorId\}**

Path-params: tutorId (string, UUID, обязательный) - уникальный идентификатор репетитора.

Query-params: Нет.

Модель запроса (Body): Пусто.

Модель ответа: Объект TutorProfile (содержит полную информацию о репетиторе, включая ссылку на видеовизитку). См. сущность 3.

**4. Бесплатные уроки репетитора**

**GET /api/v1/tutors/\{tutorId\}/lessons**

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

**GET /api/v1/chats/\{chatId\}**

Path-params: chatId (string, UUID, обязательный) - идентификатор чата.

Query-params:

- limit (integer, default: 50) - количество сообщений для подгрузки.

- before (string, datetime) - курсос для пагинации (сообщения до этой даты).

Модель запроса (Body): Пусто.

Модель ответа: Объект ChatData. Содержит вложенный объект tutor, массив объектов messages (Array`<ChatMessage>`) и вложенный объект pendingLesson (если есть урок, ожидающий оплаты). См. сущность 5 "Данные чата".

Пример запроса с пагинацией:

GET /api/v1/chats/880e8400-e29b-41d4-a716-446655440003?limit=50&before=2026-04-16T10:25:00Z

**7. Отправка сообщения в чат**

**POST /api/v1/chats/\{chatId\}/messages**

Path-params: chatId (string, UUID, обязательный) - идентификатор чата.

Query-params: Нет.

Модель запроса (Body): Текст нового сообщения (от 1 до 1000 символов).

```JSON
{
  "text": "Здравствуйте!Есть свободные окошки?"
}
```

Модель ответа: Объект ChatMessage. Сервер возвращает сформированное сообщение с присвоенным id, датой создания createdAt и т.д., чтобы фронтенд мог добавить его в список на экране. См. сущность 6
