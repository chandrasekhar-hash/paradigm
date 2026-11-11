@echo off
setlocal enabledelayedexpansion
title Push PARADIGM Event Page to GitHub
echo ============================================================
echo   PARADIGM Event Page - Push to GitHub
echo ============================================================
echo.

where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Git is not installed or not in your PATH.
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

cd /d "%~dp0"

if not exist ".git" (
    echo [*] Initializing new Git repository...
    git init
    git branch -M main
)

git remote get-url origin >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [!] No remote repository is configured.
    set DEFAULT_URL=https://github.com/chandrasekhar-hash/paradigm.git
    set /p REPO_URL="Enter GitHub Repository URL (Press Enter for: '!DEFAULT_URL!'): "
    if "!REPO_URL!"=="" set REPO_URL=!DEFAULT_URL!
    git remote add origin !REPO_URL!
    echo [*] Added remote origin: !REPO_URL!
) else (
    for /f "tokens=*" %%a in ('git remote get-url origin') do set CURRENT_REMOTE=%%a
    echo [*] Current remote: !CURRENT_REMOTE!
    set /p CHANGE_REMOTE="Do you want to change this remote URL? (y/N): "
    if /i "!CHANGE_REMOTE!"=="y" (
        set /p REPO_URL="Enter new GitHub Repository URL: "
        if not "!REPO_URL!"=="" (
            git remote set-url origin !REPO_URL!
            echo [*] Updated remote origin.
        )
    )
)

set /p COMMIT_MSG="Enter commit message (Press Enter for: 'Update PARADIGM Event Page Fullstack System'): "
if "!COMMIT_MSG!"=="" set COMMIT_MSG=Update PARADIGM Event Page Fullstack System

echo.
echo [*] Staging all files...
git add .

echo [*] Committing changes...
git commit -m "!COMMIT_MSG!"

echo [*] Pushing to GitHub (main branch)...
git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ============================================================
    echo   [SUCCESS] Successfully pushed to GitHub!
    echo ============================================================
) else (
    echo.
    echo [!] Push failed or remote contains commits you do not have locally.
    echo [1] Force push (overwrite remote with local files)
    echo [2] Pull and merge remote changes first (rebase)
    echo [3] Cancel
    set /p CHOICE="Choose option (1/2/3): "
    if "!CHOICE!"=="1" (
        echo [*] Force pushing...
        git push -u origin main --force
    ) else if "!CHOICE!"=="2" (
        echo [*] Pulling with rebase...
        git pull origin main --rebase
        echo [*] Pushing...
        git push -u origin main
    )
)

echo.
pause

