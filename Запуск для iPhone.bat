@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ========================================
echo   Калькулятор касс — доступ с iPhone
echo ========================================
echo.
echo iPhone и компьютер должны быть в одной Wi-Fi.
echo Откройте в Safari:
echo.

set "PORT=3456"
set "FOUND=0"
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
  for /f "tokens=* delims= " %%b in ("%%a") do (
    echo %%b | findstr /r "^192\.168\." >nul && (
      echo    http://%%b:!PORT!/
      set "FOUND=1"
      if "!FIRST_IP!"=="" set "FIRST_IP=%%b"
    )
    echo %%b | findstr /r "^10\." >nul && (
      echo    http://%%b:!PORT!/
      set "FOUND=1"
      if "!FIRST_IP!"=="" set "FIRST_IP=%%b"
    )
  )
)

if "!FOUND!"=="0" (
  echo    Wi-Fi IP не найден. Откройте: http://ВАШ_IP:!PORT!/
)

netsh advfirewall firewall show rule name="Kassa Mockup HTTP" >nul 2>&1
if errorlevel 1 (
  netsh advfirewall firewall add rule name="Kassa Mockup HTTP" dir=in action=allow protocol=TCP localport=!PORT! >nul 2>&1
)

cd kassa-email-server
if not exist .env copy /Y .env.example .env >nul
if not exist node_modules call npm install >nul

if defined FIRST_IP start "" "http://!FIRST_IP!:!PORT!/"

echo.
echo Сервер: 0.0.0.0:!PORT!  (не закрывайте окно)
echo.
node server.js
endlocal
