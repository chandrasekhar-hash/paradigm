@echo off
title Event Page Backend (PARADIGM API :8005)
echo ============================================================
echo   Starting PARADIGM Event Backend (:8005)
echo   Connected to: separate-management-dashboard database
echo ============================================================
echo.

cd /d "%~dp0backend"
python run_backend.py
pause

