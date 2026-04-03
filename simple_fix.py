
with open('js/main.js', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# 简单的替换方法
# 先找到第 682-693 行附近的内容
lines = content.split('\n')

# 查找需要修改的行
for i in range(len(lines)):
    if 'card-title-wrapper' in lines[i] and i+8 &lt; len(lines):
        # 检查接下来的几行
        if ('card-title' in lines[i+1] and 
            'h3' in lines[i+2] and 
            'qualityBadge' in lines[i+3] and 
            '/div' in lines[i+4] and 
            '/div' in lines[i+5] and 
            'itemIconHtml' in lines[i+6]):
            # 找到需要修改的部分！
            # 构建新的行
            new_lines = [
                lines[i],  # card-title-wrapper
                '                        \'&lt;h3&gt;\' + name + \'&lt;/h3&gt;\' +',
                '                        qualityBadge +',
                '                        itemIconHtml +',
                '                    \'&lt;/div&gt;\' +',
                lines[i+7],  # card-header closing
                lines[i+8]   # cardContent
            ]
            # 替换
            lines = lines[:i] + new_lines + lines[i+9:]
            print("修改成功！")
            break

# 保存
with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print("完成！")
