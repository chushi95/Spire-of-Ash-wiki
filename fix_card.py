
# 读取文件，先以二进制模式读取，然后检测编码
with open('js/main.js', 'rb') as f:
    raw_data = f.read()

# 尝试用不同的编码解码
decoded = None
for encoding in ['utf-8', 'gbk', 'gb2312', 'latin1']:
    try:
        decoded = raw_data.decode(encoding)
        print(f"成功用 {encoding} 解码")
        break
    except:
        continue

if not decoded:
    decoded = raw_data.decode('utf-8', errors='ignore')
    print("用 utf-8 忽略错误解码")

# 找到我们需要修改的部分
old_part = '''            return '&lt;div class="card quality-' + quality + '" data-index="' + dataIndex + '"&gt;' +
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
            '&lt;/div&gt;';'''

new_part = '''            return '&lt;div class="card quality-' + quality + '" data-index="' + dataIndex + '"&gt;' +
                '&lt;div class="card-header"&gt;' +
                    '&lt;div class="card-title-wrapper"&gt;' +
                        '&lt;h3&gt;' + name + '&lt;/h3&gt;' +
                        qualityBadge +
                        itemIconHtml +
                    '&lt;/div&gt;' +
                '&lt;/div&gt;' +
                cardContent +
            '&lt;/div&gt;';'''

# 替换
if old_part in decoded:
    decoded = decoded.replace(old_part, new_part)
    print("找到并替换成功！")
else:
    print("没有找到需要替换的文本")
    # 尝试更简单的匹配
    if '&lt;div class="card-title"&gt;' in decoded:
        print("找到了 card-title，尝试用简单方法替换")
        # 用行级替换
        lines = decoded.split('\n')
        new_lines = []
        i = 0
        while i &lt; len(lines):
            if '&lt;div class="card-title"&gt;' in lines[i]:
                # 跳过这行和接下来的4行
                i += 5
                continue
            if 'itemIconHtml +' in lines[i] and i &gt; 0 and '&lt;/div&gt;' in lines[i-1]:
                # 把 itemIconHtml 往前移
                new_lines[-1] = new_lines[-1].replace('&lt;/div&gt;', '')
                new_lines.append(lines[i])
                new_lines.append('                    &lt;/div&gt;')
                i += 1
                continue
            new_lines.append(lines[i])
            i += 1
        decoded = '\n'.join(new_lines)
        print("用行级替换完成")

# 保存为 UTF-8
with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(decoded)

print("文件已保存！")
