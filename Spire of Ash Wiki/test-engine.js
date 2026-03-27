// 测试引擎 - 实现伤害计算、生存数据计算和团队效果计算

let testRunning = false;
let testStartTime = 0;
let totalDamage = 0;
let currentDummyHealth = 0;
let currentDummyType = "single";

// 更新里程碑效果显示
function updateMilestoneEffects() {
    const level = parseInt(document.getElementById('level').value);
    const characterSelects = document.querySelectorAll('.character-select');
    const effectsContainer = document.getElementById('milestoneEffects');
    
    let html = '';
    let hasCharacters = false;
    
    characterSelects.forEach(select => {
        const characterId = select.value;
        if (characterId && milestoneData[characterId]) {
            hasCharacters = true;
            const character = milestoneData[characterId];
            const milestone = character.milestones[level];
            
            if (milestone) {
                html += `<div style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #3d3220;">`;
                html += `<h4 style="color: #d4af37; margin-bottom: 8px;">${character.name} - ${milestone.name}</h4>`;
                milestone.effects.forEach(effect => {
                    html += `<div class="milestone-effect">${effect}</div>`;
                });
                html += `</div>`;
            }
        }
    });
    
    if (!hasCharacters) {
        html = '<p style="color: #8b7355; text-align: center;">选择角色后显示里程碑效果</p>';
    }
    
    effectsContainer.innerHTML = html;
    
    // 更新数据面板
    updateDataPanels();
    
    // 更新DPS图表
    drawDPSChart();
}

// 更新数据面板
function updateDataPanels() {
    const level = parseInt(document.getElementById('level').value);
    const characterSelects = document.querySelectorAll('.character-select');
    
    let totalBaseDamage = 0;
    let totalMilestoneBonus = 0;
    let totalFinalDamage = 0;
    let totalDPS = 0;
    
    let totalHealth = 0;
    let totalLifesteal = 0;
    let totalHealing = 0;
    let totalSurvival = 0;
    
    let teamBonusText = [];
    let totalTeamHealing = 0;
    let supportEffects = [];
    let totalTeamValue = 0;
    
    characterSelects.forEach(select => {
        const characterId = select.value;
        if (characterId && milestoneData[characterId]) {
            const character = milestoneData[characterId];
            const milestone = character.milestones[level];
            
            if (milestone) {
                // 伤害数据
                totalBaseDamage += milestone.dps;
                totalMilestoneBonus += (milestone.dps - 15); // 相对于1级的提升
                totalDPS += milestone.dps;
                
                // 生存数据
                totalHealth += milestone.survival.health;
                totalLifesteal += (milestone.survival.lifesteal - 1) * 100;
                totalHealing += milestone.survival.healing;
                
                // 团队效果
                if (character.teamBonus) {
                    teamBonusText.push(`${character.name}: ${character.teamBonus.effects.join(', ')}`);
                }
                totalTeamHealing += milestone.survival.healing;
                
                // 团队价值计算
                totalTeamValue += milestone.dps * 1.5; // 简化的团队价值计算
            }
        }
    });
    
    totalFinalDamage = totalBaseDamage + totalMilestoneBonus;
    totalSurvival = totalHealth * (1 + totalLifesteal / 100 / 5); // 简化的生存能力计算
    
    // 更新伤害面板
    document.getElementById('baseDamage').textContent = Math.round(totalBaseDamage);
    document.getElementById('milestoneBonus').textContent = `+${Math.round(totalMilestoneBonus)}%`;
    document.getElementById('finalDamage').textContent = Math.round(totalFinalDamage);
    document.getElementById('dpsValue').textContent = Math.round(totalDPS);
    
    // 更新生存面板
    document.getElementById('healthValue').textContent = Math.round(totalHealth);
    document.getElementById('lifestealValue').textContent = `${Math.round(totalLifesteal / 5)}%`;
    document.getElementById('healingValue').textContent = `${Math.round(totalHealing)}%`;
    document.getElementById('survivalValue').textContent = Math.round(totalSurvival);
    
    // 更新团队面板
    document.getElementById('teamBonus').textContent = teamBonusText.length > 0 ? teamBonusText.join('; ') : '无';
    document.getElementById('teamHealing').textContent = `${Math.round(totalTeamHealing)}%`;
    document.getElementById('supportEffect').textContent = supportEffects.length > 0 ? supportEffects.join(', ') : '无';
    document.getElementById('teamValue').textContent = Math.round(totalTeamValue);
}

