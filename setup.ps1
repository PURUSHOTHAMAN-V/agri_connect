# Direct AgriConnect TN Setup Script for Windows PowerShell

Write-Host "🌾 Setting up Direct AgriConnect TN..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if Python is installed
try {
    $pythonVersion = python --version
    Write-Host "✅ Python version: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python is not installed. Please install Python first." -ForegroundColor Red
    exit 1
}

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
npm install --legacy-peer-deps

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Go back to root directory
Set-Location ..

# Install ML service dependencies
Write-Host "📦 Installing ML service dependencies..." -ForegroundColor Yellow
Set-Location ml-service
pip install -r requirements.txt

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ ML service dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install ML service dependencies" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Go back to root directory
Set-Location ..

Write-Host "🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Set up PostgreSQL database" -ForegroundColor White
Write-Host "2. Configure environment variables" -ForegroundColor White
Write-Host "3. Run: npm run dev (for frontend)" -ForegroundColor White
Write-Host "4. Run: cd backend && npm run dev (for backend)" -ForegroundColor White
Write-Host "5. Run: cd ml-service && python main.py (for ML service)" -ForegroundColor White

