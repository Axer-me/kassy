@echo off
chcp 65001 >nul
cd /d "%~dp0pulse-client"

echo.
echo  Сборка автономного HTML для заказчика
echo  =====================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [Ошибка] Node.js не найден.
  pause
  exit /b 1
)

call npm run build:demo
if errorlevel 1 (
  pause
  exit /b 1
)

echo.
echo Файл создан: %~dp0Пульс клиента — демо.html
echo Откройте его двойным кликом в Chrome или Edge.
echo.

start "" "%~dp0Пульс клиента — демо.html"
pause
