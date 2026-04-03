
# 读取文件
$content = Get-Content "js\main.js" -Raw -Encoding UTF8

# 定义要替换的旧内容和新内容
$old = @"
            return '&lt;div class="card quality-' + quality + '" data-index="' + dataIndex + '"&gt;' +
                '&lt;div class="card-header"&gt;' +
                    '&lt;div class="card-title-wrapper"&gt;' +
                        '&lt;div class="card-title"&gt;' +
                            '&lt;h3&gt;' + name + '&lt;/h3&gt;' +
                        qualityBadge +
                        '&lt;/div&gt;' +
                    '&lt;/div&gt;' +
                        itemIconHtml +
                '&lt;/div&gt;' +
                cardContent +
            '&lt;/div&gt;';
"@

$new = @"
            return '&lt;div class="card quality-' + quality + '" data-index="' + dataIndex + '"&gt;' +
                '&lt;div class="card-header"&gt;' +
                    '&lt;div class="card-title-wrapper"&gt;' +
                        '&lt;h3&gt;' + name + '&lt;/h3&gt;' +
                        qualityBadge +
                        itemIconHtml +
                    '&lt;/div&gt;' +
                '&lt;/div&gt;' +
                cardContent +
            '&lt;/div&gt;';
"@

# 替换
if ($content.Contains($old)) {
    $content = $content.Replace($old, $new)
    Write-Host "找到并替换成功！"
} else {
    Write-Host "没有找到匹配的文本，尝试另一种方法..."
    
    # 另一种方法：逐行替换
    $lines = $content -split "`n"
    $newLines = @()
    $i = 0
    $skipCount = 0
    
    while ($i -lt $lines.Count) {
        if ($skipCount -gt 0) {
            $skipCount--
            $i++
            continue
        }
        
        if ($lines[$i] -match "card-title-wrapper" -and $i + 8 -lt $lines.Count) {
            if ($lines[$i+1] -match "card-title" -and 
                $lines[$i+2] -match "h3" -and 
                $lines[$i+3] -match "qualityBadge" -and 
                $lines[$i+4] -match "/div" -and 
                $lines[$i+5] -match "/div" -and 
                $lines[$i+6] -match "itemIconHtml") {
                
                $newLines += $lines[$i]
                $line = $lines[$i+2].Replace("                            ", "                        ")
                $newLines += $line
                $line = $lines[$i+3].Replace("                            ", "                        ")
                $newLines += $line
                $line = $lines[$i+6].Replace("                    ", "                        ")
                $newLines += $line
                $newLines += $lines[$i+5]
                $skipCount = 7
                $i++
                Write-Host "修改成功！"
                continue
            }
        }
        
        $newLines += $lines[$i]
        $i++
    }
    
    $content = $newLines -join "`n"
}

# 保存
$content | Set-Content "js\main.js" -Encoding UTF8 -NoNewline

Write-Host "完成！"
