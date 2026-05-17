# Script khởi tạo database PostgreSQL cho dApp Quản Lý Thuê Nhà
# Chạy: .\database\setup.ps1

# Fix lỗi encoding Tiếng Việt trên Windows cho psql
$env:PGCLIENTENCODING = "utf8"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$psql = "C:\Program Files\PostgreSQL\16\bin\psql.exe"
$user = "postgres"
$db   = "quanlythuenha"

Write-Host "==> Tạo database '$db'..." -ForegroundColor Cyan
& $psql -U $user -c "CREATE DATABASE $db ENCODING 'UTF8';"

Write-Host "==> Chạy schema..." -ForegroundColor Cyan
& $psql -U $user -d $db -f "$PSScriptRoot\schema.sql"

Write-Host "==> Nạp dữ liệu mẫu (seed)..." -ForegroundColor Cyan
& $psql -U $user -d $db -f "$PSScriptRoot\seed.sql"

Write-Host "Hoàn tất! Database '$db' đã sẵn sàng." -ForegroundColor Green
