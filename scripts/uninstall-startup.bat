@echo off
chcp 65001 >nul
echo ========================================
echo   灵码服务 - 卸载开机自启动
echo ========================================

set STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
set SHORTCUT_PATH=%STARTUP_FOLDER%\灵码服务.lnk

if exist "%SHORTCUT_PATH%" (
    del "%SHORTCUT_PATH%"
    echo ✅ 开机启动项已卸载!
) else (
    echo ℹ️ 未找到启动项
)

echo.
pause
