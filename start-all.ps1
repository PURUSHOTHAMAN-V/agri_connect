# Direct AgriConnect TN - Complete Startup Script
# This script starts all services (Frontend, Backend, ML Service)

Write-Host "🌾 Starting Direct AgriConnect TN - Complete Agricultural Marketplace" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Green

# Check if all dependencies are installed
Write-Host "🔍 Checking dependencies..." -ForegroundColor Yellow

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check Python
try {
    $pythonVersion = python --version
    Write-Host "✅ Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found. Please install Python first." -ForegroundColor Red
    exit 1
}

# Check if PostgreSQL is running (optional)
Write-Host "📊 Note: Make sure PostgreSQL is running on localhost:5432" -ForegroundColor Cyan

Write-Host ""
Write-Host "🚀 Starting all services..." -ForegroundColor Green
Write-Host ""

# Start Frontend (React)
Write-Host "📱 Starting Frontend (React) on http://localhost:5173" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

# Wait a moment
Start-Sleep -Seconds 3

# Start Backend (Node.js)
Write-Host "🔧 Starting Backend (Node.js) on http://localhost:5000" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# Wait a moment
Start-Sleep -Seconds 3

# Start ML Service (Python)
Write-Host "🤖 Starting ML Service (Python) on http://localhost:8000" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ml-service; python main.py"

Write-Host ""
Write-Host "🎉 All services are starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Service URLs:" -ForegroundColor Yellow
Write-Host "   Frontend:  http://localhost:5173" -ForegroundColor White
Write-Host "   Backend:   http://localhost:5000" -ForegroundColor White
Write-Host "   ML Service: http://localhost:8000" -ForegroundColor White
Write-Host ""
Write-Host "📚 API Documentation:" -ForegroundColor Yellow
Write-Host "   Backend API: http://localhost:5000/api" -ForegroundColor White
Write-Host "   ML API Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "💡 To stop all services, close the PowerShell windows or press Ctrl+C" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌾 Direct AgriConnect TN is ready for Tamil Nadu farmers!" -ForegroundColor Green

