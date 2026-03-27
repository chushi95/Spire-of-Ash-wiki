// 里程碑数据 - 包含所有36个英雄的详细数据
const milestoneData = {
    "blood-flag-warlord": {
        name: "血旗战士",
        type: "进攻型",
        tags: ["持续伤害", "近战", "物理"],
        baseStats: {
            health: 358,
            mana: 156,
            armor: 0,
            evasion: 126,
            stunValue: 46,
            blockChance: 0,
            strength: 45,
            intelligence: 23
        },
        teamBonus: {
            name: "赤红旗帜",
            effects: ["+8% 攻击速度", "+10% 流血几率（全队）"]
        },
        skills: [
            {
                name: "绯红劈斩",
                damage: "110%",
                cooldown: 6.0,
                manaCost: 7,
                description: "以狂热打击使目标流血，同时赋予自身嗜血效果以偷取生命。",
                effects: ["流血（6点/秒，4.2秒）", "生命偷取约10%"]
            },
            {
                name: "旗帜横扫",
                damage: "130%",
                cooldown: 12.0,
                manaCost: 19,
                description: "大范围横扫使敌人流血，并激励附近友方进入持续增长的战意狂热。",
                effects: ["流血（12点/秒，4.2秒）", "+20% 攻击速度（团队）"]
            },
            {
                name: "战吼架势",
                damage: "0%",
                cooldown: 1.0,
                manaCost: 0,
                description: "战斗怒吼驱使自身进入血怒狂暴，并加速附近友方。",
                effects: ["+25% 物理伤害", "每秒流失 20 点生命"]
            },
            {
                name: "血浴集结",
                damage: "280%",
                cooldown: 22.0,
                manaCost: 28,
                description: "终极血浴创造鲜血领地，全队在其中偷取生命。",
                effects: ["+35% 物理伤害", "10% 生命偷取（团队）", "持续6秒"]
            }
        ],
        milestones: {
            1: {
                name: "战争标准",
                effects: [
                    "绯红劈斩 冷却时间减少 0.60秒",
                    "物理攻击伤害提高 10%",
                    "流血伤害提高 8%",
                    "战吼架势 持续时间增加 18%",
                    "战吼架势 射程增加 0.5m"
                ],
                dps: 25,
                survival: {
                    health: 358,
                    lifesteal: 1.08,
                    healing: 84
                }
            },
            15: {
                name: "疯狂节奏",
                effects: [
                    "旗帜横扫 范围增加 0.6m",
                    "攻击速度提高 9%",
                    "最大生命提高 9%",
                    "绯红劈斩 持续时间增加 20%",
                    "绯红劈斩 射程增加 0.6m"
                ],
                dps: 29,
                survival: {
                    health: 390,
                    lifesteal: 1.08,
                    healing: 84
                }
            },
            30: {
                name: "打开静脉",
                effects: [
                    "战吼架势 范围增加 0.8m",
                    "流血几率提高 12%",
                    "攻击速度提高 10%",
                    "旗帜横扫 持续时间增加 24%",
                    "旗帜横扫 范围增加 0.8m"
                ],
                dps: 34,
                survival: {
                    health: 390,
                    lifesteal: 1.22,
                    healing: 84
                }
            },
            45: {
                name: "旗帜风暴",
                effects: [
                    "血浴集结 冷却时间减少 1.20秒",
                    "伤害乘数提高 12%（随时间增加）",
                    "攻击速度提高 11%",
                    "血浴集结 治疗效果提高 24%",
                    "血浴集结 范围增加 1.1m",
                    "血浴集结 冷却时间减少 0.80秒"
                ],
                dps: 41,
                survival: {
                    health: 390,
                    lifesteal: 1.22,
                    healing: 104
                }
            },
            60: {
                name: "共同的屠杀",
                effects: [
                    "绯红劈斩 射程增加 0.8m",
                    "物理攻击伤害提高 12%",
                    "攻击暴击倍数提高 12%",
                    "流血伤害提高 12%",
                    "旗帜横扫 持续时间增加 26%",
                    "旗帜横扫 射程增加 0.6m"
                ],
                dps: 51,
                survival: {
                    health: 390,
                    lifesteal: 1.24,
                    healing: 104
                }
            },
            75: {
                name: "深红势头",
                effects: [
                    "旗帜横扫 射程增加 1m",
                    "攻击速度提高 12%",
                    "持续伤害倍增提高 12%",
                    "最大生命提高 13%",
                    "旗帜横扫 持续时间增加 30%",
                    "旗帜横扫 范围增加 1.1m"
                ],
                dps: 61,
                survival: {
                    health: 441,
                    lifesteal: 1.24,
                    healing: 104
                }
            },
            90: {
                name: "屠宰场旗帜",
                effects: [
                    "血浴集结 基础伤害提高 28%",
                    "血浴集结 持续时间延长 35%",
                    "物理攻击伤害提高 15%",
                    "流血几率提高 14%",
                    "攻击速度提高 15%",
                    "血浴集结 治疗效果提高 34%",
                    "血浴集结 范围增加 1.4m",
                    "血浴集结 冷却时间减少 1.40秒"
                ],
                dps: 76,
                survival: {
                    health: 441,
                    lifesteal: 1.38,
                    healing: 138
                }
            }
        }
    },
    "void-summoner": {
        name: "虚空召唤者",
        type: "进攻型",
        tags: ["混沌", "法术", "远程"],
        baseStats: {
            health: 320,
            mana: 200,
            armor: 0,
            evasion: 100,
            stunValue: 30,
            blockChance: 0,
            strength: 20,
            intelligence: 50
        },
        teamBonus: {
            name: "虚空共鸣",
            effects: ["+10% 混沌伤害", "+8% 对减益目标伤害"]
        },
        skills: [
            {
                name: "虚无弹",
                damage: 21,
                cooldown: 6.0,
                manaCost: 10,
                description: "发射虚无弹，造成混沌伤害并施加凋零叠加。",
                effects: ["混沌伤害", "凋零叠加"]
            },
            {
                name: "熵值波",
                damage: 74,
                cooldown: 10.0,
                manaCost: 25,
                description: "释放熵值波，造成混沌伤害。",
                effects: ["混沌伤害", "范围效果"]
            },
            {
                name: "深渊调谐",
                damage: 0,
                cooldown: 14.0,
                manaCost: 20,
                description: "增益技能，提升混沌伤害。",
                effects: ["+20% 混沌伤害", "持续8秒"]
            },
            {
                name: "湮灭之门",
                damage: 135,
                cooldown: 24.0,
                manaCost: 40,
                description: "终极技能，打开湮灭之门，造成大量混沌伤害。",
                effects: ["混沌伤害", "范围效果"]
            }
        ],
        milestones: {
            1: {
                name: "虚空裂隙",
                effects: [
                    "虚无弹 范围增加 0.5m",
                    "混沌法术伤害提高 10%",
                    "深渊调谐 持续时间增加 18%",
                    "深渊调谐 射程增加 0.5m"
                ],
                dps: 15,
                survival: {
                    health: 320,
                    lifesteal: 1.0,
                    healing: 0
                }
            },
            15: {
                name: "重力节奏",
                effects: [
                    "熵值波 冷却时间减少 0.80秒",
                    "施法速度提高 9%",
                    "范围伤害提高 9%",
                    "虚无弹 持续时间增加 20%",
                    "虚无弹 射程增加 0.6m"
                ],
                dps: 18,
                survival: {
                    health: 320,
                    lifesteal: 1.0,
                    healing: 0
                }
            },
            30: {
                name: "粉碎轨道",
                effects: [
                    "深渊调谐 冷却时间减少 1秒",
                    "范围伤害提高 11%",
                    "施法速度提高 10%",
                    "熵值波 持续时间增加 24%",
                    "熵值波 范围增加 0.6m"
                ],
                dps: 21,
                survival: {
                    health: 320,
                    lifesteal: 1.0,
                    healing: 0
                }
            },
            45: {
                name: "曝光螺旋",
                effects: [
                    "湮灭之门 范围增加 1m",
                    "混沌穿透力提高 10%",
                    "法术暴击伤害提高 11%",
                    "湮灭之门 持续时间增加 30%",
                    "湮灭之门 范围增加 1.1m",
                    "湮灭之门 冷却时间减少 0.80秒"
                ],
                dps: 24,
                survival: {
                    health: 320,
                    lifesteal: 1.0,
                    healing: 0
                }
            },
            60: {
                name: "事件压缩",
                effects: [
                    "虚无弹 射程增加 0.8m",
                    "混沌法术伤害提高 12%",
                    "范围伤害提高 12%",
                    "熵值波 持续时间增加 26%",
                    "熵值波 射程增加 0.8m"
                ],
                dps: 28,
                survival: {
                    health: 320,
                    lifesteal: 1.0,
                    healing: 0
                }
            },
            75: {
                name: "恐惧频率",
                effects: [
                    "熵值波 基础伤害提高 22%",
                    "施法速度提高 12%",
                    "持续伤害倍数提升 12%",
                    "范围伤害提高 13%",
                    "熵值波 持续时间增加 30%",
                    "熵值波 范围增加 1.1m"
                ],
                dps: 34,
                survival: {
                    health: 320,
                    lifesteal: 1.0,
                    healing: 0
                }
            },
            90: {
                name: "奇异崩溃",
                effects: [
                    "湮灭之门 范围增加 1.2m",
                    "湮灭之门 造成 18% 基础伤害",
                    "混沌法术伤害提高 15%",
                    "混沌穿透力提高 12%",
                    "施法速度提高 15%",
                    "湮灭之门 持续时间增加 42%",
                    "湮灭之门 范围增加 1.4m",
                    "湮灭之门 冷却时间减少 1.40秒"
                ],
                dps: 40,
                survival: {
                    health: 320,
                    lifesteal: 1.0,
                    healing: 0
                }
            }
        }
    }
};
