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
            hp: { name: "Beskar Plating (Max HP)", baseCost: 50, maxLvl: 10, valPerLvl: 20, desc: "Increase your max HP with legendary Beskar armor plating." },
            heat: { name: "Cooling Systems (Heat Drain)", baseCost: 40, maxLvl: 10, valPerLvl: 5, desc: "Upgrade your suit's cooling system to reduce heat faster." },
            dash: { name: "Jetpack Thrusters (Dash Regen)", baseCost: 60, maxLvl: 5, valPerLvl: 0.3, desc: "Enhance jetpack thruster efficiency for faster dash regeneration." },
            damage: { name: "Amban Rifle Core (Damage)", baseCost: 100, maxLvl: 5, valPerLvl: 1, desc: "Improve your rifle core for increased damage output." }
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
                if (window.audio && settings.sound) audio.powerup();
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
            let snd = document.getElementById('sett-sound');
            if (sh) { sh.innerText = settings.shake ? 'ON' : 'OFF'; sh.style.color = settings.shake ? '#00aaff' : '#555'; sh.style.borderColor = settings.shake ? '#00aaff' : '#555'; }
            if (mm) { mm.innerText = settings.minimap ? 'ON' : 'OFF'; mm.style.color = settings.minimap ? '#00aaff' : '#555'; mm.style.borderColor = settings.minimap ? '#00aaff' : '#555'; }
            if (snd) { snd.innerText = settings.sound ? 'ON' : 'OFF'; snd.style.color = settings.sound ? '#00aaff' : '#555'; snd.style.borderColor = settings.sound ? '#00aaff' : '#555'; }
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
                <p>${u.desc}</p>
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
            particles: localStorage.getItem('sett_particles') || 'high',
            sound: localStorage.getItem('sett_sound') !== 'false'
        };

        function toggleSound() {
            settings.sound = !settings.sound;
            localStorage.setItem('sett_sound', settings.sound);
            showSettings();
        }
