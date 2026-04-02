@echo off
echo ========================================
echo Spire of Ash Wiki 本地服务器
echo ========================================
echo.
echo 正在启动本地服务器...
echo.
echo 服务器启动后，请在浏览器中访问:
echo http://localhost:8000
echo.
echo 按 Ctrl+C 停止服务器
echo ========================================
echo.

cd /d "%~dp0"

powershell -Command "try { $listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://localhost:8000/'); $listener.Start(); Write-Host '服务器已启动！'; Write-Host '访问地址: http://localhost:8000'; while($listener.IsListening) { $context = $listener.GetContext(); $request = $context.Request; $response = $context.Response; $url = $request.Url.LocalPath; if($url -eq '/') { $url = '/index.html' }; $filePath = Join-Path $PWD $url.TrimStart('/'); if(Test-Path $filePath -PathType Leaf) { $content = [System.IO.File]::ReadAllBytes($filePath); $ext = [System.IO.Path]::GetExtension($filePath); $contentType = 'text/html'; switch($ext) { '.js' { $contentType = 'application/javascript' }; '.css' { $contentType = 'text/css' }; '.json' { $contentType = 'application/json' }; '.png' { $contentType = 'image/png' }; '.jpg' { $contentType = 'image/jpeg' }; '.gif' { $contentType = 'image/gif' }; '.svg' { $contentType = 'image/svg+xml' } }; $response.ContentType = $contentType; $response.ContentLength64 = $content.Length; $response.OutputStream.Write($content, 0, $content.Length); Write-Host \"200 $url\" } else { $response.StatusCode = 404; $errorMsg = [System.Text.Encoding]::UTF8.GetBytes('404 Not Found'); $response.OutputStream.Write($errorMsg, 0, $errorMsg.Length); Write-Host \"404 $url\" }; $response.Close() } } catch { Write-Host '错误:' $_.Exception.Message; pause }"
