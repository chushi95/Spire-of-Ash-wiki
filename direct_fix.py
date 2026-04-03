
with open('js/main.js', 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

# 替换第 684-690 行（注意Python的索引是从0开始的）
# 原内容：
# 684:                    '&lt;div class="card-title-wrapper"&gt;' +
# 685:                        '&lt;div class="card-title"&gt;' +
# 686:                            '&lt;h3&gt;' + name + '&lt;/h3&gt;' +
# 687:                        qualityBadge +
# 688:                        '&lt;/div&gt;' +
# 689:                    '&lt;/div&gt;' +
# 690:                    itemIconHtml +

# 新内容：
# 684:                    '&lt;div class="card-title-wrapper"&gt;' +
# 685:                        '&lt;h3&gt;' + name + '&lt;/h3&gt;' +
# 686:                        qualityBadge +
# 687:                        itemIconHtml +
# 688:                    '&lt;/div&gt;' +

# 找到正确的行号，让我们搜索
for i in range(len(lines)):
    if 'card-title-wrapper' in lines[i] and i+6 &lt; len(lines):
        if ('card-title' in lines[i+1] and 
            'h3' in lines[i+2] and 
            'qualityBadge' in lines[i+3] and 
            '/div' in lines[i+4] and 
            '/div' in lines[i+5] and 
            'itemIconHtml' in lines[i+6]):
            # 找到了！现在替换这些行
            new_section = [
                lines[i],  # card-title-wrapper
                "                        '&lt;h3&gt;' + name + '&lt;/h3&gt;' +\n",
                "                        qualityBadge +\n",
                "                        itemIconHtml +\n",
                "                    '&lt;/div&gt;' +\n"
            ]
            # 替换 i 到 i+6 的内容为新的内容
            lines = lines[:i] + new_section + lines[i+7:]
            print("找到并替换成功！")
            break

# 保存
with open('js/main.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("完成！")
