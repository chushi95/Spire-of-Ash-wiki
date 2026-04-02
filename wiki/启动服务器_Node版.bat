@echo off
cd /d "%~dp0"
echo ========================================
echo Spire of Ash Wiki 本地服务器
echo ========================================
echo.
echo 正在启动 Node.js 服务器...
echo.
echo 服务器启动后，请在浏览器中访问:
echo http://localhost:8080
echo.
echo 按 Ctrl+C 停止服务器
echo ========================================
echo.

node server.js

pause
