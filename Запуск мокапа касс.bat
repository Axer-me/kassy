@echo off
chcp 65001 >nul
cd /d "%~dp0kassa-email-server"

if not exist .env (
  copy /Y .env.example .env >nul
  echo Создан файл kassa-email-server\.env — укажите SMTP-данные.
  start notepad .env
  pause
)

if not exist node_modules (
  echo Установка зависимостей...
  call npm install
)

start "" "http://localhost:3456/"
node server.js
