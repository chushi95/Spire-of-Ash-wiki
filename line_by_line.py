
with open('js/main.js', 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

new_lines = []
i = 0
skip_count = 0

while i &lt; len(lines):
    if skip_count &gt; 0:
        skip_count -= 1
        i += 1
        continue
    
    if "card-title-wrapper" in lines[i] and i + 8 &lt; len(lines):
        if ("card-title" in lines[i+1] and 
            "h3" in lines[i+2] and 
            "qualityBadge" in lines[i+3] and 
            "/div" in lines[i+4] and 
            "/div" in lines[i+5] and 
            "itemIconHtml" in lines[i+6]):
            new_lines.append(lines[i])
            line = lines[i+2].replace("                            ", "                        ")
            new_lines.append(line)
            line = lines[i+3].replace("                            ", "                        ")
            new_lines.append(line)
            line = lines[i+6].replace("                    ", "                        ")
            new_lines.append(line)
            new_lines.append(lines[i+5])
            skip_count = 7
            i += 1
            print("修改成功！")
            continue
    
    new_lines.append(lines[i])
    i += 1

with open('js/main.js', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("完成！")
