
with open('js/main.js', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# 找到并替换剩余的部分
old = '''                    '&lt;div class="card-title-wrapper"&gt;' +
                        '&lt;div class="card-title"&gt;' +
                            '&lt;h3&gt;' + name + '&lt;/h3&gt;' +
                        qualityBadge +
                        '&lt;/div&gt;' +
                    '&lt;/div&gt;' +
                    itemIconHtml +'''

new = '''                    '&lt;div class="card-title-wrapper"&gt;' +
                        '&lt;h3&gt;' + name + '&lt;/h3&gt;' +
                        qualityBadge +
                        itemIconHtml +
                    '&lt;/div&gt;' +'''

content = content.replace(old, new)

# 保存
with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done!")
