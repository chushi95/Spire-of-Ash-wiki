
with open('js/main.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 找到我们要修改的部分
for i in range(len(lines)):
    if "card-title-wrapper" in lines[i] and i + 6 &lt; len(lines):
        # 检查接下来的几行
        if ("card-title" in lines[i+1] and 
            "h3" in lines[i+2] and 
            "qualityBadge" in lines[i+3] and 
            "/div" in lines[i+4] and 
            "/div" in lines[i+5] and 
            "itemIconHtml" in lines[i+6]):
            # 找到了！现在重新构造这部分
            new_lines = []
            new_lines.append(lines[i])  # 第1行不变
            # 调整缩进
            line = lines[i+2].replace("                            ", "                        ")
            new_lines.append(line)
            line = lines[i+3].replace("                            ", "                        ")
            new_lines.append(line)
            line = lines[i+6].replace("                    ", "                        ")
            new_lines.append(line)
            new_lines.append(lines[i+5])
            # 替换这部分
            lines = lines[:i] + new_lines + lines[i+7:]
            print("修改成功！")
            break

# 保存
with open('js/main.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("完成！")
