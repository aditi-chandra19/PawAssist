@echo off
setlocal

set "ROOT=C:\Users\ADITI\OneDrive\Desktop\VScodeee\PawAssist"
set "SERVER_DIR=%ROOT%\server"
set "CLIENT_DIR=%ROOT%\client"

echo Starting PawAssist backend...
start "PawAssist API" cmd /k "cd /d %SERVER_DIR% && node server.js"

echo Starting PawAssist frontend...
start "PawAssist Client" cmd /k "cd /d %CLIENT_DIR% && npm.cmd run dev"

echo.
echo PawAssist is starting in two new terminals.
echo Keep both windows open while using the app.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000

endlocal
