# kassy

Калькулятор экономики касс самообслуживания (Альфа-Банк): SVG-лендинг, 5 экранов калькулятора, отправка расчёта на email через Node-бэкенд и логирование заявок в SQLite.

Репозиторий: [github.com/Axer-me/kassy](https://github.com/Axer-me/kassy)

---

## Быстрый старт

1. Клонируйте репозиторий и откройте папку проекта.
2. В `kassa-email-server/` выполните `npm install`, скопируйте `.env.example` → `.env`.
3. Заполните SMTP в `.env` (см. [Методика получения ключей](#методика-получения-ключей-smtp) ниже).
4. Запустите `npm start` и откройте http://localhost:3456/

**iPhone / iPad** (та же Wi‑Fi-сеть): запустите сервер на `0.0.0.0` (см. [Ручной запуск](#ручной-запуск)) и откройте в Safari `http://IP_КОМПЬЮТЕРА:3456/`.

---

## Структура

| Файл / папка | Назначение |
|--------------|------------|
| `index.html` | Лендинг (SVG) + 5 экранов калькулятора |
| `assets/` | SVG-секции лендинга, `hero касса.svg` |
| `kassa-email-server/` | Express + Nodemailer (SMTP) + SQLite |
| `kassa-email-server/.env` | SMTP и порт (**локально, не в git**) |
| `kassa-email-server/submissions.db` | Лог заявок (создаётся автоматически) |

---

## API

| Метод | URL | Описание |
|-------|-----|----------|
| `POST` | `/api/send-calculation` | Отправка HTML-письма клиенту + запись в БД |
| `GET` | `/api/submissions` | Последние 200 заявок (JSON, для просмотра логов) |

Тело `POST /api/send-calculation`:

```json
{
  "name": "Иван",
  "company": "ООО Пример",
  "phone": "+7 900 000-00-00",
  "email": "client@example.com",
  "calculation": { "...": "объект расчёта из калькулятора" }
}
```

---

## База данных и логирование

- **СУБД:** SQLite (файл `kassa-email-server/submissions.db`, библиотека `better-sqlite3`).
- **Таблица:** `form_submissions` — имя, компания, телефон, email, JSON расчёта, время.
- При каждой отправке формы сначала пишется строка в БД, затем уходит письмо через SMTP.
- Просмотр: `http://localhost:3456/api/submissions`.

---

## Расчёт

- **Покупка:** (КСО + допы) × кол-во + сервис **4 000 ₽/мес** × срок
- **Подписка:** тариф × кол-во × месяцы
- **В обороте:** сумма покупки − первый месячный платёж по подписке
- **Экономия за период:** покупка − подписка

---

## Методика получения ключей (SMTP)

Текущая версия приложения отправляет письма **только через SMTP** — настройка в `kassa-email-server/.env`. Секреты **не хранятся в git**; создайте свои учётные данные (не запрашивайте у предыдущего разработчика).

### Шаг 1. Подготовить `.env`

```bash
cd kassa-email-server
npm install
copy .env.example .env    # Windows
# cp .env.example .env    # macOS / Linux
```

### Шаг 2. Выбрать почтовый провайдер

| Провайдер | Лимит (free) | SMTP-хост | Порт |
|-----------|--------------|-----------|------|
| **Yandex** | ~300 писем/день | `smtp.yandex.ru` | 465 (SSL) |
| **Gmail** | ~500 писем/день | `smtp.gmail.com` | 465 (SSL) |
| **Mail.ru** | ~100–300/день | `smtp.mail.ru` | 465 (SSL) |

> Для демо и пилота обычно хватает Yandex или Gmail. Для больших объёмов — SendPulse, Brevo, Amazon SES.

### Шаг 3. Yandex (рекомендуется для `.env.example`)

1. Зарегистрируйте или используйте ящик на [yandex.ru](https://yandex.ru).
2. Включите доступ по протоколу IMAP/SMTP: [Настройки почты → Почтовые программы](https://mail.yandex.ru/?ncrnd=0#setup/client).
3. Создайте **пароль приложения** (не основной пароль от аккаунта):  
   [id.yandex.ru → Безопасность → Пароли приложений](https://id.yandex.ru/security/app-passwords)
4. Заполните `.env`:

```env
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your@yandex.ru
SMTP_PASS=xxxxxxxxxxxxxxxx
SMTP_FROM=Альфа-Банк <your@yandex.ru>
PORT=3456
```

### Шаг 4. Gmail (альтернатива)

1. Включите двухфакторную аутентификацию в Google-аккаунте.
2. Создайте **пароль приложения**: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) → «Почта» / «Другое устройство».
3. Заполните `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
SMTP_FROM=Альфа-Банк <your@gmail.com>
PORT=3456
```

**Важно:** пароль Gmail работает только с `smtp.gmail.com`, не с `smtp.yandex.ru`.

### Шаг 5. Проверка

1. Запустите `npm start` в `kassa-email-server/`.
2. Пройдите калькулятор до последнего экрана.
3. Заполните форму **своим email** и нажмите «Получить расчёт →».
4. Проверьте входящие и папку «Спам».
5. Убедитесь, что заявка попала в лог: http://localhost:3456/api/submissions

### Типичные ошибки

| Симптом | Решение |
|---------|---------|
| «Не задана переменная окружения SMTP_*» | Не создан или пустой `.env` |
| `Invalid login` / `535` | Неверный пароль; для Yandex/Gmail нужен **пароль приложения**, не пароль от сайта |
| Письма не доходят, в логе заявка есть | Проверьте «Спам»; не шлите много одинаковых писем подряд — срабатывает антиспам |
| Форма не отправляется на iPhone | Открывайте через `http://IP:3456/`, не `file://`; сервер слушает `0.0.0.0` |
| CORS / fetch failed | Сервер не запущен или открыт HTML как файл, а не через HTTP |

### Безопасность

- Файл `.env` в `.gitignore` — **не коммитьте** его и не публикуйте пароли.
- В репозитории только плейсхолдеры в `.env.example`.
- На продакшене используйте отдельный служебный ящик, не личную почту.

---

## Ручной запуск

```bash
cd kassa-email-server
npm install
copy .env.example .env   # заполнить SMTP
npm start
```

Приложение: http://localhost:3456/

Для доступа с iPhone в локальной сети — слушать все интерфейсы:

```bash
# Windows PowerShell
$env:HOST="0.0.0.0"; npm start
```

Узнайте IP компьютера (`ipconfig`) и откройте на телефоне `http://192.168.x.x:3456/`.
