# Локальный сервер для теста мокапа на iPhone/iPad
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

Write-Host ''
Write-Host '========================================'
Write-Host '  Мокап касс — доступ с iPhone / iPad'
Write-Host '========================================'
Write-Host ''
Write-Host 'iPhone и компьютер — одна Wi-Fi сеть (не гостевая).'
Write-Host 'Откройте в Safari:'
Write-Host ''

$ips = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
  Where-Object {
    $_.IPAddress -match '^(192\.168\.|10\.)' -and
    $_.PrefixOrigin -ne 'WellKnown'
  } |
  Select-Object -ExpandProperty IPAddress -Unique

if (-not $ips) {
  Write-Host '  Wi-Fi IP не найден. Смотрите ipconfig.'
} else {
  foreach ($ip in $ips) {
    Write-Host "  http://${ip}:8765/kassa-mockup-emails.html"
  }
  $first = $ips[0]
  Write-Host ''
  Write-Host "Проверка на ПК: http://${first}:8765/kassa-mockup-emails.html"
  Start-Process "http://${first}:8765/kassa-mockup-emails.html"
}

$rule = Get-NetFirewallRule -DisplayName 'Kassa Mockup HTTP' -ErrorAction SilentlyContinue
if (-not $rule) {
  try {
    New-NetFirewallRule -DisplayName 'Kassa Mockup HTTP' -Direction Inbound -Action Allow -Protocol TCP -LocalPort 8765 | Out-Null
    Write-Host ''
    Write-Host '[OK] Порт 8765 открыт в брандмауэре.'
  } catch {
    Write-Host ''
    Write-Host '[!] Запустите PowerShell от администратора, чтобы открыть порт 8765.'
  }
}

Write-Host ''
Write-Host 'Сервер запущен. Не закрывайте окно.'
Write-Host ''

if (Get-Command py -ErrorAction SilentlyContinue) {
  py -3 -m http.server 8765 --bind 0.0.0.0
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
  python -m http.server 8765 --bind 0.0.0.0
} elseif (Get-Command npx -ErrorAction SilentlyContinue) {
  npx --yes serve -l 8765 --no-clipboard .
} else {
  Write-Host 'Установите Python: https://www.python.org/downloads/'
  Read-Host 'Enter для выхода'
}
