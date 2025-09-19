@echo off
echo 🌾 Setting up Direct AgriConnect TN...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python first.
    pause
    exit /b 1
)

echo 📦 Installing frontend dependencies...
npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

echo 📦 Installing backend dependencies...
cd backend
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo 📦 Installing ML service dependencies...
cd ml-service
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Failed to install ML service dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo 🎉 Setup completed successfully!
echo.
echo Next steps:
echo 1. Set up PostgreSQL database
echo 2. Configure environment variables
echo 3. Run: npm run dev (for frontend)
echo 4. Run: cd backend && npm run dev (for backend)
echo 5. Run: cd ml-service && python main.py (for ML service)
pause

