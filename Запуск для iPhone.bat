@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ========================================
echo   Мокап касс — доступ с iPhone / iPad
echo ========================================
echo.
echo iPhone и компьютер должны быть в одной Wi-Fi (не гостевой сети).
echo Откройте в Safari одну из ссылок:
echo.

set "FOUND=0"
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
  for /f "tokens=* delims= " %%b in ("%%a") do (
    echo %%b | findstr /r "^192\.168\." >nul && (
      echo    http://%%b:8765/kassa-mockup-emails.html
      set "FOUND=1"
      if "!FIRST_IP!"=="" set "FIRST_IP=%%b"
    )
    echo %%b | findstr /r "^10\." >nul && (
      echo    http://%%b:8765/kassa-mockup-emails.html
      set "FOUND=1"
      if "!FIRST_IP!"=="" set "FIRST_IP=%%b"
    )
  )
)

if "!FOUND!"=="0" (
  echo    Wi-Fi IP не найден. Запустите ipconfig и найдите адрес 192.168.x.x
  echo    Затем откройте: http://ВАШ_IP:8765/kassa-mockup-emails.html
  echo.
  echo    Все IPv4 на этом ПК:
  for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    for /f "tokens=* delims= " %%b in ("%%a") do echo      %%b
  )
) else (
  echo.
  echo Проверка на компьютере (должна открыться страница):
  echo    http://!FIRST_IP!:8765/kassa-mockup-emails.html
)

echo.
echo Не закрывайте это окно, пока тестируете на iPhone.
echo.

netsh advfirewall firewall show rule name="Kassa Mockup HTTP" >nul 2>&1
if errorlevel 1 (
  netsh advfirewall firewall add rule name="Kassa Mockup HTTP" dir=in action=allow protocol=TCP localport=8765 >nul 2>&1
  if not errorlevel 1 (
    echo [OK] Порт 8765 разрешён в брандмауэре Windows.
  ) else (
    echo [!] Не удалось открыть порт автоматически.
    echo     Запустите этот файл от имени администратора
    echo     или разрешите Python/Node в брандмауэре вручную.
  )
)

if defined FIRST_IP (
  start "" "http://!FIRST_IP!:8765/kassa-mockup-emails.html"
)

echo.
echo Запуск сервера на 0.0.0.0:8765 ...
echo.

where py >nul 2>&1
if not errorlevel 1 (
  py -3 -m http.server 8765 --bind 0.0.0.0
  goto :end
)

where python >nul 2>&1
if not errorlevel 1 (
  python -m http.server 8765 --bind 0.0.0.0
  goto :end
)

where npx >nul 2>&1
if not errorlevel 1 (
  npx --yes serve -l 8765 --no-clipboard .
  goto :end
)

echo Python и Node не найдены. Установите Python с python.org
pause

:end
endlocal