// 开始测试
function startTest() {
    if (testRunning) return;
    
    const level = parseInt(document.getElementById('level').value);
    const dummyType = document.getElementById('dummy-type').value;
    const characterSelects = document.querySelectorAll('.character-select');
    
    const selectedCharacters = [];
    characterSelects.forEach(select => {
        const characterId = select.value;
        if (characterId && milestoneData[characterId]) {
            selectedCharacters.push({
                id: characterId,
                data: milestoneData[characterId]
            });
        }
    });
    
    if (selectedCharacters.length === 0) {
        alert('请至少选择一个角色');
        return;
    }
    
    // 根据木桩类型设置目标数
    const targetCount = dummyType === 'multi' ? 5 : 1;
    currentDummyType = dummyType;
    currentDummyHealth = 100000 * targetCount;
    
    // 重置UI
    document.getElementById('dummyHealth').style.height = '100%';
    document.getElementById('dummyHealthFill').style.width = '100%';
    document.getElementById('dummyStatus').textContent = `木桩状态: 测试中... (${targetCount}目标)`;
    document.getElementById('totalDamage').textContent = '0';
    document.getElementById('dps').textContent = '0';
    document.getElementById('testTime').textContent = '0s';
    
    testRunning = true;
    testStartTime = Date.now();
    totalDamage = 0;
    
    // 开始测试循环
    runTest(selectedCharacters, level, targetCount);
}

// 运行测试
function runTest(characters, level, targetCount) {
    if (!testRunning) return;
    
    // 计算所有角色的总伤害
    let damage = 0;
    characters.forEach(char => {
        const milestone = char.data.milestones[level];
        if (milestone) {
            damage += milestone.dps;
        }
    });
    
    // 多目标伤害计算
    if (targetCount > 1) {
        damage = damage * (1 + (targetCount - 1) * 0.5);
    }
    
    if (damage > 0) {
        totalDamage += damage;
        currentDummyHealth -= damage;
        
        // 更新木桩UI
        const maxHealth = 100000 * targetCount;
        const healthPercentage = Math.max(0, currentDummyHealth / maxHealth) * 100;
        document.getElementById('dummyHealth').style.height = `${healthPercentage}%`;
        document.getElementById('dummyHealthFill').style.width = `${healthPercentage}%`;
        
        // 显示伤害数字
        showDamageNumber(damage);
    }
    
    // 更新结果
    const testTime = (Date.now() - testStartTime) / 1000;
    const dps = totalDamage / testTime;
    
    document.getElementById('totalDamage').textContent = Math.round(totalDamage);
    document.getElementById('dps').textContent = Math.round(dps);
    document.getElementById('testTime').textContent = `${testTime.toFixed(1)}s`;
    
    // 检查木桩是否被击败
    if (currentDummyHealth <= 0) {
        document.getElementById('dummyStatus').textContent = `木桩状态: 已击败 (${targetCount}目标)`;
        testRunning = false;
        return;
    }
    
    // 继续测试
    setTimeout(() => runTest(characters, level, targetCount), 1000);
}

// 显示伤害数字
function showDamageNumber(damage) {
    const dummyVisual = document.querySelector('.dummy-visual');
    const damageText = document.createElement('div');
    damageText.className = 'damage-text';
    damageText.textContent = `+${Math.round(damage)}`;
    damageText.style.left = `${Math.random() * 80 + 10}%`;
    damageText.style.top = `${Math.random() * 50 + 20}%`;
    dummyVisual.appendChild(damageText);
    
    // 1秒后移除伤害数字
    setTimeout(() => {
        if (damageText.parentNode) {
            damageText.parentNode.removeChild(damageText);
        }
    }, 1000);
}

// 重置测试
function resetTest() {
    testRunning = false;
    document.getElementById('dummyHealth').style.height = '100%';
    document.getElementById('dummyHealthFill').style.width = '100%';
    document.getElementById('dummyStatus').textContent = '木桩状态: 就绪';
    document.getElementById('totalDamage').textContent = '0';
    document.getElementById('dps').textContent = '0';
    document.getElementById('testTime').textContent = '0s';
}

