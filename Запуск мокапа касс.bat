@echo off
chcp 65001 >nul
echo Для iPhone/iPad используйте «Запуск для iPhone.bat» — открытие файла напрямую блокирует отправку email.
start "" "%~dp0kassa-mockup-emails.html"
