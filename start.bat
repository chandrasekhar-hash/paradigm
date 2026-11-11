@echo off
title Start PARADIGM Event Page (Backend :8005, Frontend)
echo ============================================================
echo   Starting PARADIGM Event Page Fullstack System
echo   Backend:  http://localhost:8005 (FastAPI / edutrack.db)
echo   Frontend: http://localhost:5175 (React Three Fiber / Vite)
echo ============================================================
echo.

cd /d "%~dp0"

echo [1/2] Starting Event Backend (Port 8005)...
start "PARADIGM Event Backend (:8005)" cmd /k "cd backend && python run_backend.py"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Event Frontend...
start "PARADIGM Event Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both services launched!
echo Backend API Docs: http://localhost:8005/docs
echo.
pause

