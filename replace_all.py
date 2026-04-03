
with open('js/main.js', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# 精确匹配并替换
old_text = '''            return '&lt;div class="card quality-' + quality + '" data-index="' + dataIndex + '"&gt;' +
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

new_text = '''            return '&lt;div class="card quality-' + quality + '" data-index="' + dataIndex + '"&gt;' +
                '&lt;div class="card-header"&gt;' +
                    '&lt;div class="card-title-wrapper"&gt;' +
                        '&lt;h3&gt;' + name + '&lt;/h3&gt;' +
                        qualityBadge +
                        itemIconHtml +
                    '&lt;/div&gt;' +
                '&lt;/div&gt;' +
                cardContent +
            '&lt;/div&gt;';'''

if old_text in content:
    content = content.replace(old_text, new_text)
    print("找到并替换成功！")
else:
    print("没有找到匹配的文本")

# 保存
with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("完成！")
