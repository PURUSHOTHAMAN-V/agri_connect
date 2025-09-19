@echo off
echo 🌾 Starting Direct AgriConnect TN - Complete Agricultural Marketplace
echo =================================================================

echo 🔍 Checking dependencies...

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js first.
    pause
    exit /b 1
)

REM Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python not found. Please install Python first.
    pause
    exit /b 1
)

echo ✅ Dependencies found
echo 📊 Note: Make sure PostgreSQL is running on localhost:5432
echo.
echo 🚀 Starting all services...
echo.

REM Start Frontend
echo 📱 Starting Frontend (React) on http://localhost:5173
start "Frontend" cmd /k "cd frontend && npm run dev"

REM Wait
timeout /t 3 /nobreak >nul

REM Start Backend
echo 🔧 Starting Backend (Node.js) on http://localhost:5000
start "Backend" cmd /k "cd backend && npm run dev"

REM Wait
timeout /t 3 /nobreak >nul

REM Start ML Service
echo 🤖 Starting ML Service (Python) on http://localhost:8000
start "ML Service" cmd /k "cd ml-service && python main.py"

echo.
echo 🎉 All services are starting up!
echo.
echo 📋 Service URLs:
echo    Frontend:  http://localhost:5173
echo    Backend:   http://localhost:5000
echo    ML Service: http://localhost:8000
echo.
echo 📚 API Documentation:
echo    Backend API: http://localhost:5000/api
echo    ML API Docs: http://localhost:8000/docs
echo.
echo 💡 To stop all services, close the command windows
echo.
echo 🌾 Direct AgriConnect TN is ready for Tamil Nadu farmers!
pause

