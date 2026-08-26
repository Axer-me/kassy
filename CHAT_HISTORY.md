# История чата — проект kassy (калькулятор КСО)

Репозиторий: [Axer-me/kassy](https://github.com/Axer-me/kassy)

> **Примечание:** API-ключи, SMTP-пароли и `.env` в git не попадают. В репозитории только плейсхолдеры (`your@yandex.ru`, `your_app_password` в `.env.example`).

---

## 1. Старт: мокап по скриншотам

**Запрос:** сверстать HTML-мокап iPad-приложения «Кассы самообслуживания — Альфа-Банк» по 5 экранам (старт, комплектация, параметры, сравнение, контакты). Тёмная тема, акcent `#EF3124`.

**Сделано:** файлы `kassa-mockup.html` / `kassa-mockup-emails.html` — 5 экранов, калькулятор покупка vs подписка, опции (+110 / +730 / +230 / +490 ₽/мес).

---

## 2. Отправка расчёта на email

**Эволюция:**
1. Node-бэкенд `kassa-email-server/` (SMTP через Nodemailer).
2. Альтернатива без бэкенда: **EmailJS** + **html2canvas** + **ImgBB** (`kassa-mockup-emails.html`).
3. **Текущая версия:** единый `index.html` + `kassa-email-server` — `POST /api/send-calculation`, HTML-письмо через SMTP, лог в SQLite.

**API:** `POST /api/send-calculation`, `GET /api/submissions` (последние 200 заявок).

---

## 3. iPhone / iOS — навигация и опции

**Решение:** radio + label вместо JS-навигации; для демо без JS — CSS-only комбинации опций (16 вариантов, 50 касс · 3 года).

**Запуск на iPhone:** `Запуск для iPhone.bat` → HTTP `http://192.168.x.x:3456/` (не `file://`).

---

## 4. Стартовая страница по Figma (август 2025)

**Запрос:** стартовая страница как в макете 1280-SKB; остальные экраны калькулятора без изменений.

**Эволюция:**
1. HTML/CSS по Figma + PNG-секции — приблизительное совпадение.
2. Пользователь добавил **8 SVG секций** + **`hero касса.svg`** — полная пересборка стартового экрана.

**Итоговая реализация (`index.html`):**
- Секции 1–8: `assets/first svg.svg` … `assets/eigth svg.svg` (порядок сверху вниз).
- Касса: `assets/hero касса.svg` поверх hero-блока.
- **Кликабельные CTA:** прозрачные `<label for="page-2">` по координатам красных кнопок в SVG (Оставить заявку / Перезвонить мне).
- Масштаб iPad: `transform: scale(0.6)` в обёртке `.skb-scale-wrap`.
- Скрипт `fitSkbLandingScale()` — обрезка лишней высоты после scale.

**Скрипт сборки:** `_build_svg_landing.py` (пересборка screen-1 из конфига секций).

**Исправления после сравнения с макетом:**
- Скругления hero/футера: белый блок `.skb-landing-content` заходит под SVG на 64px (`margin-top: -64px`), иначе прозрачные «вырезы» в SVG показывали чёрный фон.
- Лишнее чёрное пространство снизу: обёртка `.skb-scale-wrap { overflow: hidden }` + JS-подгон высоты под scale(0.6).
- Обновление `assets/second svg.svg` — cache-bust `?v=...` в `src`.

---

## 5. Email / SMTP (обсуждение, без смены провайдера в коде)

| Провайдер | Лимит (free) | Заметки |
|-----------|--------------|---------|
| Yandex SMTP | **300/день** | `.env.example`, риск антиспама при одинаковых письмах |
| Gmail SMTP | **~500/день** | `smtp.gmail.com`, пароль приложения; **нельзя** через `smtp.yandex.ru` |
| EmailJS | **~200/мес** | старый путь в mockup-emails |
| SendPulse SMTP | **400/день**, 12k/мес | лучший free-апгрейд по объёму |
| Brevo | **300/день** | SMTP + API, footer Brevo на free |

**1000 писем/день бесплатно** у транзакционных сервисов практически нет. Для большего объёма — SendPulse/Brevo API или Amazon SES (~$3/мес за ~30k писем).

**Антиспам Yandex/Gmail:** одинаковые HTML-письма из приложения могут временно блокировать отправку (24ч+) даже до формального лимита.

---

## 6. Структура проекта (актуально)

```
kassy/
├── index.html                 # лендинг (SVG) + 5 экранов калькулятора
├── assets/                    # SVG секций, hero касса.svg
├── kassa-email-server/        # Express + Nodemailer + SQLite
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── Запуск мокапа касс.bat     # node server, порт 3456
├── Запуск для iPhone.bat      # 0.0.0.0:3456 для Safari на телефоне
├── README.md
├── CHAT_HISTORY.md
├── ИНСТРУКЦИЯ_ПОЛУЧЕНИЕ_КЛЮЧЕЙ.md
└── СПРАВКА_ПО_КЛИЕНТУ.md
```

Удалено из основной ветки (не относится к кассам): `pulse-client/`, старые `kassa-mockup*.html`.

---

## 7. Секреты (не хранить в git)

- `kassa-email-server/.env` — SMTP_USER, SMTP_PASS
- EmailJS / ImgBB ключи (если используется legacy mockup)

После клонирования: `copy kassa-email-server\.env.example kassa-email-server\.env` и заполнить SMTP.

---

## 8. Хронология (ключевые запросы)

| Период | Запрос |
|--------|--------|
| Июл 2025 | Мокап, email, iPhone, CSS-only опции, заливка в kassy_demo |
| Авг 2025 | Стартовая по Figma/PDF; 8 SVG + hero; кликабельные кнопки |
| Авг 2025 | Скругления hero/футера; убрать чёрный зазор снизу |
| Авг 2025 | Лимиты SMTP (Yandex/Gmail/SendPulse); заливка в **Axer-me/kassy** |
