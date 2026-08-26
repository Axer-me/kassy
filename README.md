# kassy

Калькулятор экономики касс самообслуживания (Альфа-Банк): SVG-лендинг, 5 экранов калькулятора, отправка расчёта на email и логирование заявок в SQLite.

Репозиторий: [github.com/Axer-me/kassy](https://github.com/Axer-me/kassy)

---

## Быстрый старт

```bash
npm install
copy .env.example .env    # Windows; заполнить SMTP
npm start
```

Откройте http://localhost:3456/

**iPhone / iPad** (та же Wi‑Fi): узнайте IP компьютера (`ipconfig`) и откройте в Safari `http://192.168.x.x:3456/`. Сервер должен быть доступен в сети (при необходимости слушайте `0.0.0.0` — см. ниже).

---

## Структура

| Файл / папка | Назначение |
|--------------|------------|
| `index.html` | Лендинг (SVG) + 5 экранов калькулятора |
| `assets/` | SVG-секции лендинга, `hero касса.svg` |
| `server.js` | Express + Nodemailer (SMTP) + SQLite |
| `favicon.svg` | Иконка вкладки |
| `.env` | SMTP и порт (**локально, не в git**) |
| `submissions.db` | Лог заявок (создаётся автоматически) |
| `package.json` | Зависимости и `npm start` |
| `railway.json` | Команда запуска на Railway |

---

## API

| Метод | URL | Описание |
|-------|-----|----------|
| `POST` | `/api/send-calculation` | Отправка HTML-письма + запись в БД |
| `GET` | `/api/submissions` | Последние 200 заявок (JSON), **Basic Auth** |

Логин к логам: `admin` / `KSO_DEMO_DAY_LOGS` (можно переопределить через `SUBMISSIONS_USER` и `SUBMISSIONS_PASSWORD`).

---

## База данных

SQLite, файл `submissions.db`, таблица `form_submissions`. Просмотр: http://localhost:3456/api/submissions (браузер спросит логин и пароль).

---

## SMTP (.env)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your@gmail.com
SMTP_PASS=пароль_приложения
SMTP_FROM=Альфа-Банк <your@gmail.com>
PORT=3456
```

Пароль приложения Gmail: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

---

## Деплой на Railway

1. Зайдите на [railway.app](https://railway.app) и войдите через GitHub.
2. **New Project** → **Deploy from GitHub repo** → `Axer-me/kassy`. Если репозитория нет в списке: **Configure GitHub App** и выдайте доступ.
3. Откройте сервис → **Variables** → добавьте переменные из раздела ниже.
4. **Settings → Volume** → добавьте том, mount path: `/data`.
5. В Variables задайте `DATABASE_PATH=/data/submissions.db`.
6. **Settings → Networking → Generate Domain**.
7. Дождитесь статуса **Success** в Deployments и откройте выданный `https://….up.railway.app`.

Логи заявок: `https://ВАШ-ДОМЕН/api/submissions` — логин `admin`, пароль `KSO_DEMO_DAY_LOGS`.

### Переменные окружения на Railway

| Ключ | Пример |
|------|--------|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `465` |
| `SMTP_SECURE` | `true` |
| `SMTP_USER` | ваш Gmail |
| `SMTP_PASS` | пароль приложения Google |
| `SMTP_FROM` | `Альфа-Банк <ваш@gmail.com>` |
| `DATABASE_PATH` | `/data/submissions.db` |
| `HOST` | `0.0.0.0` |
| `SUBMISSIONS_USER` | `admin` |
| `SUBMISSIONS_PASSWORD` | `KSO_DEMO_DAY_LOGS` |

`PORT` Railway подставляет сам — не задавайте вручную.

Без Volume файл SQLite пропадёт после рестарта сервиса. Письма зависят от SMTP: Gmail иногда блокирует вход с IP датацентра.

---

## Доступ с телефона

```powershell
# Windows — слушать все интерфейсы (если нужно)
$env:HOST="0.0.0.0"; npm start
```

Откройте на iPhone/iPad: `http://IP_КОМПЬЮТЕРА:3456/`
