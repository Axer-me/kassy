# kassy_demo

Мокап калькулятора экономики касс самообслуживания (Альфа-Банк) + вспомогательные материалы.

## Кассы самообслуживания

| Файл | Описание |
|------|----------|
| `kassa-mockup.html` | Демо для заказчика (без ключей API) |
| `kassa-mockup-emails.html` | Версия с отправкой email (ключи — плейсхолдеры, см. ниже) |
| `Запуск мокапа касс.bat` | Открыть мокап на Windows |
| `Запуск для iPhone.bat` | Локальный HTTP-сервер для теста на iPhone/iPad |
| `kassa-email-server/` | Опциональный Node-бэкенд для SMTP (не обязателен) |

### Настройка отправки email

В `kassa-mockup-emails.html` замените плейсхолдеры:

```javascript
const EMAILJS = {
  publicKey:  'YOUR_PUBLIC_KEY',
  serviceId:  'YOUR_SERVICE_ID',
  templateId: 'YOUR_TEMPLATE_ID',
};
const IMGBB_API_KEY = 'YOUR_IMGBB_API_KEY';
```

Шаблон EmailJS — **HTML**, с переменными `{{image_url}}`, `{{user_name}}` и др. (инструкция в комментарии внутри файла).

### iPhone / демо без сервера

- Навигация и опции работают через **CSS + label/checkbox** (без JavaScript).
- Предпросчитаны все 16 комбинаций комплектации для **50 касс · 3 года**.
- Отправка email с iPhone — через `Запуск для iPhone.bat` + Safari.

## Пульс клиента

Отдельный прототип в `pulse-client/` (React + Vite). Запуск: `Запуск Пульса клиента.bat`.

## История разработки

См. [CHAT_HISTORY.md](./CHAT_HISTORY.md).
