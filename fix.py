
# 最简单的修复！
with open('js/main.js', 'r', encoding='utf-8') as f:
    lines = f.read().splitlines()

# 精确替换第 685-690 行
# 原始：
# 685:                        '<div class="card-title">' +
# 686:                            '<h3>' + name + '</h3>' +
# 687:                        qualityBadge +
# 688:                        '</div>' +
# 689:                    '</div>' +
# 690:                        itemIconHtml +

# 替换为：
# 685:                        '<h3>' + name + '</h3>' +
# 686:                        qualityBadge +
# 687:                        itemIconHtml +

lines[684] = "                        '<h3>' + name + '</h3>' +"
lines[685] = "                        qualityBadge +"
lines[686] = "                        itemIconHtml +"
lines.pop(687)
lines.pop(686)
lines.pop(685)

with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines) + '\n')

print('Fix applied!')
