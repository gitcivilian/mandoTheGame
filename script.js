// === ENEMY VARIETY & BOSS WAVES ADDITIONS START ===
// Define enemy types
const ENEMY_TYPES = {
    normal: { hp: 30, speed: 1.2, damage: 8, color: "#888" },
    bruiser: { hp: 80, speed: 0.7, damage: 15, color: "#B22222" },
    runner: { hp: 18, speed: 2.2, damage: 5, color: "#4682B4" },
    boss: { hp: 300, speed: 1.0, damage: 25, color: "#FFD700", special: true }
};

// Wave enemy spawn logic
function spawnEnemies(waveNum) {
    let enemies = [];
    if (waveNum % 5 === 0) {
        // Boss wave
        enemies.push({
            type: "boss",
            ...ENEMY_TYPES.boss
        });
        // Add minions
        for (let i = 0; i < waveNum / 2; i++) {
            let mType = Math.random() > 0.5 ? "runner" : "bruiser";
            enemies.push({
                type: mType,
                ...ENEMY_TYPES[mType]
            });
        }
    } else {
        // Standard wave: mix of normal, bruiser, runner
        for (let i = 0; i < waveNum * 2; i++) {
            let rand = Math.random();
            let type = rand < 0.6 ? "normal" : rand < 0.8 ? "runner" : "bruiser";
            enemies.push({
                type,
                ...ENEMY_TYPES[type]
            });
        }
    }
    return enemies;
}

// Visual enemy rendering example, integrate into actual render function
function renderEnemy(context, enemy) {
    context.fillStyle = enemy.color;
    context.fillRect(enemy.x, enemy.y, enemy.width || 24, enemy.height || 24);
}

// Boss wave banner logic
function showBanner(msg) {
    const banner = document.createElement('div');
    banner.innerText = msg;
    banner.style.position = 'absolute';
    banner.style.top = '30px';
    banner.style.left = '50%';
    banner.style.transform = 'translateX(-50%)';
    banner.style.background = '#222';
    banner.style.color = '#FFD700';
    banner.style.fontSize = '2rem';
    banner.style.padding = '16px 40px';
    banner.style.borderRadius = '12px';
    banner.style.zIndex = '9999';
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 1800);
}

// Example: show banner on boss wave
function onWaveStart(waveNum) {
    if (waveNum % 5 === 0) showBanner("Boss Wave!");
}

