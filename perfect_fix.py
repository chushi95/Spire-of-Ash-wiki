
# 完美修复！
with open('js/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 目标：找到这段代码
# 现在是：
#            return '<div class="card quality-' + quality + '" data-index="' + dataIndex + '">' +
#                '<div class="card-header">' +
#                    '<div class="card-title-wrapper">' +
#                        '<h3>' + name + '</h3>' +
#                    '</div>' +
#                        itemIconHtml +
#                '</div>' +
#                cardContent +
#            '</div>';

# 应该变成：
#            return '<div class="card quality-' + quality + '" data-index="' + dataIndex + '">' +
#                '<div class="card-header">' +
#                    '<div class="card-title-wrapper">' +
#                        '<h3>' + name + '</h3>' +
#                        qualityBadge +
#                        itemIconHtml +
#                    '</div>' +
#                '</div>' +
#                cardContent +
#            '</div>';

old = '''            return '<div class="card quality-' + quality + '" data-index="' + dataIndex + '">' +
                '<div class="card-header">' +
                    '<div class="card-title-wrapper">' +
                        '<h3>' + name + '</h3>' +
                    '</div>' +
                        itemIconHtml +
                '</div>' +
                cardContent +
            '</div>';'''

new = '''            return '<div class="card quality-' + quality + '" data-index="' + dataIndex + '">' +
                '<div class="card-header">' +
                    '<div class="card-title-wrapper">' +
                        '<h3>' + name + '</h3>' +
                        qualityBadge +
                        itemIconHtml +
                    '</div>' +
                '</div>' +
                cardContent +
            '</div>';'''

# 替换！
content = content.replace(old, new)

# 保存！
with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('Perfect fix applied!')
