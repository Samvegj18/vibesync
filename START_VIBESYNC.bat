@echo off
title VibeSync Launcher
echo.
echo  ========================================
echo    🎵 Starting VibeSync...
echo  ========================================
echo.

:: Start Backend Server
echo [1/2] Starting Backend Server (port 5000)...
cd /d "C:\Users\ujjwa\.gemini\antigravity\scratch\vibesync\server"
start "VibeSync Backend" cmd /k "node server.js"

:: Wait for backend to start
timeout /t 3 /nobreak >nul

:: Start Frontend Dev Server
echo [2/2] Starting Frontend (port 5173)...
cd /d "C:\Users\ujjwa\.gemini\antigravity\scratch\vibesync\client"
start "VibeSync Frontend" cmd /k "npm run dev"

:: Wait and open browser
timeout /t 4 /nobreak >nul
echo.
echo  ========================================
echo    ✅ VibeSync is running!
echo    🌐 Opening http://localhost:5173
echo  ========================================
echo.
start http://localhost:5173

echo Press any key to close this window...
pause >nul