// 绘制DPS增长曲线图
function drawDPSChart() {
    const chartContainer = document.getElementById('dpsChart');
    const characterSelects = document.querySelectorAll('.character-select');
    
    // 清空图表
    chartContainer.innerHTML = '';
    
    // 收集所有选中角色的数据
    const characterData = [];
    characterSelects.forEach(select => {
        const characterId = select.value;
        if (characterId && milestoneData[characterId]) {
            const character = milestoneData[characterId];
            const dpsData = [];
            const levels = [1, 15, 30, 45, 60, 75, 90];
            
            levels.forEach(level => {
                if (character.milestones[level]) {
                    dpsData.push({
                        level: level,
                        dps: character.milestones[level].dps
                    });
                }
            });
            
            characterData.push({
                name: character.name,
                data: dpsData
            });
        }
    });
    
    if (characterData.length === 0) {
        chartContainer.innerHTML = '<p style="color: #8b7355; text-align: center; padding-top: 100px;">选择角色后显示DPS曲线</p>';
        return;
    }
    
    // 计算最大DPS值（用于缩放）
    let maxDPS = 0;
    characterData.forEach(char => {
        char.data.forEach(point => {
            if (point.dps > maxDPS) maxDPS = point.dps;
        });
    });
    
    // 图表尺寸
    const chartWidth = chartContainer.offsetWidth;
    const chartHeight = 300;
    const padding = 60;
    const barWidth = (chartWidth - padding * 2) / 7;
    
    // 绘制坐标轴
    const yAxis = document.createElement('div');
    yAxis.style.position = 'absolute';
    yAxis.style.left = '50px';
    yAxis.style.bottom = '40px';
    yAxis.style.width = '1px';
    yAxis.style.height = '220px';
    yAxis.style.background = '#3d3220';
    chartContainer.appendChild(yAxis);
    
    const xAxis = document.createElement('div');
    xAxis.style.position = 'absolute';
    xAxis.style.left = '50px';
    xAxis.style.bottom = '40px';
    xAxis.style.width = `${chartWidth - 100}px`;
    xAxis.style.height = '1px';
    xAxis.style.background = '#3d3220';
    chartContainer.appendChild(xAxis);
    
    // 绘制Y轴标签
    const yLabels = [0, maxDPS * 0.25, maxDPS * 0.5, maxDPS * 0.75, maxDPS];
    yLabels.forEach((value, index) => {
        const label = document.createElement('div');
        label.style.position = 'absolute';
        label.style.left = '10px';
        label.style.bottom = `${40 + index * 55}px`;
        label.style.color = '#a89f91';
        label.style.fontSize = '0.8em';
        label.textContent = Math.round(value);
        chartContainer.appendChild(label);
    });
    
    // 绘制每个角色的DPS曲线
    const colors = ['#d4af37', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24'];
    
    characterData.forEach((char, charIndex) => {
        const color = colors[charIndex % colors.length];
        
        char.data.forEach((point, pointIndex) => {
            const barHeight = (point.dps / maxDPS) * 200;
            const x = padding + pointIndex * barWidth + barWidth * 0.1;
            const y = 40;
            
            // 绘制柱状图
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.style.left = `${x + charIndex * 10}px`;
            bar.style.bottom = `${y}px`;
            bar.style.width = `${barWidth * 0.6}px`;
            bar.style.height = `${barHeight}px`;
            bar.style.background = color;
            bar.style.opacity = '0.8';
            chartContainer.appendChild(bar);
            
            // 显示数值
            if (charIndex === 0) {
                const value = document.createElement('div');
                value.className = 'chart-value';
                value.style.left = `${x + charIndex * 10}px`;
                value.style.bottom = `${y + barHeight + 5}px`;
                value.style.width = `${barWidth * 0.6}px`;
                value.style.textAlign = 'center';
                value.style.color = color;
                value.textContent = Math.round(point.dps);
                chartContainer.appendChild(value);
            }
        });
    });
    
    // 绘制X轴标签
    const levels = ['1级', '15级', '30级', '45级', '60级', '75级', '90级'];
    levels.forEach((label, index) => {
        const labelElement = document.createElement('div');
        labelElement.className = 'chart-label';
        labelElement.style.left = `${padding + index * barWidth}px`;
        labelElement.style.width = `${barWidth}px`;
        labelElement.textContent = label;
        chartContainer.appendChild(labelElement);
    });
    
    // 添加图例
    const legend = document.createElement('div');
    legend.style.position = 'absolute';
    legend.style.top = '10px';
    legend.style.right = '20px';
    legend.style.display = 'flex';
    legend.style.flexDirection = 'column';
    legend.style.gap = '5px';
    
    characterData.forEach((char, index) => {
        const legendItem = document.createElement('div');
        legendItem.style.display = 'flex';
        legendItem.style.alignItems = 'center';
        legendItem.style.gap = '5px';
        
        const colorBox = document.createElement('div');
        colorBox.style.width = '15px';
        colorBox.style.height = '15px';
        colorBox.style.background = colors[index % colors.length];
        colorBox.style.borderRadius = '2px';
        
        const labelText = document.createElement('span');
        labelText.style.color = '#a89f91';
        labelText.style.fontSize = '0.8em';
        labelText.textContent = char.name;
        
        legendItem.appendChild(colorBox);
        legendItem.appendChild(labelText);
        legend.appendChild(legendItem);
    });
    
    chartContainer.appendChild(legend);
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    updateMilestoneEffects();
    drawDPSChart();
    
    // 监听窗口大小变化，重新绘制图表
    window.addEventListener('resize', drawDPSChart);
});
