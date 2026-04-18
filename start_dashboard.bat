@echo off
echo Starting Traffic Speed Analyser Dashboard...
echo.

cd dashboard

echo Installing dependencies...
call npm install

echo.
echo Starting development server...
echo Dashboard will be available at http://localhost:3000
echo.

call npm start

pause