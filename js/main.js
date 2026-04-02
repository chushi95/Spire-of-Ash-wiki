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
            cards: []
        },
        currentTab: 'home',
        currentSubTab: {
            characters: '进攻型',
            items: '装备'
        },
        currentSubTab2: {
            characters: '进攻',
            items_装备: '武器',
            items_货币: '宝珠'
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
                document.querySelectorAll('.tab-content').forEach(function(section) {
                    section.classList.remove('active');
                    if (section.id === self.currentTab) {
                        section.classList.add('active');
                    }
                });
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
                    self.switchTab(tab);
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
            if (tabName === 'items') {
                var equipmentTabs = document.getElementById('equipment-tabs');
                var currencyTabs = document.getElementById('currency-tabs');
                if (equipmentTabs) {
                    if (subtabName === '装备') {
                        equipmentTabs.style.display = 'flex';
                        this.bindSubTab2Events();
                    } else {
                        equipmentTabs.style.display = 'none';
                    }
                }
                if (currencyTabs) {
                    if (subtabName === '货币') {
                        currencyTabs.style.display = 'flex';
                        this.bindSubTab2Events();
                    } else {
                        currencyTabs.style.display = 'none';
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
            document.querySelectorAll('.tab-content').forEach(function(section) {
                section.classList.remove('active');
                if (section.id === tabName) {
                    section.classList.add('active');
                }
            });
            if (tabName === 'characters' || tabName === 'items') {
                this.bindSubTabEvents();
            }
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
            if (tabName === 'items') {
                this.bindSubTab2Events();
                var equipmentTabs = document.getElementById('equipment-tabs');
                var currencyTabs = document.getElementById('currency-tabs');
                if (equipmentTabs) {
                    if (this.currentSubTab.items === '装备') {
                        equipmentTabs.style.display = 'flex';
                    } else {
                        equipmentTabs.style.display = 'none';
                    }
                }
                if (currencyTabs) {
                    if (this.currentSubTab.items === '货币') {
                        currencyTabs.style.display = 'flex';
                    } else {
                        currencyTabs.style.display = 'none';
                    }
                }
            }
            if (tabName !== 'home') {
                this.renderTab(tabName);
            }
            this.saveState();
        },
        loadAllData: function() {
            var dataTypes = ['characters', 'meta_slots', 'items', 'skills', 'affixes', 'cards'];
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
                })
                .catch(function(error) {
                    console.warn('Could not load ' + type + '.json:', error);
                    self.data[type] = [];
                });
        },
        renderTab: function(type) {
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

            var cardImageHtml = '';
            if (item.image) {
                cardImageHtml = '<div class="card-image" style="background-image: url(\'' + item.image + '\')"></div>';
            }

            return '<div class="card" data-index="' + dataIndex + '">' +
                cardImageHtml +
                '<div class="card-header">' +
                    '<div class="card-title">' +
                        '<h3>' + name + '</h3>' +
                    '</div>' +
                '</div>' +
                descHtml +
            '</div>';
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
            var icon = item.icon || '✨';
            var type = this.getDisplayText(item.type_cn, item.type_id, item.type);
            var category = this.getDisplayText(item.category_cn, item.category_id, item.category);
            var quality = item.quality || 'common';

            var headerMeta = [];
            var headerMetaHtml = '';

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

            return modalImageHtml + '<div class="modal-scrollable"><div class="modal-header"><div class="modal-title-section"><h2>' + name + '</h2><div class="modal-meta">' + headerMetaHtml + '</div></div></div>' + tagsHtml + content + '</div>';
        }
    };

    document.addEventListener('DOMContentLoaded', function() {
        WikiApp.init();
    });

    window.WikiApp = WikiApp;
})();
