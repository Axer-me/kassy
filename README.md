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

---

## API

| Метод | URL | Описание |
|-------|-----|----------|
| `POST` | `/api/send-calculation` | Отправка HTML-письма + запись в БД |
| `GET` | `/api/submissions` | Последние 200 заявок (JSON) |

---

## База данных

SQLite, файл `submissions.db`, таблица `form_submissions`. Просмотр: http://localhost:3456/api/submissions

---

## SMTP (.env)

```env
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your@yandex.ru
SMTP_PASS=пароль_приложения
SMTP_FROM=Альфа-Банк <your@yandex.ru>
PORT=3456
```

Пароль приложения Yandex: [id.yandex.ru/security/app-passwords](https://id.yandex.ru/security/app-passwords)

---

## Доступ с телефона

```powershell
# Windows — слушать все интерфейсы (если нужно)
$env:HOST="0.0.0.0"; npm start
```

Откройте на iPhone/iPad: `http://IP_КОМПЬЮТЕРА:3456/`
