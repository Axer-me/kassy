import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3456;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Не задана переменная окружения ${name}. Скопируйте .env.example в .env и заполните SMTP-данные.`);
  return value;
}

function getTransporter() {
  return nodemailer.createTransport({
    host: requireEnv('SMTP_HOST'),
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE !== 'false',
    auth: {
      user: requireEnv('SMTP_USER'),
      pass: requireEnv('SMTP_PASS'),
    },
  });
}

function optionLabel(key) {
  const labels = {
    scanner: 'Выносной сканер',
    pedestal: 'Установочная тумба',
    scales: 'Весы',
    install: 'Монтаж оборудования',
  };
  return labels[key] || key;
}

function buildEmailHtml({ name, company, phone, calculation: c }) {
  const optionsHtml = Object.entries(c.options || {})
    .filter(([, v]) => v)
    .map(([k]) => `<li>${optionLabel(k)}</li>`)
    .join('') || '<li>Базовая комплектация</li>';

  return `
<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; color: #222; line-height: 1.5; max-width: 640px;">
  <div style="border-bottom: 3px solid #EF3124; padding-bottom: 16px; margin-bottom: 24px;">
    <span style="color: #EF3124; font-weight: bold; font-size: 18px;">Альфа-Банк</span>
  </div>

  <h1 style="font-size: 22px; margin: 0 0 8px;">Расчёт экономики: кассы самообслуживания</h1>
  <p style="color: #666; margin: 0 0 24px;">Здравствуйте, ${name}! Ниже — индивидуальный расчёт по вашим параметрам.</p>

  <h2 style="font-size: 16px; color: #EF3124;">Контактные данные</h2>
  <table style="width: 100%; margin-bottom: 24px; border-collapse: collapse;">
    <tr><td style="padding: 4px 0; color: #888;">Имя</td><td><strong>${name}</strong></td></tr>
    ${company ? `<tr><td style="padding: 4px 0; color: #888;">Компания</td><td>${company}</td></tr>` : ''}
    <tr><td style="padding: 4px 0; color: #888;">Телефон</td><td>${phone}</td></tr>
  </table>

  <h2 style="font-size: 16px; color: #EF3124;">Параметры расчёта</h2>
  <table style="width: 100%; margin-bottom: 24px; border-collapse: collapse;">
    <tr><td style="padding: 4px 0; color: #888;">Количество касс</td><td><strong>${c.registers}</strong></td></tr>
    <tr><td style="padding: 4px 0; color: #888;">Срок</td><td><strong>${c.yearsLabel}</strong></td></tr>
    <tr><td style="padding: 4px 0; color: #888;">Подписка, ₽/мес за 1 кассу</td><td><strong>${c.monthlyFormatted}</strong></td></tr>
  </table>

  <p style="margin: 0 0 8px; color: #888;">Комплектация:</p>
  <ul style="margin: 0 0 24px;">${optionsHtml}</ul>

  <table style="width: 100%; margin-bottom: 24px; border-collapse: collapse;">
    <tr style="background: #f5f5f5;">
      <td style="padding: 12px; border-radius: 8px 0 0 8px;"><strong>Покупка</strong></td>
      <td style="padding: 12px; border-radius: 0 8px 8px 0; text-align: right;"><strong>${c.purchaseTotalFormatted}</strong></td>
    </tr>
    <tr>
      <td style="padding: 12px;"><strong>Подписка</strong></td>
      <td style="padding: 12px; text-align: right; color: #EF3124;"><strong>${c.subscriptionTotalFormatted}</strong></td>
    </tr>
    <tr style="background: #fff3f2;">
      <td style="padding: 12px; border-radius: 8px 0 0 8px;"><strong>Экономия / остаётся в обороте</strong></td>
      <td style="padding: 12px; border-radius: 0 8px 8px 0; text-align: right; color: #EF3124;"><strong>${c.savingsFormatted}</strong></td>
    </tr>
  </table>

  <p style="font-size: 12px; color: #999;">
    *Расчёт носит информационный характер и не является публичной офертой.
    Индивидуальные условия определяются в рамках переговоров с представителем банка.
  </p>

  <p style="margin-top: 24px; color: #666;">С уважением,<br>Альфа-Банк</p>
</body>
</html>`;
}

app.post('/api/send-calculation', async (req, res) => {
  try {
    const { name, company, phone, email, calculation } = req.body;

    if (!name?.trim() || !phone?.trim() || !email?.trim()) {
      return res.status(400).json({ error: 'Заполните имя, телефон и email.' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Некорректный адрес email.' });
    }

    if (!calculation) {
      return res.status(400).json({ error: 'Данные расчёта отсутствуют. Пройдите все шаги калькулятора.' });
    }

    const transporter = getTransporter();
    const from = process.env.SMTP_FROM || requireEnv('SMTP_USER');

    await transporter.sendMail({
      from,
      to: email.trim(),
      subject: `Расчёт экономики: кассы самообслуживания — ${calculation.registers} касс`,
      html: buildEmailHtml({ name: name.trim(), company: company?.trim(), phone: phone.trim(), calculation }),
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('Ошибка отправки:', err.message);
    const message = err.message.includes('SMTP')
      || err.message.includes('окружения')
      ? err.message
      : 'Не удалось отправить письмо. Проверьте SMTP-настройки в .env';
    res.status(500).json({ error: message });
  }
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'kassa-mockup.html'));
});

app.listen(PORT, () => {
  console.log(`\n  Мокап:  http://localhost:${PORT}/kassa-mockup.html`);
  console.log(`  API:    http://localhost:${PORT}/api/send-calculation\n`);
});
