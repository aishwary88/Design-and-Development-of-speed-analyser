@echo off
echo ========================================
echo   Traffic Speed Analyser Dashboard
echo ========================================
echo.

echo Starting Dashboard...
echo.

echo Step 1: Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0dashboard && python backend.py"

echo Step 2: Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d %~dp0dashboard && npm start"

echo.
echo Dashboard starting...
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to open in browser...
pause >nul

echo Opening dashboard in browser...
start http://localhost:3000

echo.
echo Dashboard started successfully!
echo.
echo To stop servers, close the command windows.
echo.

timeout /t 5 >nul