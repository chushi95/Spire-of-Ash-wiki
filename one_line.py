
# 超级简单！
with open('js/main.js', 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

new_lines = []
i = 0

while i &lt; len(lines):
    # 检查是否是我们要修改的部分
    if i + 6 &lt; len(lines) and 'card-title-wrapper' in lines[i]:
        if ('card-title' in lines[i+1] and 
            'h3' in lines[i+2] and 
            'qualityBadge' in lines[i+3] and 
            '/div' in lines[i+4] and 
            '/div' in lines[i+5] and 
            'itemIconHtml' in lines[i+6]):
            # 找到了！
            new_lines.append(lines[i])
            line = lines[i+2].replace('                            ', '                        ')
            new_lines.append(line)
            new_lines.append(lines[i+3])
            line = lines[i+6].replace('                    ', '                        ')
            new_lines.append(line)
            new_lines.append(lines[i+5])
            i += 7
            continue
    
    new_lines.append(lines[i])
    i += 1

with open('js/main.js', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print('Done!')