// Boss special attack (simple AoE pulse)
function bossSpecialAttack(enemy, player) {
    if (enemy.type === "boss" && Math.random() < 0.01) { // ~1% chance per frame
        let dx = player.x - enemy.x;
        let dy = player.y - enemy.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 96) {
            // Apply damage to player (implement player.damage function as needed)
            if (typeof player.damage === 'function') player.damage(18);
            // Optionally, visual effect here
        }
    }
}
// === ENEMY VARIETY & BOSS WAVES ADDITIONS END ===


        let currentDifficulty = { mult: 1.0, beskar: 2 };

        function setDiff(lvl, el) {
            document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
            el.classList.add('active');
            if (lvl === 'easy') currentDifficulty = { mult: 0.7, beskar: 1 };
            if (lvl === 'normal') currentDifficulty = { mult: 1.0, beskar: 2 };
            if (lvl === 'hard') currentDifficulty = { mult: 1.5, beskar: 3 };
            if (lvl === 'extreme') currentDifficulty = { mult: 2.5, beskar: 5 };
            if (lvl === 'extreme') el.style.boxShadow = '0 0 15px rgba(255,0,0,0.5)';
        }

        const UPGRADES = {
            hp: { name: "Beskar Plating (Max HP)", baseCost: 50, maxLvl: 10, valPerLvl: 20 },
            heat: { name: "Cooling Systems (Heat Drain)", baseCost: 40, maxLvl: 10, valPerLvl: 5 },
            dash: { name: "Jetpack Thrusters (Dash Regen)", baseCost: 60, maxLvl: 5, valPerLvl: 0.3 },
            damage: { name: "Amban Rifle Core (Damage)", baseCost: 100, maxLvl: 5, valPerLvl: 1 }
        };

        let save = {
            beskar: parseInt(localStorage.getItem('mando_beskar')) || 0,
            lvl_hp: parseInt(localStorage.getItem('mando_lvl_hp')) || 1,
            lvl_heat: parseInt(localStorage.getItem('mando_lvl_heat')) || 1,
            lvl_dash: parseInt(localStorage.getItem('mando_lvl_dash')) || 1,
            lvl_damage: parseInt(localStorage.getItem('mando_lvl_damage')) || 1,
            bestWave: parseInt(localStorage.getItem('mando_best_wave')) || 0,
            totalKills: parseInt(localStorage.getItem('mando_total_kills')) || 0,
        };

        function saveGame() {
            localStorage.setItem('mando_beskar', save.beskar);
            localStorage.setItem('mando_lvl_hp', save.lvl_hp);
            localStorage.setItem('mando_lvl_heat', save.lvl_heat);
            localStorage.setItem('mando_lvl_dash', save.lvl_dash);
            localStorage.setItem('mando_lvl_damage', save.lvl_damage);
            localStorage.setItem('mando_best_wave', save.bestWave);
            localStorage.setItem('mando_total_kills', save.totalKills);
            updateMenuUI();
        }

        function getUpgradeCost(key) { return Math.floor(UPGRADES[key].baseCost * Math.pow(1.5, save['lvl_' + key] - 1)); }

        function buyUpgrade(key) {
            let cost = getUpgradeCost(key);
            if (save.beskar >= cost && save['lvl_' + key] < UPGRADES[key].maxLvl) {
                save.beskar -= cost;
                save['lvl_' + key]++;
                saveGame();
                renderUpgrades();
                if (window.audio) audio.powerup();
            }
        }

        function showMainMenu() {
            document.getElementById('main-menu').style.display = 'flex';
            document.getElementById('upgrade-menu').style.display = 'none';
            document.getElementById('end-screen').style.display = 'none';
            document.getElementById('settings-menu').style.display = 'none';
            updateMenuUI();
        }
        function showUpgrades() {
            document.getElementById('main-menu').style.display = 'none';
            document.getElementById('upgrade-menu').style.display = 'flex';
            renderUpgrades();
        }
        function showSettings() {
            document.getElementById('main-menu').style.display = 'none';
            document.getElementById('settings-menu').style.display = 'flex';
            // sync button states
            let sh = document.getElementById('sett-shake');
            let mm = document.getElementById('sett-minimap');
            if (sh) { sh.innerText = settings.shake ? 'ON' : 'OFF'; sh.style.color = settings.shake ? '#00aaff' : '#555'; sh.style.borderColor = settings.shake ? '#00aaff' : '#555'; }
            if (mm) { mm.innerText = settings.minimap ? 'ON' : 'OFF'; mm.style.color = settings.minimap ? '#00aaff' : '#555'; mm.style.borderColor = settings.minimap ? '#00aaff' : '#555'; }
            document.getElementById('sett-part-low').style.borderColor = settings.particles === 'low' ? '#00aaff' : '#555';
            document.getElementById('sett-part-high').style.borderColor = settings.particles === 'high' ? '#00aaff' : '#555';
        }
        function updateMenuUI() {
            document.getElementById('menu-beskar').innerText = save.beskar;
            document.getElementById('forge-beskar').innerText = save.beskar;
            let bw = document.getElementById('menu-best-wave'); if (bw) bw.innerText = save.bestWave || '-';
            let mk = document.getElementById('menu-kills'); if (mk) mk.innerText = save.totalKills || '-';
        }
        function renderUpgrades() {
            let html = '';
            for (let k in UPGRADES) {
                let u = UPGRADES[k]; let lvl = save['lvl_' + k]; let cost = getUpgradeCost(k);
                let maxed = lvl >= u.maxLvl;
                html += `
        <div class="upgrade-row">
            <div class="upgrade-info">
                <h3>${u.name}</h3>
                <p>Level ${lvl} / ${u.maxLvl}</p>
            </div>
            <div style="display:flex; align-items:center; gap:20px;">
                <div class="upgrade-cost">${maxed ? 'MAXED' : cost + ' BSK'}</div>
                <button class="upgrade-btn" ${maxed || save.beskar < cost ? 'disabled' : ''} onclick="buyUpgrade('${k}')">FORGE</button>
            </div>
        </div>`;
            }
            document.querySelector('.upgrade-list').innerHTML = html;
            updateMenuUI();
        }
        updateMenuUI();

        // Settings system
        let settings = {
            shake: localStorage.getItem('sett_shake') !== 'false',
            minimap: localStorage.getItem('sett_minimap') !== 'false',
            particles: localStorage.getItem('sett_particles') || 'high'
        };