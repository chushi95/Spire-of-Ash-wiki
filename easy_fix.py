
with open('js/main.js', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# 把不需要的标签删掉
content = content.replace('&lt;div class="card-title"&gt;', '')
content = content.replace('&lt;/div&gt;', '', 2)  # 删除后面两个多余的 &lt;/div&gt;

# 调整缩进
content = content.replace("                            '&lt;h3&gt;", "                        '&lt;h3&gt;")
content = content.replace("                            qualityBadge", "                        qualityBadge")
content = content.replace("                    itemIconHtml", "                        itemIconHtml")

# 保存
with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done!")
