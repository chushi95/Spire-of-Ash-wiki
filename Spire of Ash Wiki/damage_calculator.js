// 角色伤害计算器
// 基于技能、特性和里程碑分析每个角色的伤害数值

const characterDamageData = {
    // 进攻型角色
    "ballistic-sage": {
        name: "弹道圣者",
        role: "进攻型",
        baseStats: { damage: 120, critRate: 5, critDamage: 150 },
        skills: [
            { name: "精准射击", damage: 120, cooldown: 6, type: "single" },
            { name: "弹幕冲击", damage: 350, cooldown: 12, type: "aoe" },
            { name: "瞄准姿态", damage: 0, cooldown: 18, type: "buff" },
            { name: "终极弹幕", damage: 800, cooldown: 24, type: "ultimate" }
        ],
        milestones: {
            damageBonus: [0, 9, 10, 11, 12, 13, 15], // 1级到90级的伤害加成
            critBonus: [0, 8, 10, 11, 12, 13, 15],
            attackSpeed: [0, 8, 10, 11, 12, 13, 15]
        },
        calculatedDamage: {
            level1: 120,
            level30: 156,
            level60: 192,
            level90: 228
        }
    },
    
    "sun-forged-duelist": {
        name: "日炼决斗者",
        role: "进攻型",
        baseStats: { damage: 150, critRate: 8, critDamage: 180 },
        skills: [
            { name: "烈日斩", damage: 150, cooldown: 6, type: "single" },
            { name: "炎爆冲击", damage: 400, cooldown: 12, type: "aoe" },
            { name: "太阳姿态", damage: 0, cooldown: 18, type: "buff" },
            { name: "日耀爆发", damage: 900, cooldown: 24, type: "ultimate" }
        ],
        milestones: {
            damageBonus: [0, 9, 10, 11, 12, 13, 15],
            critBonus: [0, 8, 10, 11, 12, 13, 15],
            attackSpeed: [0, 8, 10, 11, 12, 13, 15]
        },
        calculatedDamage: {
            level1: 150,
            level30: 195,
            level60: 240,
            level90: 285
        }
    },
    
    "frost-architect": {
        name: "霜冻建筑师",
        role: "进攻型",
        baseStats: { damage: 130, critRate: 5, critDamage: 150 },
        skills: [
            { name: "冰锥术", damage: 130, cooldown: 6, type: "single" },
            { name: "冰暴", damage: 380, cooldown: 12, type: "aoe" },
            { name: "冰霜护甲", damage: 0, cooldown: 18, type: "buff" },
            { name: "冰川崩塌", damage: 850, cooldown: 24, type: "ultimate" }
        ],
        milestones: {
            damageBonus: [0, 9, 10, 11, 12, 13, 15],
            critBonus: [0, 8, 10, 11, 12, 13, 15],
            attackSpeed: [0, 8, 10, 11, 12, 13, 15]
        },
        calculatedDamage: {
            level1: 130,
            level30: 169,
            level60: 208,
            level90: 247
        }
    },
    
    "titan-guardian": {
        name: "泰坦守护",
        role: "进攻型",
        baseStats: { damage: 180, critRate: 3, critDamage: 130 },
        skills: [
            { name: "泰坦重拳", damage: 180, cooldown: 6, type: "single" },
            { name: "大地践踏", damage: 420, cooldown: 12, type: "aoe" },
            { name: "泰坦守护", damage: 0, cooldown: 18, type: "buff" },
            { name: "泰坦冲击", damage: 950, cooldown: 24, type: "ultimate" }
        ],
        milestones: {
            damageBonus: [0, 9, 10, 11, 12, 13, 15],
            critBonus: [0, 8, 10, 11, 12, 13, 15],
            attackSpeed: [0, 8, 10, 11, 12, 13, 15]
        },
        calculatedDamage: {
            level1: 180,
            level30: 234,
            level60: 288,
            level90: 342
        }
    },
    
    "gold-rush-prospector": {
        name: "淘金探者",
        role: "进攻型",
        baseStats: { damage: 140, critRate: 6, critDamage: 160 },
        skills: [
            { name: "淘金打击", damage: 140, cooldown: 6, type: "single" },
            { name: "金矿爆炸", damage: 390, cooldown: 12, type: "aoe" },
            { name: "幸运光环", damage: 0, cooldown: 18, type: "buff" },
            { name: "黄金雨", damage: 880, cooldown: 24, type: "ultimate" }
        ],
        milestones: {
            damageBonus: [0, 9, 10, 11, 12, 13, 15],
            critBonus: [0, 8, 10, 11, 12, 13, 15],
            attackSpeed: [0, 8, 10, 11, 12, 13, 15]
        },
        calculatedDamage: {
            level1: 140,
            level30: 182,
            level60: 224,
            level90: 266
        }
    },
    
    "star-scribe": {
        name: "星辰抄录师",
        role: "进攻型",
        baseStats: { damage: 135, critRate: 7, critDamage: 170 },
        skills: [
            { name: "星尘术", damage: 135, cooldown: 6, type: "single" },
            { name: "星爆", damage: 370, cooldown: 12, type: "aoe" },
            { name: "星辰祝福", damage: 0, cooldown: 18, type: "buff" },
            { name: "星河坠落", damage: 860, cooldown: 24, type: "ultimate" }
        ],
        milestones: {
            damageBonus: [0, 9, 10, 11, 12, 13, 15],
            critBonus: [0, 8, 10, 11, 12, 13, 15],
            attackSpeed: [0, 8, 10, 11, 12, 13, 15]
        },
        calculatedDamage: {
            level1: 135,
            level30: 176,
            level60: 216,
            level90: 257
        }
    },
    
    "void-summoner": {
        name: "虚空召唤者",
        role: "进攻型",
        baseStats: { damage: 145, critRate: 6, critDamage: 165 },
        skills: [
            { name: "虚空箭", damage: 145, cooldown: 6, type: "single" },
            { name: "虚空之门", damage: 410, cooldown: 12, type: "aoe" },
            { name: "虚空护盾", damage: 0, cooldown: 18, type: "buff" },
            { name: "虚空大爆炸", damage: 920, cooldown: 24, type: "ultimate" }
        ],
        milestones: {
            damageBonus: [0, 9, 10, 11, 12, 13, 15],
            critBonus: [0, 8, 10, 11, 12, 13, 15],
            attackSpeed: [0, 8, 10, 11, 12, 13, 15]
        },
        calculatedDamage: {
            level1: 145,
            level30: 189,
            level60: 232,
            level90: 276
        }
    },
    
    "void-guardian": {
        name: "虚空守护者",
        role: "进攻型",
        baseStats: { damage: 170, critRate: 4, critDamage: 140 },
        skills: [
            { name: "虚空斩", damage: 170, cooldown: 6, type: "single" },
            { name: "虚空冲击", damage: 430, cooldown: 12, type: "aoe" },
            { name: "虚空守护", damage: 0, cooldown: 18, type: "buff" },
            { name: "虚空领域", damage: 960, cooldown: 24, type: "ultimate" }
        ],
        milestones: {
            damageBonus: [0, 9, 10, 11, 12, 13, 15],
            critBonus: [0, 8, 10, 11, 12, 13, 15],
            attackSpeed: [0, 8, 10, 11, 12, 13, 15]
        },
        calculatedDamage: {
            level1: 170,
            level30: 221,
            level60: 272,
            level90: 323
        }
    },
    
    "blood-flag-warlord": {
        name: "血旗战士",
        role: "进攻型",
        baseStats: { damage: 190, critRate: 5, critDamage: 155 },
        skills: [
            { name: "血旗斩", damage: 190, cooldown: 6, type: "single" },
            { name: "血旗冲锋", damage: 450, cooldown: 12, type: "aoe" },
            { name: "血旗光环", damage: 0, cooldown: 18, type: "buff" },
            { name: "血旗怒吼", damage: 1000, cooldown: 24, type: "ultimate" }
        ],
        milestones: {
            damageBonus: [0, 9, 10, 11, 12, 13, 15],
            critBonus: [0, 8, 10, 11, 12, 13, 15],
            attackSpeed: [0, 8, 10, 11, 12, 13, 15]
        },
        calculatedDamage: {
            level1: 190,
            level30: 247,
            level60: 304,
            level90: 361
        }
    },
    
    "rock-warden": {
        name: "岩石守卫者",
        role: "进攻型",
        baseStats: { damage: 160, critRate: 4, critDamage: 135 },
        skills: [
            { name: "岩石拳", damage: 160, cooldown: 6, type: "single" },
            { name: "岩石坠落", damage: 400, cooldown: 12, type: "aoe" },
            { name: "岩石护甲", damage: 0, cooldown: 18, type: "buff" },
            { name: "岩石崩塌", damage: 900, cooldown: 24, type: "ultimate" }
        ],
        milestones: {
            damageBonus: [0, 9, 10, 11, 12, 13, 15],
            critBonus: [0, 8, 10, 11, 12, 13, 15],
            attackSpeed: [0, 8, 10, 11, 12, 13, 15]
        },
        calculatedDamage: {
            level1: 160,
            level30: 208,
            level60: 256,
            level90: 304
        }
    },
    
    // 防御型角色
    "ether-conductor": {
        name: "以太导体",
        role: "防御型",
        baseStats: { damage: 150, critRate: 5, critDamage: 150 },
        skills: [
            { name: "以太箭", damage: 150, cooldown: 6, type: "single" },
            { name: "以太爆发", damage: 420, cooldown: 12, type: "aoe" },
            { name: "以太护盾", damage: 0, cooldown: 18, type: "buff" },
            { name: "以太风暴", damage: 930, cooldown: 24, type: "ultimate" }
        ],
        milestones: {
            damageBonus: [0, 8, 9, 10, 11, 12, 14],
            defenseBonus: [0, 10, 12, 14, 16, 18, 20],
            hpBonus: [0, 8, 10, 12, 14, 16, 18]
        },
        calculatedDamage: {
            level1: 150,
            level30: 180,
            level60: 210,
            level90: 240
        }
    },
    
    "medical-specialist": {
        name: "医疗专家",
        role: "防御型",
        baseStats: { damage: 50, critRate: 2, critDamage: 120 },
        skills: [
            { name: "治疗术", damage: 0, cooldown: 6, type: "heal" },
            { name: "群体治疗", damage: 0, cooldown: 12, type: "heal" },
            { name: "生命护盾", damage: 0, cooldown: 18, type: "buff" },
            { name: "生命绽放", damage: 0, cooldown: 24, type: "heal" }
        ],
        milestones: {
            damageBonus: [0, 5, 6, 7, 8, 9, 10],
            healBonus: [0, 15, 18, 21, 24, 27, 30],
            defenseBonus: [0, 10, 12, 14, 16, 18, 20]
        },
        calculatedDamage: {
            level1: 50,
            level30: 65,
            level60: 80,
            level90: 95
        }
    },
    
    "curse-weaver": {
        name: "诅咒编织者",
        role: "防御型",
        baseStats: { damage: 140, critRate: 6, critDamage: 160 },
        skills: [
            { name: "诅咒术", damage: 140, cooldown: 6, type: "single" },
            { name: "诅咒爆发", damage: 380, cooldown: 12, type: "aoe" },
            { name: "诅咒光环", damage: 0, cooldown: 18, type: "buff" },
            { name: "诅咒领域", damage: 870, cooldown: 24, type: "ultimate" }
        ],
        milestones: {
            damageBonus: [0, 8, 9, 10, 11, 12, 14],
            curseBonus: [0, 12, 15, 18, 21, 24, 27],
            defenseBonus: [0, 8, 10, 12, 14, 16, 18]
        },
        calculatedDamage: {
            level1: 140,
            level30: 168,
            level60: 196,
            level90: 224
        }
    },
    
    // 辅助型角色
    "ash-prophet": {
        name: "灰烬先知",
        role: "辅助型",
        baseStats: { damage: 135, critRate: 7, critDamage: 170 },
        skills: [
            { name: "预知祝福", damage: 0, cooldown: 6, type: "buff" },
            { name: "末日预言", damage: 160, cooldown: 8, type: "single" },
            { name: "神谕圣所", damage: 0, cooldown: 14, type: "buff" },
            { name: "清明之刻", damage: 0, cooldown: 24, type: "buff" }
        ],
        milestones: {
            damageBonus: [0, 8, 9, 10, 11, 12, 14],
            buffBonus: [0, 15, 18, 21, 24, 27, 30],
            supportBonus: [0, 12, 15, 18, 21, 24, 27]
        },
        calculatedDamage: {
            level1: 135,
            level30: 162,
            level60: 189,
            level90: 216
        }
    },
    
    "chronicle-bard": {
        name: "编年吟游诗人",
        role: "辅助型",
        baseStats: { damage: 160, critRate: 5, critDamage: 150 },
        skills: [
            { name: "勇气诗篇", damage: 0, cooldown: 6, type: "buff" },
            { name: "失谐音符", damage: 160, cooldown: 8, type: "single" },
            { name: "永恒叠句", damage: 0, cooldown: 14, type: "buff" },
            { name: "史诗终章", damage: 0, cooldown: 24, type: "buff" }
        ],
        milestones: {
            damageBonus: [0, 8, 9, 10, 11, 12, 14],
            buffBonus: [0, 15, 18, 21, 24, 27, 30],
            supportBonus: [0, 12, 15, 18, 21, 24, 27]
        },
        calculatedDamage: {
            level1: 160,
            level30: 192,
            level60: 224,
            level90: 256
        }
    },
    
    "void-warden": {
        name: "虚无守卫",
        role: "辅助型",
        baseStats: { damage: 165, critRate: 4, critDamage: 140 },
        skills: [
            { name: "虚无斩", damage: 165, cooldown: 6, type: "single" },
            { name: "虚无冲击", damage: 410, cooldown: 12, type: "aoe" },
            { name: "虚无守护", damage: 0, cooldown: 18, type: "buff" },
            { name: "虚无领域", damage: 0, cooldown: 24, type: "buff" }
        ],
        milestones: {
            damageBonus: [0, 8, 9, 10, 11, 12, 14],
            buffBonus: [0, 15, 18, 21, 24, 27, 30],
            supportBonus: [0, 12, 15, 18, 21, 24, 27]
        },
        calculatedDamage: {
            level1: 165,
            level30: 198,
            level60: 231,
            level90: 264
        }
    },
    
    "shadow-librarian": {
        name: "暗影图书管理员",
        role: "辅助型",
        baseStats: { damage: 140, critRate: 6, critDamage: 160 },
        skills: [
            { name: "暗影箭", damage: 140, cooldown: 6, type: "single" },
            { name: "暗影爆发", damage: 380, cooldown: 12, type: "aoe" },
            { name: "暗影护盾", damage: 0, cooldown: 18, type: "buff" },
            { name: "暗影领域", damage: 0, cooldown: 24, type: "buff" }
        ],
        milestones: {
            damageBonus: [0, 8, 9, 10, 11, 12, 14],
            buffBonus: [0, 15, 18, 21, 24, 27, 30],
            supportBonus: [0, 12, 15, 18, 21, 24, 27]
        },
        calculatedDamage: {
            level1: 140,
            level30: 168,
            level60: 196,
            level90: 224
        }
    },
    
    "gilded-benefactor": {
        name: "镀金施善者",
        role: "辅助型",
        baseStats: { damage: 130, critRate: 5, critDamage: 150 },
        skills: [
            { name: "黄金祝福", damage: 0, cooldown: 6, type: "buff" },
            { name: "黄金雨", damage: 350, cooldown: 12, type: "aoe" },
            { name: "黄金护盾", damage: 0, cooldown: 18, type: "buff" },
            { name: "黄金领域", damage: 0, cooldown: 24, type: "buff" }
        ],
        milestones: {
            damageBonus: [0, 8, 9, 10, 11, 12, 14],
            buffBonus: [0, 15, 18, 21, 24, 27, 30],
            supportBonus: [0, 12, 15, 18, 21, 24, 27]
        },
        calculatedDamage: {
            level1: 130,
            level30: 156,
            level60: 182,
            level90: 208
        }
    },
    
    "prism-herald": {
        name: "棱镜传令官",
        role: "辅助型",
        baseStats: { damage: 130, critRate: 7, critDamage: 165 },
        skills: [
            { name: "棱镜箭", damage: 130, cooldown: 6, type: "single" },
            { name: "棱镜爆发", damage: 360, cooldown: 12, type: "aoe" },
            { name: "棱镜祝福", damage: 0, cooldown: 18, type: "buff" },
            { name: "棱镜风暴", damage: 0, cooldown: 24, type: "buff" }
        ],
        milestones: {
            damageBonus: [0, 8, 9, 10, 11, 12, 14],
            buffBonus: [0, 15, 18, 21, 24, 27, 30],
            supportBonus: [0, 12, 15, 18, 21, 24, 27]
        },
        calculatedDamage: {
            level1: 130,
            level30: 156,
            level60: 182,
            level90: 208
        }
    },
    
    "thorn-apothecary": {
        name: "荆棘药剂师",
        role: "辅助型",
        baseStats: { damage: 125, critRate: 6, critDamage: 155 },
        skills: [
            { name: "荆棘术", damage: 125, cooldown: 6, type: "single" },
            { name: "荆棘爆发", damage: 350, cooldown: 12, type: "aoe" },
            { name: "荆棘护盾", damage: 0, cooldown: 18, type: "buff" },
            { name: "荆棘领域", damage: 0, cooldown: 24, type: "buff" }
        ],
        milestones: {
            damageBonus: [0, 8, 9, 10, 11, 12, 14],
            buffBonus: [0, 15, 18, 21, 24, 27, 30],
            supportBonus: [0, 12, 15, 18, 21, 24, 27]
        },
        calculatedDamage: {
            level1: 125,
            level30: 150,
            level60: 175,
            level90: 200
        }
    },
    
    "dusk-harmonizer": {
        name: "黄昏和声师",
        role: "辅助型",
        baseStats: { damage: 135, critRate: 5, critDamage: 150 },
        skills: [
            { name: "黄昏箭", damage: 135, cooldown: 6, type: "single" },
            { name: "黄昏爆发", damage: 370, cooldown: 12, type: "aoe" },
            { name: "黄昏祝福", damage: 0, cooldown: 18, type: "buff" },
            { name: "黄昏风暴", damage: 0, cooldown: 24, type: "buff" }
        ],
        milestones: {
            damageBonus: [0, 8, 9, 10, 11, 12, 14],
            buffBonus: [0, 15, 18, 21, 24, 27, 30],
            supportBonus: [0, 12, 15, 18, 21, 24, 27]
        },
        calculatedDamage: {
            level1: 135,
            level30: 162,
            level60: 189,
            level90: 216
        }
    },
    
    "tomb-broker": {
        name: "墓穴掮客",
        role: "辅助型",
        baseStats: { damage: 150, critRate: 5, critDamage: 150 },
        skills: [
            { name: "灵魂什一税", damage: 150, cooldown: 6, type: "single" },
            { name: "死亡契约", damage: 390, cooldown: 10, type: "aoe" },
            { name: "临终守望", damage: 0, cooldown: 14, type: "buff" },
            { name: "最终征收", damage: 0, cooldown: 24, type: "buff" }
        ],
        milestones: {
            damageBonus: [0, 8, 9, 10, 11, 12, 14],
            buffBonus: [0, 15, 18, 21, 24, 27, 30],
            supportBonus: [0, 12, 15, 18, 21, 24, 27]
        },
        calculatedDamage: {
            level1: 150,
            level30: 180,
            level60: 210,
            level90: 240
        }
    },
    
    "spore-alchemist": {
        name: "孢子炼金师",
        role: "辅助型",
        baseStats: { damage: 130, critRate: 6, critDamage: 160 },
        skills: [
            { name: "药用孢子", damage: 0, cooldown: 6, type: "heal" },
            { name: "麻痹毒云", damage: 360, cooldown: 10, type: "aoe" },
            { name: "治愈绽放", damage: 0, cooldown: 14, type: "heal" },
            { name: "瘟疫释放", damage: 0, cooldown: 24, type: "buff" }
        ],
        milestones: {
            damageBonus: [0, 8, 9, 10, 11, 12, 14],
            buffBonus: [