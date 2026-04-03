
# 读取文件
with open('js/main.js', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# 旧的代码
old = '''            return '&lt;div class="card quality-' + quality + '" data-index="' + dataIndex + '"&gt;' +
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

# 新的代码 - 装备名称、稀有度标签、图片都在 card-title-wrapper 里
new = '''            return '&lt;div class="card quality-' + quality + '" data-index="' + dataIndex + '"&gt;' +
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
content = content.replace(old, new)

# 保存
with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("修改完成！")
