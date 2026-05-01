---
title: API 2
sidebar_position: 9
---

#API 2

Платформа для поиска репетиторов с видеовизитками.

Разработала несколько низкодетализированных макетов по Use Cases моего проекта.

#### Макеты:

[https://unidraw.io/app/board/3a80d2a036081c13792e](https://unidraw.io/app/board/3a80d2a036081c13792e)

#### Роуты макетов страниц:

1. /feed - лента видео

2. /tutor/{tutorId} - профиль репетитора

3. /chat/{chatId} - чат 

#### **Таблица Endpoints**

На основе разработанных wireframe-макетов определены эндпоинты, обеспечивающие взаимодействие клиентской части с сервером. Все эндпоинты имеют префикс /api/v1 и следуют принципам RESTful-архитектуры второго уровня зрелости по модели Ричардсона

|Экран|Действие|Метод|Endpoint|
|-|-|-|-|
|**Лента**|Загрузить ленту|GET|/api/v1/feed|
||Получить/применить фильтры|GET|/api/v1/filters|
||Поставить лайк|POST|/api/v1/likes|
||Убрать лайк|DELETE|/api/v1/likes/{tutorId}|
|**Профиль**|Получить данные репетитора + видеовизитку|GET|/api/v1/tutors/{tutorId}|
||Получить бесплатные уроки|GET|/api/v1/tutors/{tutorId}/lessons|
|**Чат**|Создать чат|POST|/api/v1/chats|
||Получить данные для чата (инфо о собеседнике + сообщения + инфо о чате)|GET|/api/v1/chats/{chatId}|
||Отправить сообщение|POST|/api/v1/chats/{chatId}/messages|
||Редактировать сообщение|PATCH|/api/v1/chats/{chatId}/messages/{messageId}|
||Удалить сообщение|DELETE|/api/v1/chats/{chatId}/messages/{messageId}|

---



