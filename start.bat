@echo off
echo ========================================
echo    🎨 Chromp - Iniciando
echo ========================================
echo.

docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker no instalado
    pause
    exit /b 1
)

echo 📦 Construyendo contenedor...
docker-compose build

if errorlevel 1 (
    echo ❌ Error en build
    pause
    exit /b 1
)

echo 🚀 Iniciando servicios...
docker-compose up -d

echo.
echo ========================================
echo ✅ Chromp funcionando!
echo ========================================
echo 🌐 Abre: http://localhost:8080
echo.
echo 📝 Comandos:
echo   Logs: docker-compose logs -f
echo   Stop: docker-compose down
echo ========================================
pause