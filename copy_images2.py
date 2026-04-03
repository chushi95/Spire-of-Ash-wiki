
import shutil
import os

# 源目录和目标目录
source_dir = r'C:\Users\wangc\Desktop\Spire of Ash Wiki\Spire of Ash\resources\game\dist\assets'
target_dir = r'C:\Users\wangc\Desktop\Spire of Ash Wiki\wiki\images'

# 图片映射关系
image_mapping = {
    'Rusted One-handed Axe-DFiblIna.webp': 'axe_rusted.webp',
    'Forged One-handed Axe-DKpxWpLS.webp': 'axe_forged.webp',
    'Tempered One-handed Axe-CiHOXaJT.webp': 'axe_tempered.webp',
    'Masterwork One-handed Axe-shbxwlQ8.webp': 'axe_masterwork.webp',
    'Legendary One-handed Axe-Bur-nrTt.webp': 'axe_legendary.webp',
    'Mythic One-handed Axe-Cj1edd1a.webp': 'axe_mythic.webp'
}

print('Copying images...')

for source_name, target_name in image_mapping.items():
    source_path = os.path.join(source_dir, source_name)
    target_path = os.path.join(target_dir, target_name)
    
    if os.path.exists(source_path):
        shutil.copy2(source_path, target_path)
        print('OK: ' + source_name + ' -> ' + target_name)
    else:
        print('ERROR: File not found: ' + source_name)

print('Done!')
