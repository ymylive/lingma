@echo off
chcp 65001 >nul
echo ========================================
echo   灵码服务 - 安装开机自启动
echo ========================================

set SCRIPT_PATH=%~dp0start-services.vbs
set STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
set SHORTCUT_PATH=%STARTUP_FOLDER%\灵码服务.lnk

echo.
echo 正在创建开机启动项...

:: 创建快捷方式
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%SHORTCUT_PATH%'); $s.TargetPath = 'wscript.exe'; $s.Arguments = '\"%SCRIPT_PATH%\"'; $s.WorkingDirectory = '%~dp0..'; $s.Description = '灵码AI学习平台服务'; $s.Save()"

if exist "%SHORTCUT_PATH%" (
    echo ✅ 开机启动项已安装!
    echo 位置: %SHORTCUT_PATH%
) else (
    echo ❌ 安装失败，请以管理员身份运行
)

echo.
pause
