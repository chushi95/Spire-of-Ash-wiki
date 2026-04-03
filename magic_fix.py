
with open('js/main.js', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# 直接替换那一段
old_code = '''            return '&lt;div class="card quality-' + quality + '" data-index="' + dataIndex + '"&gt;' +
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

new_code = '''            return '&lt;div class="card quality-' + quality + '" data-index="' + dataIndex + '"&gt;' +
                '&lt;div class="card-header"&gt;' +
                    '&lt;div class="card-title-wrapper"&gt;' +
                        '&lt;h3&gt;' + name + '&lt;/h3&gt;' +
                        qualityBadge +
                        itemIconHtml +
                    '&lt;/div&gt;' +
                '&lt;/div&gt;' +
                cardContent +
            '&lt;/div&gt;';'''

if old_code in content:
    content = content.replace(old_code, new_code)
    print("成功替换！")
else:
    print("没有找到，尝试不那么精确的匹配...")
    # 尝试部分替换
    if '&lt;div class="card-title"&gt;' in content:
        content = content.replace('&lt;div class="card-title"&gt;', '')
        content = content.replace('&lt;/div&gt;', '', 2)
        # 调整缩进
        content = content.replace("                            '&lt;h3&gt;", "                        '&lt;h3&gt;")
        content = content.replace("                        qualityBadge", "                        qualityBadge")
        content = content.replace("                    itemIconHtml", "                        itemIconHtml")
        print("部分替换完成！")

# 保存
with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("完成！")
