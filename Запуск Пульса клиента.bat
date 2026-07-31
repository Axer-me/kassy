@echo off
chcp 65001 >nul
cd /d "%~dp0pulse-client"

echo.
echo  Пульс клиента — запуск локального сервера
echo  ==========================================
echo.

where npm >nul 2>&1
if errorlevel 1 (
  echo [Ошибка] Node.js / npm не найден. Установите Node.js: https://nodejs.org
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo Установка зависимостей...
  call npm install
  if errorlevel 1 (
    echo [Ошибка] npm install не удался.
    pause
    exit /b 1
  )
)

echo Сборка проекта...
call npm run build
if errorlevel 1 (
  echo [Ошибка] Сборка не удалась.
  pause
  exit /b 1
)

echo.
echo Сервер: http://127.0.0.1:4173
echo Откройте файл «Пульс клиента — просмотр.html» или браузер по ссылке выше.
echo Чтобы остановить — закройте это окно.
echo.

start "" "%~dp0Пульс клиента — просмотр.html"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:4173"

call npm run preview -- --host 127.0.0.1 --port 4173

pause
