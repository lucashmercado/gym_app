# Script para sincronizar el esquema de la base de datos en produccion
Write-Host "Sincronizando esquema de base de datos..." -ForegroundColor Yellow

npx prisma db push --accept-data-loss

if ($LASTEXITCODE -eq 0) {
    Write-Host "Esquema sincronizado exitosamente" -ForegroundColor Green
    Write-Host "Creando usuario administrador..." -ForegroundColor Yellow
    
    node scripts/setup-admin-vercel.js
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Configuracion completada!" -ForegroundColor Green
        Write-Host "Puedes hacer login en: https://gym-app-green-two.vercel.app/login"
        Write-Host "Email: admin@gym.com"
        Write-Host "Password: admin123"
    }
}
