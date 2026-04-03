
with open('js/main.js', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# 最后的修改
content = content.replace("                        '&lt;div class=\"card-title\"&gt;' +", '')
content = content.replace("                        '&lt;/div&gt;' +", '')

# 保存
with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done!")
