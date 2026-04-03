
# 超级简单的方法
with open('js/main.js', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# 直接用简单的替换
# 移除不需要的部分
content = content.replace("                        '&lt;div class=\"card-title\"&gt;' +", '')
content = content.replace("                            '&lt;h3&gt;' + name + '&lt;/h3&gt;' +", "                        '&lt;h3&gt;' + name + '&lt;/h3&gt;' +")
content = content.replace("                            qualityBadge +", "                        qualityBadge +")
content = content.replace("                        '&lt;/div&gt;' +", '')
content = content.replace("                    '&lt;/div&gt;' +" + '\n' + "                    itemIconHtml +", "                        itemIconHtml +" + '\n' + "                    '&lt;/div&gt;' +")

# 保存
with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done!")
