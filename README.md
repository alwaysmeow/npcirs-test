# NPCIRS Test Task

Тестовое fullstack-приложение на `Node.js + React + PostgreSQL`.

Проект реализует:
- главную таблицу `movies` с `Ag-Grid Infinite Row Model`
- связанную таблицу `sessions`
- CRUD для сеансов
- серверное REST-API
- SQL-скрипт для создания и заполнения базы

## Стек

- Backend: `Node.js`, `TypeScript`, `Express`, `pg-promise`
- Frontend: `React`, `MUI`, `Ag-Grid`
- Database: `PostgreSQL`

## Шаблон фронтенда

Клиентская часть оформлена на основе шаблона Creative Tim:

- Material Dashboard 2 React: https://www.creative-tim.com/product/material-dashboard-react

## Структура проекта

```text
npcirs-test/
├── client/        # React-приложение
├── server/        # Node.js / TypeScript API
├── init-db.sql    # SQL-скрипт создания и заполнения БД
└── Readme.md      # Инструкция по установке и запуску
```

## Функциональность

- Таблица `movies` загружается частями с сервера через `limit` и `offset`
- Таблица `sessions` связана с `movies` по `foreign key`
- Для `sessions` доступны операции:
  - добавление
  - изменение
  - удаление
- При создании и редактировании сеанса учитывается связь с таблицей фильмов
- Интерфейс поддерживает светлую и темную тему

## Требования

- `Node.js` 18+ 
- `npm`
- `PostgreSQL` 13+

## Подготовка базы данных

1. Создайте базу данных PostgreSQL:

```sql
CREATE DATABASE npcirs_test;
```

2. Выполните SQL-скрипт из корня проекта:

```bash
psql -U postgres -d npcirs_test -f init-db.sql
```

При необходимости замените пользователя `postgres` на своего.

## Настройка окружения

### Server

Файл: `server/.env`

Пример значений:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=npcirs_test
DB_USER=postgres
DB_PASSWORD=password
PORT=3001
```

### Client

Файл: `client/.env`

```env
GENERATE_SOURCEMAP=false
```

Клиент использует `proxy` на `http://localhost:3001`, заданный в `client/package.json`.

## Установка зависимостей

### Server

```bash
cd server
npm install
```

### Client

```bash
cd client
npm install
```

## Запуск проекта

Откройте два терминала.

### 1. Запуск сервера

```bash
cd server
npm run dev
```

Сервер будет доступен по адресу:

```text
http://localhost:3001
```

### 2. Запуск клиента

```bash
cd client
npm start
```

Клиент будет доступен по адресу:

```text
http://localhost:3000
```

## Production-сборка сервера

```bash
cd server
npm run build
npm start
```

## REST API

### Movies

- `GET /api/movies?limit=10&offset=0`
- `GET /api/movies/count`
- `GET /api/movies/:id`
- `POST /api/movies`
- `PUT /api/movies/:id`
- `DELETE /api/movies/:id`

### Sessions

- `GET /api/sessions`
- `GET /api/sessions/:id`
- `POST /api/sessions`
- `PUT /api/sessions/:id`
- `DELETE /api/sessions/:id`