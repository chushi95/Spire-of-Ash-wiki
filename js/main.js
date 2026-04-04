
(function() {
    'use strict';

    var WikiApp = {
        partyBuffTranslations: {
            h001: '灰烬守护',
            h002: '顺风之盾',
            h003: '神圣弹道',
            h004: '急救方案',
            h005: '共鸣合唱',
            h006: '冰川框架',
            h007: '亡者红利',
            h008: '钢铁礼赞',
            h009: '解毒之约',
            h010: '日炼之锋',
            h011: '裂隙张力',
            h012: '石之哨兵',
            h013: '电弧之网',
            h014: '赤红旗帜',
            h015: '星辰宝典',
            h016: '黎明誓约',
            h017: '雾生之聚',
            h018: '虚空裂口',
            h019: '雷霆教义',
            h020: '淘金本能',
            h021: '哨兵警戒',
            h022: '泰坦之心',
            h023: '镜像甲板',
            h024: '风暴壁垒号令',
            h025: '噬星者',
            h026: '共鸣之网',
            h027: '恶咒索引',
            h028: '铭文账册',
            h029: '灰烬预见',
            h030: '编年韵律',
            h031: '虚无之网',
            h032: '暗影之获',
            h033: '镀金什一税',
            h034: '棱镜圣歌',
            h035: '荆棘药剂',
            h036: '黄昏协奏'
        },
        data: {
            characters: [],
            meta_slots: [],
            items: [],
            skills: [],
            affixes: [],
            weapon_affixes: [],
            cards: []
        },
        currentTab: 'home',
        currentSubTab: {
            characters: '进攻型',
            items: '斧',
            'unique-items': '独特装备'
        },
        currentSubTab2: {
            characters: '进攻',
            items_装备: '攻击武器',
            items_货币: '宝珠'
        },
        damageTest: {
            team: []
        },
        init: function() {
            var backgrounds = [
                'images/background.webp',
                'images/background2.webp',
                'images/background3.webp'
            ];
            var randomIndex = Math.floor(Math.random() * backgrounds.length);
            var style = document.createElement('style');
            style.textContent = 'body::before { background-image: url(\'' + backgrounds[randomIndex] + '\'); }';
            document.head.appendChild(style);
            this.loadSavedState();
            this.bindNavEvents();
            this.bindSubTabEvents();
            this.bindSubTab2Events();
            this.bindModalEvents();
            this.restoreUIState();
            this.loadAllData();
            this.initDamageTest();
        },
        initDamageTest: function() {
            var self = this;
            var calculateBtn = document.getElementById('calculate-btn');
            if (calculateBtn) {
                calculateBtn.addEventListener('click', function() {
                    self.calculateDamage();
                });
            }
        },
        renderCharacterSelector: function() {
            var container = document.getElementById('available-characters');
            if (!container) return;
            
            var characters = this.data.characters || [];
            var self = this;
            
            container.innerHTML = characters.filter(function(char) {
                return char.type !== 'MetaSlot' && char.class !== 'MetaSlot' && char.category !== 'MetaSlot';
            }).map(function(char) {
                var name = self.getDisplayText(char.name_cn, char.name_id, char.name);
                var image = char.image || '';
                var isInTeam = self.damageTest.team.some(function(t) { return t.name_id === char.name_id; });
                
                return '<div class="character-item" data-name-id="' + char.name_id + '">' +
                    (image ? '<img src="' + image + '" alt="' + name + '">' : '') +
                    '<span class="character-item-name">' + name + '</span>' +
                    (isInTeam ? 
                        '<span style="color: #666; font-size: 0.85em;">已添加</span>' :
                        '<button class="character-item-add" onclick="WikiApp.addToTeam(\'' + char.name_id + '\')">添加</button>') +
                '</div>';
            }).join('');
        },
        addToTeam: function(nameId) {
            if (this.damageTest.team.length >= 5) {
                alert('队伍最多只能添加 5 个角色！');
                return;
            }
            
            var character = this.data.characters.find(function(c) { return c.name_id === nameId; });
            if (!character) return;
            
            if (this.damageTest.team.some(function(t) { return t.name_id === nameId; })) {
                alert('该角色已在队伍中！');
                return;
            }
            
            this.damageTest.team.push(character);
            this.renderTeamList();
            this.renderCharacterSelector();
        },
        removeFromTeam: function(nameId) {
            this.damageTest.team = this.damageTest.team.filter(function(t) { return t.name_id !== nameId; });
            this.renderTeamList();
            this.renderCharacterSelector();
        },
        renderTeamList: function() {
            var container = document.getElementById('team-list');
            if (!container) return;
            
            var self = this;
            
            if (this.damageTest.team.length === 0) {
                container.innerHTML = '<p style="color: #666; text-align: center; padding: 40px 0;">请从左侧选择角色添加到队伍</p>';
                return;
            }
            
            container.innerHTML = this.damageTest.team.map(function(char, index) {
                var name = self.getDisplayText(char.name_cn, char.name_id, char.name);
                var image = char.image || '';
                
                return '<div class="team-member">' +
                    (image ? '<img src="' + image + '" alt="' + name + '">' : '') +
                    '<div class="team-member-info">' +
                        '<div class="team-member-name">' + name + '</div>' +
                    '</div>' +
                    '<button class="team-member-remove" onclick="WikiApp.removeFromTeam(\'' + char.name_id + '\')">&times;</button>' +
                '</div>';
            }).join('');
        },
        calculateDamage: function() {
            var resultContainer = document.getElementById('damage-result');
            if (!resultContainer) return;
            
            if (this.damageTest.team.length === 0) {
                resultContainer.innerHTML = '<p style="color: #ff6666; text-align: center;">请先添加角色到队伍！</p>';
                return;
            }
            
            var targetEnemy = document.getElementById('target-enemy').value;
            var simulationTime = parseInt(document.getElementById('simulation-time').value) || 60;
            
            var totalDamage = 0;
            var minDamage = Infinity;
            var maxDamage = 0;
            var attackCount = simulationTime * 2;
            
            var damageBreakdown = {};
            var self = this;
            
            this.damageTest.team.forEach(function(char) {
                var charName = self.getDisplayText(char.name_cn, char.name_id, char.name);
                damageBreakdown[charName] = {
                    total: 0,
                    count: 0,
                    min: Infinity,
                    max: 0
                };
            });
            
            for (var i = 0; i < attackCount; i++) {
                var charIndex = i % this.damageTest.team.length;
                var char = this.damageTest.team[charIndex];
                var charName = this.getDisplayText(char.name_cn, char.name_id, char.name);
                
                var damage = Math.floor(Math.random() * 10000) + 1000;
                totalDamage += damage;
                
                if (damage < minDamage) minDamage = damage;
                if (damage > maxDamage) maxDamage = damage;
                
                damageBreakdown[charName].total += damage;
                damageBreakdown[charName].count++;
                if (damage < damageBreakdown[charName].min) damageBreakdown[charName].min = damage;
                if (damage > damageBreakdown[charName].max) damageBreakdown[charName].max = damage;
            }
            
            var avgDamage = Math.floor(totalDamage / attackCount);
            var dps = Math.floor(totalDamage / simulationTime);
            
            var timeLabel = simulationTime === 60 ? '1分钟' : (simulationTime === 180 ? '3分钟' : '5分钟');
            
            var breakdownHtml = '';
            for (var name in damageBreakdown) {
                var data = damageBreakdown[name];
                var charAvg = Math.floor(data.total / data.count);
                breakdownHtml += '' +
                    '<div class="damage-source-item">' +
                        '<div class="damage-source-name">' + name + '</div>' +
                        '<div class="damage-source-stats">' +
                            '<span>总伤害: ' + data.total.toLocaleString() + '</span>' +
                            '<span>平均: ' + charAvg.toLocaleString() + '</span>' +
                            '<span>最低: ' + data.min.toLocaleString() + '</span>' +
                            '<span>最高: ' + data.max.toLocaleString() + '</span>' +
                        '</div>' +
                    '</div>';
            }
            
            resultContainer.innerHTML = '' +
                '<div class="result-item">' +
                    '<span class="result-label">队伍角色:</span>' +
                    '<span class="result-value">' + this.damageTest.team.length + ' 个</span>' +
                '</div>' +
                '<div class="result-item">' +
                    '<span class="result-label">模拟时间:</span>' +
                    '<span class="result-value">' + timeLabel + '</span>' +
                '</div>' +
                '<div class="result-item">' +
                    '<span class="result-label">总伤害:</span>' +
                    '<span class="result-value">' + totalDamage.toLocaleString() + '</span>' +
                '</div>' +
                '<div class="result-item">' +
                    '<span class="result-label">平均伤害:</span>' +
                    '<span class="result-value">' + avgDamage.toLocaleString() + '</span>' +
                '</div>' +
                '<div class="result-item">' +
                    '<span class="result-label">最低伤害:</span>' +
                    '<span class="result-value">' + minDamage.toLocaleString() + '</span>' +
                '</div>' +
                '<div class="result-item">' +
                    '<span class="result-label">最高伤害:</span>' +
                    '<span class="result-value">' + maxDamage.toLocaleString() + '</span>' +
                '</div>' +
                '<div class="result-item">' +
                    '<span class="result-label">DPS:</span>' +
                    '<span class="result-value">' + dps.toLocaleString() + '</span>' +
                '</div>' +
                '<div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #3d3520;">' +
                    '<h4 style="color: #B8860B; margin-bottom: 12px; font-size: 1em;">伤害出处详情:</h4>' +
                    '<div class="damage-source-list">' + breakdownHtml + '</div>' +
                '</div>';
        },
        loadSavedState: function() {
            var savedTab = localStorage.getItem('wikiCurrentTab');
            var savedSubTab = localStorage.getItem('wikiCurrentSubTab');
            var savedSubTab2 = localStorage.getItem('wikiCurrentSubTab2');
            if (savedTab) {
                this.currentTab = savedTab;
            }
            if (savedSubTab) {
                try {
                    var parsed = JSON.parse(savedSubTab);
                    this.currentSubTab = Object.assign({}, this.currentSubTab, parsed);
                } catch (e) {
                    console.error('Error parsing savedSubTab:', e);
                }
            }
            if (savedSubTab2) {
                try {
                    var parsed = JSON.parse(savedSubTab2);
                    this.currentSubTab2 = Object.assign({}, this.currentSubTab2, parsed);
                } catch (e) {
                    console.error('Error parsing savedSubTab2:', e);
                }
            }
        },
        restoreUIState: function() {
            if (this.currentTab && this.currentTab !== 'home') {
                var self = this;
                document.querySelectorAll('nav ul li a').forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('data-tab') === self.currentTab) {
                        link.classList.add('active');
                    }
                });
                // 处理下拉菜单的active状态
                if (this.currentTab === 'items' || this.currentTab === 'unique-items') {
                    document.querySelector('.dropdown-trigger').classList.add('active');
                } else {
                    document.querySelector('.dropdown-trigger').classList.remove('active');
                }
                document.querySelectorAll('.tab-content').forEach(function(section) {
                    section.classList.remove('active');
                    if (section.id === self.currentTab) {
                        section.classList.add('active');
                    }
                });
                
                // 处理items页面的"全部"状态
                if (this.currentTab === 'items' && this.currentSubTab.items === '全部') {
                    var subTabBtns = document.querySelectorAll('#items .sub-tab-btn');
                    subTabBtns.forEach(function(btn) {
                        btn.classList.remove('active');
                    });
                }
            }
        },
        saveState: function() {
            localStorage.setItem('wikiCurrentTab', this.currentTab);
            localStorage.setItem('wikiCurrentSubTab', JSON.stringify(this.currentSubTab));
            localStorage.setItem('wikiCurrentSubTab2', JSON.stringify(this.currentSubTab2));
        },
        bindNavEvents: function() {
            var self = this;
            var navLinks = document.querySelectorAll('nav ul li a');
            navLinks.forEach(function(link) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    var tab = link.getAttribute('data-tab');
                    var subtab = link.getAttribute('data-subtab');
                    
                    if (tab) {
                        if (tab === 'items') {
                            // 如果是"物品"按钮，显示所有物品
                            self.switchTab(tab);
                            // 清除所有sub-tab的选中状态
                            var subTabBtns = document.querySelectorAll('#items .sub-tab-btn');
                            subTabBtns.forEach(function(btn) {
                                btn.classList.remove('active');
                            });
                            // 设置一个特殊的标记来表示显示所有物品
                            self.currentSubTab.items = '全部';
                            self.renderTab(tab);
                            self.saveState();
                        } else {
                            // 其他标签页正常切换
                            self.switchTab(tab);
                        }
                    }
                });
            });
        },
        bindSubTabEvents: function() {
            var self = this;
            var subTabBtns = document.querySelectorAll('.sub-tab-btn:not(.level2)');
            subTabBtns.forEach(function(btn) {
                if (!btn.hasAttribute('data-bound')) {
                    btn.setAttribute('data-bound', 'true');
                    btn.addEventListener('click', function() {
                        var subtab = this.getAttribute('data-subtab');
                        var parentSection = this.closest('.tab-content');
                        var tabName = parentSection ? parentSection.id : 'characters';
                        self.switchSubTab(tabName, subtab);
                    });
                }
            });
        },
        bindSubTab2Events: function() {
            var self = this;
            var subTab2Btns = document.querySelectorAll('.sub-tab-btn.level2');
            subTab2Btns.forEach(function(btn) {
                if (!btn.hasAttribute('data-bound')) {
                    btn.setAttribute('data-bound', 'true');
                    btn.addEventListener('click', function() {
                        var subtab2 = this.getAttribute('data-subtab2');
                        var parentSection = this.closest('.tab-content');
                        var tabName = parentSection ? parentSection.id : 'characters';
                        self.switchSubTab2(tabName, subtab2);
                    });
                }
            });
        },
        switchSubTab: function(tabName, subtabName) {
            this.currentSubTab[tabName] = subtabName;
            var subTabBtns = document.querySelectorAll('#' + tabName + ' .sub-tab-btn:not(.level2)');
            subTabBtns.forEach(function(btn) {
                btn.classList.remove('active');
                if (btn.getAttribute('data-subtab') === subtabName) {
                    btn.classList.add('active');
                }
            });
            if (tabName === 'characters') {
                var metaSlotsTabs = document.getElementById('meta-slots-tabs');
                if (metaSlotsTabs) {
                    if (subtabName === '元槽位') {
                        metaSlotsTabs.style.display = 'flex';
                        this.bindSubTab2Events();
                    } else {
                        metaSlotsTabs.style.display = 'none';
                    }
                }
            }

            this.renderTab(tabName);
            this.saveState();
        },
        switchSubTab2: function(tabName, subtabName) {
            if (tabName === 'items') {
                var currentSubtab = this.currentSubTab[tabName];
                var key = tabName + '_' + currentSubtab;
                this.currentSubTab2[key] = subtabName;
            } else {
                this.currentSubTab2[tabName] = subtabName;
            }
            var subTab2Btns = document.querySelectorAll('#' + tabName + ' .sub-tab-btn.level2');
            subTab2Btns.forEach(function(btn) {
                btn.classList.remove('active');
                if (btn.getAttribute('data-subtab2') === subtabName) {
                    btn.classList.add('active');
                }
            });
            this.renderTab(tabName);
            this.saveState();
        },

        switchTab: function(tabName) {
            this.currentTab = tabName;
            document.querySelectorAll('nav ul li a').forEach(function(link) {
                link.classList.remove('active');
                if (link.getAttribute('data-tab') === tabName) {
                    link.classList.add('active');
                }
            });
            // 处理下拉菜单的active状态
            if (tabName === 'items' || tabName === 'unique-items') {
                document.querySelector('.dropdown-trigger').classList.add('active');
            } else {
                document.querySelector('.dropdown-trigger').classList.remove('active');
            }
            document.querySelectorAll('.tab-content').forEach(function(section) {
                section.classList.remove('active');
                if (section.id === tabName) {
                    section.classList.add('active');
                }
            });
            if (tabName === 'characters') {
                this.bindSubTab2Events();
                var metaSlotsTabs = document.getElementById('meta-slots-tabs');
                if (metaSlotsTabs) {
                    if (this.currentSubTab.characters === '元槽位') {
                        metaSlotsTabs.style.display = 'flex';
                    } else {
                        metaSlotsTabs.style.display = 'none';
                    }
                }
            }
            
            // 处理items标签的"全部"状态
            if (tabName === 'items' && this.currentSubTab.items === '全部') {
                var subTabBtns = document.querySelectorAll('#items .sub-tab-btn');
                subTabBtns.forEach(function(btn) {
                    btn.classList.remove('active');
                });
            }

            if (tabName === 'damage-test') {
                this.renderCharacterSelector();
                this.renderTeamList();
            } else if (tabName !== 'home') {
                this.renderTab(tabName);
            }
            this.saveState();
        },
        loadAllData: function() {
            var dataTypes = ['characters', 'meta_slots', 'items', 'skills', 'affixes', 'weapon_affixes', 'cards'];
            var self = this;
            dataTypes.forEach(function(type) {
                self.loadData(type);
            });
        },
        loadData: function(type) {
            var self = this;
            fetch('data/' + type + '.json')
                .then(function(response) {
                    if (!response.ok) {
                        throw new Error('Failed to load ' + type + '.json');
                    }
                    return response.json();
                })
                .then(function(data) {
                    self.data[type] = data;
                    console.log('Loaded ' + data.length + ' ' + type);
                    if (self.currentTab === type) {
                        self.renderTab(type);
                    }
                    if (type === 'characters' && self.currentTab === 'damage-test') {
                        self.renderCharacterSelector();
                        self.renderTeamList();
                    }
                })
                .catch(function(error) {
                    console.warn('Could not load ' + type + '.json:', error);
                    self.data[type] = [];
                });
        },
        renderTab: function(type) {
            // 处理unique-items标签页 - 内容由用户自己添加
            if (type === 'unique-items') {
                var grid = document.getElementById('unique-items-grid');
                if (!grid) return;
                // 暂时显示暂无数据，等用户自己添加内容
                grid.innerHTML = '<div class="empty-message">暂无数据</div>';
                return;
            }
            
            var grid = document.getElementById(type + '-grid');
            if (!grid) return;
            var items = this.data[type] || [];
            if (type === 'characters') {
                var subtab = this.currentSubTab[type] || '进攻型';
                var bucketMapping = {
                    '进攻型': 'Offensive',
                    '防御型': 'Defensive',
                    '辅助型': 'Support',
                    '元槽位': 'MetaSlot'
                };
                var bucket = bucketMapping[subtab] || subtab;
                if (subtab === '元槽位') {
                    var subtab2 = this.currentSubTab2[type] || '进攻';
                    items = this.data.meta_slots || [];
                    items = items.filter(function(item) {
                        return item.type2 === subtab2 || item.class2 === subtab2 || item.category2 === subtab2;
                    });
                } else {
                    items = items.filter(function(item) {
                        return item.type === bucket || item.class === bucket || item.category === bucket;
                    });
                }
            }
            if (type === 'items') {
                var subtab = this.currentSubTab[type] || '斧';
                
                // 如果是"全部"，显示所有物品，不进行筛选
                if (subtab === '全部') {
                    // 不进行筛选，直接使用所有物品
                } else {
                // 单手武器分类
                if (subtab === '斧') {
                    items = items.filter(function(item) {
                        return item.weaponFamily === 'axe' && item.hands === '1H';
                    }).slice(0, 6);
                } else if (subtab === '剑') {
                    items = items.filter(function(item) {
                        return item.weaponFamily === 'sword' && item.hands === '1H';
                    });
                } else if (subtab === '锤') {
                    items = items.filter(function(item) {
                        return item.weaponFamily === 'mace' && item.hands === '1H';
                    });
                } else if (subtab === '长矛') {
                    items = items.filter(function(item) {
                        return item.weaponFamily === 'spear' && item.hands === '1H';
                    });
                } else if (subtab === '匕首') {
                    items = items.filter(function(item) {
                        return item.weaponFamily === 'dagger';
                    });
                } else if (subtab === '魔杖') {
                    items = items.filter(function(item) {
                        return item.weaponFamily === 'wand';
                    });
                } else if (subtab === '法球') {
                    items = items.filter(function(item) {
                        return item.weaponFamily === 'orb';
                    });
                } else if (subtab === '魔法书') {
                    items = items.filter(function(item) {
                        return item.weaponFamily === 'grimoire';
                    });
                }
                // 双手武器分类
                else if (subtab === '双手斧') {
                    items = items.filter(function(item) {
                        return item.weaponFamily === 'axe' && item.hands === '2H';
                    });
                } else if (subtab === '双手剑') {
                    items = items.filter(function(item) {
                        return item.weaponFamily === 'sword' && item.hands === '2H';
                    });
                } else if (subtab === '双手锤') {
                    items = items.filter(function(item) {
                        return item.weaponFamily === 'mace' && item.hands === '2H';
                    });
                } else if (subtab === '双手长矛') {
                    items = items.filter(function(item) {
                        return item.weaponFamily === 'spear' && item.hands === '2H';
                    });
                } else if (subtab === '弓') {
                    items = items.filter(function(item) {
                        return item.weaponFamily === 'bow';
                    });
                } else if (subtab === '弩') {
                    items = items.filter(function(item) {
                        return item.weaponFamily === 'crossbow';
                    });
                } else if (subtab === '枪械') {
                    items = items.filter(function(item) {
                        return item.weaponFamily === 'gun';
                    });
                } else if (subtab === '法杖') {
                    items = items.filter(function(item) {
                        return item.weaponFamily === 'staff';
                    });
                }
                // 副手分类
                else if (subtab === '箭袋') {
                    items = items.filter(function(item) {
                        return item.weaponFamily === 'quiver';
                    });
                } else if (subtab === '盾') {
                    items = items.filter(function(item) {
                        return item.weaponFamily === 'shield';
                    });
                } else if (subtab === '法器') {
                    items = items.filter(function(item) {
                        return item.weaponFamily === 'focus';
                    });
                } else if (subtab === '权杖') {
                    items = items.filter(function(item) {
                        return item.weaponFamily === 'scepter';
                    });
                } else if (subtab === '圣物') {
                    items = items.filter(function(item) {
                        return item.weaponFamily === 'relic';
                    });
                }
                // 其他分类
                else if (subtab === '头盔') {
                    items = items.filter(function(item) {
                        return item.slot === 'helm';
                    });
                } else if (subtab === '胸甲') {
                    items = items.filter(function(item) {
                        return item.slot === 'body';
                    });
                } else if (subtab === '手套') {
                    items = items.filter(function(item) {
                        return item.slot === 'gloves';
                    });
                } else if (subtab === '鞋子') {
                    items = items.filter(function(item) {
                        return item.slot === 'boots';
                    });
                } else if (subtab === '项链') {
                    items = items.filter(function(item) {
                        return item.slot === 'amulet';
                    });
                } else if (subtab === '戒指') {
                    items = items.filter(function(item) {
                        return item.slot === 'ring';
                    });
                } else if (subtab === '腰带') {
                    items = items.filter(function(item) {
                        return item.slot === 'belt';
                    });
                } else if (subtab === '生命药剂') {
                    items = items.filter(function(item) {
                        var name = item.name_cn || item.name || '';
                        var desc = item.description_cn || item.description || '';
                        return (item.type === '药剂' || item.class === '药剂' || item.category === '药剂' ||
                               item.slot === 'flask' || (item.tags && item.tags.includes('flask'))) &&
                               (name.includes('生命') || name.includes('health') || 
                                desc.includes('生命') || desc.includes('health'));
                    });
                } else if (subtab === '法力药剂') {
                    items = items.filter(function(item) {
                        var name = item.name_cn || item.name || '';
                        var desc = item.description_cn || item.description || '';
                        return (item.type === '药剂' || item.class === '药剂' || item.category === '药剂' ||
                               item.slot === 'flask' || (item.tags && item.tags.includes('flask'))) &&
                               (name.includes('法力') || name.includes('mana') || 
                                desc.includes('法力') || desc.includes('mana'));
                    });
                } else if (subtab === '实用药剂') {
                    items = items.filter(function(item) {
                        var name = item.name_cn || item.name || '';
                        var desc = item.description_cn || item.description || '';
                        var isFlask = item.type === '药剂' || item.class === '药剂' || item.category === '药剂' ||
                                     item.slot === 'flask' || (item.tags && item.tags.includes('flask'));
                        var isHealthOrMana = (name.includes('生命') || name.includes('health') || 
                                            desc.includes('生命') || desc.includes('health') ||
                                            name.includes('法力') || name.includes('mana') || 
                                            desc.includes('法力') || desc.includes('mana'));
                        return isFlask && !isHealthOrMana;
                    });
                } else if (subtab === '宝珠' || subtab === '铭文' || subtab === '符印' || 
                           subtab === '印记' || subtab === '法令') {
                    items = items.filter(function(item) {
                        return item.type === subtab || item.class === subtab || item.category === subtab;
                    });
                }
                }
            }
            
            if (items.length === 0) {
                grid.innerHTML = '<div class="empty-message">暂无数据</div>';
                return;
            }
            var self = this;
            grid.innerHTML = items.map(function(item, index) {
                return self.createCard(item, type, index);
            }).join('');
        },
        getDisplayText: function(chinese, id, english) {
            if (chinese && chinese.trim() !== '') {
                return chinese;
            }
            if (english && english.trim() !== '') {
                return english;
            }
            if (id && id.trim() !== '') {
                return id;
            }
            return '暂无数据';
        },
        createCard: function(item, type, dataIndex) {
            if (dataIndex === undefined) dataIndex = 0;
            var name = this.getDisplayText(item.name_cn, item.name_id, item.name);
            var descHtml = '';
            var desc = this.getDisplayText(item.description_cn, item.description_id, item.description);
            var effect = this.getDisplayText(item.effect_cn, item.effect_id, item.effect);
            var extraInfo = '';
            var quality = item.quality || 'common';
            
            if (item.partyBuff) {
                var pbName = this.getDisplayText(item.partyBuff.name_cn, item.partyBuff.name_id, item.partyBuff.name);
                if (item.name_id && this.partyBuffTranslations[item.name_id]) {
                    pbName = this.partyBuffTranslations[item.name_id];
                }
                var pbEffect = this.getDisplayText(item.partyBuff.effect_cn, item.partyBuff.effect_id, item.partyBuff.effect);
                extraInfo += '<div class="party-buff"><strong>队伍Buff:</strong> ' + pbName + ' - ' + pbEffect + '</div>';
            }
            
            if (item.effects && item.effects.length > 0) {
                extraInfo += '<div class="effects-list"><strong>效果:</strong><ul>';
                item.effects.forEach(function(e) {
                    extraInfo += '<li>' + e + '</li>';
                });
                extraInfo += '</ul></div>';
            }
            if (item.costs && item.costs.length > 0) {
                extraInfo += '<div class="costs-list"><strong>代价:</strong><ul>';
                item.costs.forEach(function(c) {
                    extraInfo += '<li>' + c + '</li>';
                });
                extraInfo += '</ul></div>';
            }
            
            if (desc !== '暂无数据' || effect !== '暂无数据' || extraInfo) {
                var displayDesc = desc !== '暂无数据' ? desc : effect;
                descHtml = '<div class="card-description">';
                if (displayDesc !== '暂无数据') {
                    descHtml += '<p>' + displayDesc + '</p>';
                }
                if (extraInfo) {
                    descHtml += extraInfo;
                }
                descHtml += '</div>';
            }

            var itemIconHtml = '';
            if (item.image) {
                itemIconHtml = '<div class="item-icon" style="background-image: url(\'' + item.image + '\')"></div>';
            } else {
                itemIconHtml = '<div class="item-icon item-icon-placeholder"></div>';
            }

            var qualityBadge = '';
            var qualityNames = {
                'common': '普通',
                'magic': '魔法',
                'rare': '稀有',
                'epic': '史诗',
                'legendary': '传奇',
                'mythic': '神话'
            };
            if (quality && qualityNames[quality]) {
                // 只有角色卡片的史诗标签才去掉，其他都显示
                if (type === 'items' || quality !== 'epic') {
                    qualityBadge = '<span class="quality-badge quality-' + quality + '">' + qualityNames[quality] + '</span>';
                }
            }

            var baseStatsHtml = '';
            if (item.baseStats && item.baseStats.weapon) {
                var stats = item.baseStats.weapon;
                baseStatsHtml = '<div class="item-base-stats">';
                baseStatsHtml += '<div class="stat-line"><strong>攻击速度:</strong> ' + stats.baseAttackTime + 's</div>';
                baseStatsHtml += '<div class="stat-line"><strong>暴击几率:</strong> ' + (stats.critChance * 100).toFixed(1) + '%</div>';
                if (stats.damageVariance) {
                    baseStatsHtml += '<div class="stat-line"><strong>伤害波动:</strong> ' + (stats.damageVariance.minMult * 100) + '% - ' + (stats.damageVariance.maxMult * 100) + '%</div>';
                }
                baseStatsHtml += '</div>';
            }

            var implicitHtml = '';
            if (item.implicit_cn || item.implicit) {
                var implicitText = item.implicit_cn || item.implicit;
                implicitHtml = '<div class="item-implicit"><strong>固有词缀:</strong> ' + implicitText + '</div>';
            }

            var cardContent = '';
            if (type === 'items') {
                cardContent = implicitHtml;
            } else {
                cardContent = descHtml;
            }

            if (type === 'items') {
                // 装备卡片 - 保持新布局
                var levelBadge = '';
                if (item.req && item.req.level) {
                    levelBadge = '<span class="level-badge">Lv.' + item.req.level + '</span>';
                }
                return '<div class="card equipment-card quality-' + quality + '" data-index="' + dataIndex + '">' +
                    '<div class="card-header">' +
                        '<div class="card-title-wrapper">' +
                            '<h3>' + name + '</h3>' +
                            qualityBadge +
                            levelBadge +
                            itemIconHtml +
                        '</div>' +
                    '</div>' +
                    cardContent +
                '</div>';
            } else {
                // 角色卡片 - 图片作为整个卡片背景，透明度50%
                var cardStyle = '';
                if (item.image) {
                    cardStyle = ' style="background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(\'' + item.image + '\'); background-size: cover; background-position: center;"';
                }
                return '<div class="card quality-' + quality + '" data-index="' + dataIndex + '"' + cardStyle + '>' +
                    '<div class="card-header">' +
                        '<div class="card-title-wrapper">' +
                            '<div class="card-title">' +
                                '<h3>' + name + '</h3>' +
                                qualityBadge +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    cardContent +
                '</div>';
            }
        },
        bindModalEvents: function() {
            var self = this;
            var modal = document.getElementById('modal');
            var closeBtn = document.querySelector('.modal-close');
            var backdrop = document.querySelector('.modal-backdrop');
            document.addEventListener('click', function(e) {
                var card = e.target.closest('.card');
                if (card) {
                    var dataIndex = card.getAttribute('data-index');
                    var gridId = card.closest('.card-grid').id;
                    var type = 'characters';
                    if (gridId === 'items-grid') type = 'items';
                    else if (gridId === 'skills-grid') type = 'skills';
                    else if (gridId === 'affixes-grid') type = 'affixes';
                    else if (gridId === 'cards-grid') type = 'cards';
                    
                    var items = self.data[type] || [];
                    if (type === 'characters') {
                        var subtab = self.currentSubTab[type] || '进攻型';
                        if (subtab === '元槽位') {
                            return;
                        } else {
                            var bucketMapping = {
                                '进攻型': 'Offensive',
                                '防御型': 'Defensive',
                                '辅助型': 'Support'
                            };
                            var bucket = bucketMapping[subtab] || subtab;
                            items = items.filter(function(item) {
                                return item.type === bucket || item.class === bucket || item.category === bucket;
                            });
                        }
                    } else if (type === 'items') {
                        var subtab = self.currentSubTab[type] || '斧';
                        
                        // 如果是"全部"，显示所有物品，不进行筛选
                        if (subtab === '全部') {
                            // 不进行筛选，直接使用所有物品
                        } else {
                            // 单手武器分类
                            if (subtab === '斧') {
                                items = items.filter(function(item) {
                                    return item.weaponFamily === 'axe' && item.hands === '1H';
                                }).slice(0, 6);
                            } else if (subtab === '剑') {
                                items = items.filter(function(item) {
                                    return item.weaponFamily === 'sword' && item.hands === '1H';
                                });
                            } else if (subtab === '锤') {
                                items = items.filter(function(item) {
                                    return item.weaponFamily === 'mace' && item.hands === '1H';
                                });
                            } else if (subtab === '长矛') {
                                items = items.filter(function(item) {
                                    return item.weaponFamily === 'spear' && item.hands === '1H';
                                });
                            } else if (subtab === '匕首') {
                                items = items.filter(function(item) {
                                    return item.weaponFamily === 'dagger';
                                });
                            } else if (subtab === '魔杖') {
                                items = items.filter(function(item) {
                                    return item.weaponFamily === 'wand';
                                });
                            } else if (subtab === '法球') {
                                items = items.filter(function(item) {
                                    return item.weaponFamily === 'orb';
                                });
                            } else if (subtab === '魔法书') {
                                items = items.filter(function(item) {
                                    return item.weaponFamily === 'grimoire';
                                });
                            }
                            // 双手武器分类
                            else if (subtab === '双手斧') {
                                items = items.filter(function(item) {
                                    return item.weaponFamily === 'axe' && item.hands === '2H';
                                });
                            } else if (subtab === '双手剑') {
                                items = items.filter(function(item) {
                                    return item.weaponFamily === 'sword' && item.hands === '2H';
                                });
                            } else if (subtab === '双手锤') {
                                items = items.filter(function(item) {
                                    return item.weaponFamily === 'mace' && item.hands === '2H';
                                });
                            } else if (subtab === '双手长矛') {
                                items = items.filter(function(item) {
                                    return item.weaponFamily === 'spear' && item.hands === '2H';
                                });
                            } else if (subtab === '弓') {
                                items = items.filter(function(item) {
                                    return item.weaponFamily === 'bow';
                                });
                            } else if (subtab === '弩') {
                                items = items.filter(function(item) {
                                    return item.weaponFamily === 'crossbow';
                                });
                            } else if (subtab === '枪械') {
                                items = items.filter(function(item) {
                                    return item.weaponFamily === 'gun';
                                });
                            } else if (subtab === '法杖') {
                                items = items.filter(function(item) {
                                    return item.weaponFamily === 'staff';
                                });
                            }
                            // 副手分类
                            else if (subtab === '箭袋') {
                                items = items.filter(function(item) {
                                    return item.weaponFamily === 'quiver';
                                });
                            } else if (subtab === '盾') {
                                items = items.filter(function(item) {
                                    return item.weaponFamily === 'shield';
                                });
                            } else if (subtab === '法器') {
                                items = items.filter(function(item) {
                                    return item.weaponFamily === 'focus';
                                });
                            } else if (subtab === '权杖') {
                                items = items.filter(function(item) {
                                    return item.weaponFamily === 'scepter';
                                });
                            } else if (subtab === '圣物') {
                                items = items.filter(function(item) {
                                    return item.weaponFamily === 'relic';
                                });
                            }
                            // 护甲分类
                            else if (subtab === '头盔') {
                                items = items.filter(function(item) {
                                    return item.slot === 'helm';
                                });
                            } else if (subtab === '胸甲') {
                                items = items.filter(function(item) {
                                    return item.slot === 'body';
                                });
                            } else if (subtab === '手套') {
                                items = items.filter(function(item) {
                                    return item.slot === 'gloves';
                                });
                            } else if (subtab === '鞋子') {
                                items = items.filter(function(item) {
                                    return item.slot === 'boots';
                                });
                            } else if (subtab === '项链') {
                                items = items.filter(function(item) {
                                    return item.slot === 'amulet';
                                });
                            } else if (subtab === '戒指') {
                                items = items.filter(function(item) {
                                    return item.slot === 'ring';
                                });
                            } else if (subtab === '腰带') {
                                items = items.filter(function(item) {
                                    return item.slot === 'belt';
                                });
                            }
                        }
                    }
                    
                    var item = items[parseInt(dataIndex)];
                    if (item) {
                        self.openModal(item);
                    }
                }
            });
            closeBtn.addEventListener('click', function() {
                self.closeModal();
            });
            backdrop.addEventListener('click', function() {
                self.closeModal();
            });
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    self.closeModal();
                }
            });
        },
        openModal: function(item) {
            var modal = document.getElementById('modal');
            var modalBody = document.getElementById('modal-body');
            modalBody.innerHTML = this.createModalContent(item);
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        },
        closeModal: function() {
            var modal = document.getElementById('modal');
            modal.classList.remove('active');
            document.body.style.overflow = '';
        },
        createModalContent: function(item) {
            var name = this.getDisplayText(item.name_cn, item.name_id, item.name);
            var englishName = item.name || '';
            var icon = item.icon || '✨';
            var type = this.getDisplayText(item.type_cn, item.type_id, item.type);
            var category = this.getDisplayText(item.category_cn, item.category_id, item.category);
            var quality = item.quality || 'common';

            var headerMeta = [];
            var headerMetaHtml = '';
            
            // 添加武器类型和握持方式到头部信息
            if (item.weaponFamily) {
                var weaponFamilyNames = {
                    'axe': '斧头',
                    'sword': '剑',
                    'mace': '锤',
                    'spear': '长矛'
                };
                headerMeta.push(weaponFamilyNames[item.weaponFamily] || item.weaponFamily);
            }
            if (item.hands) {
                var handsNames = {
                    '1H': '单手',
                    '2H': '双手'
                };
                headerMeta.push(handsNames[item.hands] || item.hands);
            }
            
            if (headerMeta.length > 0) {
                headerMetaHtml = headerMeta.join(' · ');
            }

            var tagsHtml = '';
            if (item.tags && item.tags.length > 0) {
                var displayTags = item.tags.map(function(tag, i) {
                    var tag_cn = item.tags_cn ? item.tags_cn[i] : null;
                    var tag_id = item.tags_id ? item.tags_id[i] : null;
                    return this.getDisplayText(tag_cn, tag_id, tag);
                }, this);
                tagsHtml = '<div class="modal-tags">' + displayTags.map(function(tag) { return '<span class="modal-tag">' + tag + '</span>'; }).join('') + '</div>';
            }

            var modalImageHtml = '';
            if (item.image) {
                modalImageHtml = '<div class="modal-image" style="background-image: url(\'' + item.image + '\')"></div>';
            }

            var content = '';

            // 添加装备基础数据信息
            var statsHtml = '';
            if (item.baseStats && item.baseStats.weapon) {
                var weaponStats = item.baseStats.weapon;
                statsHtml += '<div class="modal-section"><h3>装备属性</h3><div class="item-stats">';
                if (weaponStats.baseAttackTime) {
                    var attacksPerSecond = (1 / weaponStats.baseAttackTime).toFixed(2);
                    statsHtml += '<div class="stat-item"><span class="stat-label">攻击速度:</span> <span class="stat-value">' + attacksPerSecond + ' 次/秒</span></div>';
                }
                if (weaponStats.critChance) {
                    statsHtml += '<div class="stat-item"><span class="stat-label">暴击几率:</span> <span class="stat-value">' + (weaponStats.critChance * 100).toFixed(1) + '%</span></div>';
                }
                statsHtml += '</div></div>';
            }
            
            // 添加固有词缀
            if (item.implicit || item.implicit_cn) {
                var implicitText = this.getDisplayText(item.implicit_cn, null, item.implicit);
                content += '<div class="modal-section"><h3>固有词缀</h3><div class="implicit-affix">' + implicitText + '</div></div>';
            }
            
            content += statsHtml;
            
            // 添加装备需求信息
            var reqHtml = '';
            if (item.req) {
                reqHtml += '<div class="modal-section"><h3>装备需求</h3><div class="item-req">';
                if (item.req.level) {
                    reqHtml += '<div class="stat-item"><span class="stat-label">等级:</span> <span class="stat-value">' + item.req.level + '</span></div>';
                }
                if (item.req.stats) {
                    var statNames = {
                        'strength': '力量',
                        'dexterity': '敏捷',
                        'intelligence': '智慧'
                    };
                    for (var stat in item.req.stats) {
                        var statName = statNames[stat] || stat;
                        reqHtml += '<div class="stat-item"><span class="stat-label">' + statName + ':</span> <span class="stat-value">' + item.req.stats[stat] + '</span></div>';
                    }
                }
                reqHtml += '</div></div>';
            }
            content += reqHtml;

            var desc = this.getDisplayText(item.description_cn, item.description_id, item.description);
            if (desc !== '暂无数据') {
                content += '<div class="modal-section"><h3>描述</h3><div class="modal-description">' + desc + '</div></div>';
            }



            if (item.partyBuff) {
                var pbName = this.getDisplayText(item.partyBuff.name_cn, item.partyBuff.name_id, item.partyBuff.name);
                if (item.name_id && this.partyBuffTranslations[item.name_id]) {
                    pbName = this.partyBuffTranslations[item.name_id];
                }
                var pbEffect = this.getDisplayText(item.partyBuff.effect_cn, item.partyBuff.effect_id, item.partyBuff.effect);
                content += '<div class="modal-section"><h3>队伍Buff</h3><div class="modal-description"><strong>' + pbName + ':</strong> ' + pbEffect + '</div></div>';
            }

            if (item.skills && item.skills.length > 0) {
                var skillsHtml = item.skills.map(function(skill) {
                    var skillName = this.getDisplayText(skill.name_cn, skill.name_id, skill.name);
                    var skillDesc = this.getDisplayText(skill.description_cn, skill.description_id, skill.description);
                    return '<div class="skill-item"><div class="skill-name">' + skillName + '</div>' + (skillDesc !== '暂无数据' ? '<div class="skill-desc">' + skillDesc + '</div>' : '') + '</div>';
                }, this).join('');
                content += '<div class="modal-section"><h3>技能</h3><div class="skills-container">' + skillsHtml + '</div></div>';
            }

            if (item.milestones && item.milestones.length > 0) {
                var milestonesHtml = item.milestones.map(function(milestone) {
                    var milestoneName = this.getDisplayText(milestone.name_cn, milestone.name_id, milestone.name);
                    var milestoneDesc = this.getDisplayText(milestone.description_cn, milestone.description_id, milestone.description);
                    var levelText = milestone.level ? '<span class="milestone-level">Lv.' + milestone.level + '</span>' : '';
                    return '<div class="milestone-item">' + levelText + '<div class="milestone-name">' + milestoneName + '</div>' + (milestoneDesc !== '暂无数据' ? '<div class="milestone-desc">' + milestoneDesc + '</div>' : '') + '</div>';
                }, this).join('');
                content += '<div class="modal-section"><h3>角色里程碑</h3><div class="milestones-container">' + milestonesHtml + '</div></div>';
            }



            var nameHtml = '<h2>' + name + '</h2>';
            if (englishName && englishName !== name) {
                nameHtml += '<div class="english-name">' + englishName + '</div>';
            }
            return modalImageHtml + '<div class="modal-scrollable"><div class="modal-header"><div class="modal-title-section">' + nameHtml + '<div class="modal-meta">' + headerMetaHtml + '</div></div></div>' + content + '</div>';
        }
    };

    document.addEventListener('DOMContentLoaded', function() {
        WikiApp.init();
    });

    window.WikiApp = WikiApp;
})();
