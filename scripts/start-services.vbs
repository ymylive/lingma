' 灵码服务启动脚本 - 开机自启动
' 静默启动AI代理和前端开发服务器
' 依赖环境变量：LINGMA_AI_API_KEY，可选：LINGMA_AI_API_URL、LINGMA_AI_MODEL

Set WshShell = CreateObject("WScript.Shell")

projectPath = "E:\project\tumafang"
aiUrl = WshShell.ExpandEnvironmentStrings("%LINGMA_AI_API_URL%")
aiModel = WshShell.ExpandEnvironmentStrings("%LINGMA_AI_MODEL%")

If aiUrl = "%LINGMA_AI_API_URL%" Then
  aiUrl = "https://openrouter.ai/api/v1/chat/completions"
End If

If aiModel = "%LINGMA_AI_MODEL%" Then
  aiModel = "openrouter/auto"
End If

WshShell.Run "cmd /c if not defined LINGMA_AI_API_KEY exit /b 1 && cd /d " & projectPath & "\api-proxy && set AI_API_KEY=%LINGMA_AI_API_KEY% && set AI_API_URL=" & aiUrl & " && set AI_MODEL=" & aiModel & " && python -m uvicorn main:app --host 127.0.0.1 --port 3001", 0, False

WScript.Sleep 2000

WshShell.Run "cmd /c cd /d " & projectPath & " && npm run dev", 0, False

Set WshShell = Nothing
