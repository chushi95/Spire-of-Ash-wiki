
import json

# 读取items.json
with open('data/items.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

# 更新每个武器的图片路径
for item in items:
    if item['name_id'] == 'axe_1h_rusted':
        item['image'] = 'images/axe_rusted.webp'
    elif item['name_id'] == 'axe_1h_forged':
        item['image'] = 'images/axe_forged.webp'
    elif item['name_id'] == 'axe_1h_tempered':
        item['image'] = 'images/axe_tempered.webp'
    elif item['name_id'] == 'axe_1h_masterwork':
        item['image'] = 'images/axe_masterwork.webp'
    elif item['name_id'] == 'axe_1h_legendary':
        item['image'] = 'images/axe_legendary.webp'
    elif item['name_id'] == 'axe_1h_mythic':
        item['image'] = 'images/axe_mythic.webp'

# 保存更新后的文件
with open('data/items.json', 'w', encoding='utf-8') as f:
    json.dump(items, f, ensure_ascii=False, indent=2)

print('Items updated successfully!')
