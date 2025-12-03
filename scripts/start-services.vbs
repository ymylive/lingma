' 灵码服务启动脚本 - 开机自启动
' 静默启动AI代理和前端开发服务器

Set WshShell = CreateObject("WScript.Shell")

' 项目路径
projectPath = "E:\project\tumafang"

' 启动AI代理服务
WshShell.Run "cmd /c cd /d " & projectPath & "\api-proxy && set AI_API_KEY=sk-vJy5jCgbzjksuW1njIbymPABzjK4UkuIVT3fD7MNLmmY570R && set AI_API_URL=https://api.aabao.top/v1/chat/completions && set AI_MODEL=deepseek-v3.2-exp-thinking && node server.js", 0, False

' 等待2秒
WScript.Sleep 2000

' 启动前端开发服务器
WshShell.Run "cmd /c cd /d " & projectPath & " && npm run dev", 0, False

Set WshShell = Nothing
