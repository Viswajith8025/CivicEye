@echo off
echo Starting Civic Eye (backend + frontend)...
echo.

start "CivicEye API" cmd /k "cd /d %~dp0backend && npm start"
timeout /t 4 /nobreak >nul
start "CivicEye Web" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Backend:  http://localhost:5001/health
echo Frontend: http://localhost:5173
echo.
echo Demo admin:    admin@civiceye.local / Admin@12345
echo Demo citizen:  citizen@civiceye.local / Citizen@12345
pause
