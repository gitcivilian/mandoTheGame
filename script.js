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
        function toggleSetting(key) {
            settings[key] = !settings[key];
            localStorage.setItem('sett_' + key, settings[key]);
            showSettings();
        }
        function setParticles(val) {
            settings.particles = val;
            localStorage.setItem('sett_particles', val);
            showSettings();
        }
        function wipeSave() {
            if (!confirm('This Is The Way... to delete everything. Are you sure?')) return;
            localStorage.clear(); save.beskar = 0; save.lvl_hp = 1; save.lvl_heat = 1; save.lvl_dash = 1; save.lvl_damage = 1; save.bestWave = 0; save.totalKills = 0;
            updateMenuUI();
            alert('Save wiped. This is the Way.');
        }

        function updateMenuUI() {
            document.getElementById('menu-beskar').innerText = save.beskar;
            if (document.getElementById('forge-beskar')) document.getElementById('forge-beskar').innerText = save.beskar;
            let bw = document.getElementById('menu-best-wave'); if (bw) bw.innerText = save.bestWave || '-';
            let mk = document.getElementById('menu-kills'); if (mk) mk.innerText = save.totalKills || '-';
        }
        function startGame() { engine.start(ExtractionMode); }

        // Daily Contract system
        const DAILY_CONTRACTS = [
            { text: 'Survive to Wave 3', reward: 'TRIPLE BESKAR on next extraction', key: 'wave3', check: (s) => (s.bestWave || 0) >= 3 },
            { text: 'Eliminate 10 Scouts in one run', reward: '+50 Bonus Beskar on completion', key: 'scouts10', check: null },
            { text: 'Reach 5x Combo Multiplier', reward: 'Beskar ingot bonus x2 today', key: 'combo5', check: null },
            { text: 'Defeat a Bounty Target', reward: 'Extra Beskar loot from all Bounties', key: 'bounty', check: null },
            { text: 'Extract without dying', reward: 'DOUBLE extraction payout', key: 'perfect', check: null },
            { text: 'Kill 5 enemies with Wrist Flamer', reward: '+30 Beskar on any extraction', key: 'flamer5', check: null },
            { text: 'Reach Wave 5 Boss', reward: 'Boss drops 2x loot today', key: 'boss', check: null },
        ];
        function getDailyContract() {
            let day = Math.floor(Date.now() / 86400000);
            return DAILY_CONTRACTS[day % DAILY_CONTRACTS.length];
        }
        function renderDailyContract() {
            let c = getDailyContract();
            let el = document.getElementById('contract-text'); if (el) el.innerText = c.text;
            let re = document.getElementById('contract-reward'); if (re) re.innerText = '⟶ ' + c.reward;
        }
        renderDailyContract();

        // ==========================================
        // UTILITIES
        // ==========================================
        class Vector2 {
            constructor(x = 0, y = 0) { this.x = x; this.y = y; }
            add(v) { return new Vector2(this.x + v.x, this.y + v.y); }
            sub(v) { return new Vector2(this.x - v.x, this.y - v.y); }
            mult(n) { return new Vector2(this.x * n, this.y * n); }
            mag() { return Math.sqrt(this.x * this.x + this.y * this.y); }
            normalize() { let m = this.mag(); return m === 0 ? new Vector2() : new Vector2(this.x / m, this.y / m); }
            dist(v) { return Math.hypot(this.x - v.x, this.y - v.y); }
            lerp(v, amt) { return new Vector2(this.x + (v.x - this.x) * amt, this.y + (v.y - this.y) * amt); }
        }
        const MathUtils = { randomRange: (min, max) => Math.random() * (max - min) + min };

        class AudioEngine {
            constructor() { this.ctx = null; }
            init() { if (!this.ctx) { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } if (this.ctx.state === 'suspended') this.ctx.resume(); }
            playTone(type, f1, f2, dur, vol, wave = 'square') {
                if (!this.ctx) return;
                let o = this.ctx.createOscillator(); let g = this.ctx.createGain();
                o.connect(g); g.connect(this.ctx.destination);
                let n = this.ctx.currentTime; o.type = wave;
                o.frequency.setValueAtTime(f1, n); o.frequency.exponentialRampToValueAtTime(Math.max(f2, 1), n + dur);
                g.gain.setValueAtTime(vol, n); g.gain.exponentialRampToValueAtTime(0.001, n + dur);
                o.start(n); o.stop(n + dur);
            }
            playNoise(dur, vol1, vol2, filterType = 'lowpass', filterFreq = 1000) {
                if (!this.ctx) return;
                try {
                    let bufferSize = this.ctx.sampleRate * dur;
                    let buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                    let data = buffer.getChannelData(0);
                    for (let i = 0; i < bufferSize; i++) { data[i] = Math.random() * 2 - 1; }
                    let noiseNode = this.ctx.createBufferSource();
                    noiseNode.buffer = buffer;
                    let filter = this.ctx.createBiquadFilter();
                    filter.type = filterType; filter.frequency.setValueAtTime(filterFreq, this.ctx.currentTime);
                    let gain = this.ctx.createGain();
                    let n = this.ctx.currentTime;
                    gain.gain.setValueAtTime(vol1, n); gain.gain.exponentialRampToValueAtTime(Math.max(vol2, 0.001), n + dur);
                    noiseNode.connect(filter); filter.connect(gain); gain.connect(this.ctx.destination);
                    noiseNode.start(n); noiseNode.stop(n + dur);
                } catch(e){}
            }
            shoot() { 
                let aw = (engine && engine.scene && engine.scene.player) ? engine.scene.player.getActiveWeapon() : 'blaster';
                if (aw === 'sniper') {
                    this.playTone('sniper', 1200, 50, 0.6, 0.25, 'sawtooth');
                    this.playNoise(0.5, 0.15, 0.001, 'bandpass', 400);
                } else if (aw === 'heavy') {
                    this.playTone('heavy', 500, 100, 0.08, 0.12, 'sawtooth');
                    this.playTone('heavy2', 250, 50, 0.08, 0.06, 'sawtooth');
                } else if (aw === 'flamer') {
                    this.playNoise(0.2, 0.14, 0.001, 'bandpass', 1200);
                } else {
                    this.playTone('shoot', 750, 120, 0.12, 0.06, 'sawtooth');
                    this.playNoise(0.04, 0.015, 0.001, 'highpass', 2500);
                }
            }
            bossShoot() { this.playTone('boss', 200, 50, 0.5, 0.3, 'sawtooth'); }
            hit() { 
                this.playTone('hit', 160, 40, 0.1, 0.15, 'square'); 
                this.playNoise(0.08, 0.08, 0.001, 'bandpass', 500);
            }
            kill() { 
                let now = this.ctx.currentTime;
                let notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (highly rewarding ascending chord!)
                notes.forEach((freq, idx) => {
                    let o = this.ctx.createOscillator(); let g = this.ctx.createGain();
                    o.connect(g); g.connect(this.ctx.destination);
                    o.type = 'triangle'; o.frequency.setValueAtTime(freq, now + idx * 0.03);
                    g.gain.setValueAtTime(0.05, now + idx * 0.03);
                    g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.03 + 0.12);
                    o.start(now + idx * 0.03); o.stop(now + idx * 0.03 + 0.12);
                });
            }
            beskar() { 
                this.playTone('beskar1', 2800, 3200, 0.18, 0.08, 'sine');
                setTimeout(() => this.playTone('beskar2', 3600, 4000, 0.12, 0.06, 'sine'), 30);
            }
            powerup() { 
                let now = this.ctx.currentTime;
                let notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // Beautiful full scale arpeggio
                notes.forEach((freq, idx) => {
                    let o = this.ctx.createOscillator(); let g = this.ctx.createGain();
                    o.connect(g); g.connect(this.ctx.destination);
                    o.type = 'sine'; o.frequency.setValueAtTime(freq, now + idx * 0.05);
                    g.gain.setValueAtTime(0.08, now + idx * 0.05);
                    g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.2);
                    o.start(now + idx * 0.05); o.stop(now + idx * 0.05 + 0.2);
                });
            }
            dash() { this.playTone('dash', 350, 1050, 0.2, 0.08, 'sine'); }
            vent() { 
                this.playNoise(0.55, 0.18, 0.001, 'bandpass', 1600);
                this.playTone('vent2', 900, 150, 0.45, 0.08, 'sawtooth');
            }
            overheat() { 
                this.playTone('overheat', 150, 60, 0.5, 0.18, 'sawtooth'); 
                this.playNoise(0.3, 0.05, 0.001, 'lowpass', 400);
            }
            orbitalCall() { this.playTone('call', 600, 850, 0.7, 0.08, 'sine'); setTimeout(() => this.orbitalStrike(), 1200); }
            orbitalStrike() { 
                this.playTone('strike', 140, 10, 1.8, 0.55, 'sawtooth'); 
                this.playNoise(1.8, 0.4, 0.001, 'lowpass', 250);
            }
            alarm() { 
                let now = this.ctx.currentTime;
                // Double synth retro siren sweep
                let o1 = this.ctx.createOscillator(); let o2 = this.ctx.createOscillator();
                let g = this.ctx.createGain(); o1.connect(g); o2.connect(g); g.connect(this.ctx.destination);
                o1.type = 'sawtooth'; o2.type = 'square';
                o1.frequency.setValueAtTime(400, now); o1.frequency.linearRampToValueAtTime(800, now + 0.15); o1.frequency.linearRampToValueAtTime(400, now + 0.3);
                o2.frequency.setValueAtTime(404, now); o2.frequency.linearRampToValueAtTime(808, now + 0.15); o2.frequency.linearRampToValueAtTime(404, now + 0.3);
                g.gain.setValueAtTime(0.08, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                o1.start(now); o1.stop(now + 0.3); o2.start(now); o2.stop(now + 0.3);
            }
            heal() { 
                let now = this.ctx.currentTime;
                let notes = [329.63, 392.00, 523.25, 659.25, 783.99]; // Uplifting major chord
                notes.forEach((freq, idx) => {
                    let o = this.ctx.createOscillator(); let g = this.ctx.createGain();
                    o.connect(g); g.connect(this.ctx.destination);
                    o.type = 'triangle'; o.frequency.setValueAtTime(freq, now + idx * 0.04);
                    g.gain.setValueAtTime(0.06, now + idx * 0.04);
                    g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.25);
                    o.start(now + idx * 0.04); o.stop(now + idx * 0.04 + 0.25);
                });
            }
            heartbeat() {
                // Procedural physical double-thump heartbeat
                let now = this.ctx.currentTime;
                let o = this.ctx.createOscillator(); let g = this.ctx.createGain();
                o.connect(g); g.connect(this.ctx.destination);
                o.type = 'triangle'; o.frequency.setValueAtTime(60, now); o.frequency.exponentialRampToValueAtTime(20, now + 0.12);
                g.gain.setValueAtTime(0.28, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                o.start(now); o.stop(now + 0.12);
                
                setTimeout(() => {
                    if (!this.ctx) return;
                    let now2 = this.ctx.currentTime;
                    let o2 = this.ctx.createOscillator(); let g2 = this.ctx.createGain();
                    o2.connect(g2); g2.connect(this.ctx.destination);
                    o2.type = 'triangle'; o2.frequency.setValueAtTime(50, now2); o2.frequency.exponentialRampToValueAtTime(15, now2 + 0.12);
                    g2.gain.setValueAtTime(0.20, now2); g2.gain.exponentialRampToValueAtTime(0.001, now2 + 0.12);
                    o2.start(now2); o2.stop(now2 + 0.12);
                }, 130);
            }
        }
        const audio = new AudioEngine();

        const input = {
            keys: {}, mouse: new Vector2(), isMouseDown: false, justClicked: false,
            init() {
                window.addEventListener('keydown', e => { this.keys[e.key.toLowerCase()] = true; });
                window.addEventListener('keyup', e => { this.keys[e.key.toLowerCase()] = false; });
                window.addEventListener('mousemove', e => { this.mouse.x = e.clientX; this.mouse.y = e.clientY; });
                window.addEventListener('mousedown', () => { this.isMouseDown = true; this.justClicked = true; });
                window.addEventListener('mouseup', () => { this.isMouseDown = false; });

                window.addEventListener('touchstart', (e) => {
                    this.isMouseDown = true; this.justClicked = true;
                    if (e.touches.length > 0) { this.mouse.x = e.touches[0].clientX; this.mouse.y = e.touches[0].clientY; }
                }, { passive: false });
                window.addEventListener('touchmove', (e) => {
                    if (e.touches.length > 0) { this.mouse.x = e.touches[0].clientX; this.mouse.y = e.touches[0].clientY; }
                }, { passive: false });
                window.addEventListener('touchend', () => { this.isMouseDown = false; }, { passive: false });
                window.addEventListener('touchcancel', () => { this.isMouseDown = false; }, { passive: false });
            },
            isPressed(k) { return !!this.keys[k]; }
        };
        input.init();

        class Camera {
            constructor() { this.pos = new Vector2(); this.target = new Vector2(); this.shakeTimer = 0; this.shakeIntensity = 0; }
            update(dt, playerPos, mousePos) {
                let lookAhead = new Vector2((mousePos.x - window.innerWidth / 2) * 0.03, (mousePos.y - window.innerHeight / 2) * 0.03);
                this.target = playerPos.add(lookAhead);
                this.pos = this.pos.lerp(this.target, 12 * dt);
                if (this.shakeTimer > 0) this.shakeTimer -= dt;
            }
            shake(i, d) { if (!settings || settings.shake !== false) { this.shakeIntensity = i; this.shakeTimer = d; } }
            apply(ctx) {
                let sx = this.shakeTimer > 0 ? MathUtils.randomRange(-this.shakeIntensity, this.shakeIntensity) : 0;
                let sy = this.shakeTimer > 0 ? MathUtils.randomRange(-this.shakeIntensity, this.shakeIntensity) : 0;
                ctx.translate(window.innerWidth / 2 - this.pos.x + sx, window.innerHeight / 2 - this.pos.y + sy);
            }
        }

        const AVAILABLE_PERKS = [
            { id: 'RICOCHET', name: 'BESKAR RICOCHET', desc: 'Blaster bolts cleanly bounce off walls once.', icon: 'fa-solid fa-angles-right' },
            { id: 'VAMPIRISM', name: 'FORCE SIPHON', desc: '10% chance to heal 10 HP on any kill.', icon: 'fa-solid fa-hand-sparkles' },
            { id: 'DOUBLE', name: 'TWIN BLASTER', desc: 'Fires two blaster bolts simultaneously side-by-side.', icon: 'fa-solid fa-arrows-split-up-and-left' },
            { id: 'OVERCLOCK', name: 'RAPID COOLING', desc: 'Blaster fire rate increased by a massive 25%.', icon: 'fa-solid fa-fire-flame-curved' },
            { id: 'SPEED', name: 'BOOSTED SERVOS', desc: 'Movement speed permanently increased by +20%.', icon: 'fa-solid fa-gauge-high' },
            { id: 'EXPLOSIVE', name: 'THERMAL ROUNDS', desc: 'Bolts create a small splash-damage explosion on impact.', icon: 'fa-solid fa-bomb' }
        ];

        class Entity {
            constructor(x, y, radius) { this.pos = new Vector2(x, y); this.vel = new Vector2(); this.radius = radius; this.dead = false; }
            update(dt) { this.pos = this.pos.add(this.vel.mult(dt)); }
            draw(ctx) { }
        }

        function resolveCircleAABB(c, r) {
            let tx = c.pos.x; let ty = c.pos.y;
            if (c.pos.x < r.pos.x) tx = r.pos.x; else if (c.pos.x > r.pos.x + r.w) tx = r.pos.x + r.w;
            if (c.pos.y < r.pos.y) ty = r.pos.y; else if (c.pos.y > r.pos.y + r.h) ty = r.pos.y + r.h;

            let dx = c.pos.x - tx; let dy = c.pos.y - ty;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < c.radius) {
                let push = c.radius - dist;
                let dir;

                if (dist === 0) {
                    // Circle center is exactly on the rectangle edge or inside
                    let dLeft = c.pos.x - r.pos.x;
                    let dRight = (r.pos.x + r.w) - c.pos.x;
                    let dTop = c.pos.y - r.pos.y;
                    let dBottom = (r.pos.y + r.h) - c.pos.y;

                    let minD = Math.min(dLeft, dRight, dTop, dBottom);
                    if (minD === dLeft) dir = new Vector2(-1, 0);
                    else if (minD === dRight) dir = new Vector2(1, 0);
                    else if (minD === dTop) dir = new Vector2(0, -1);
                    else dir = new Vector2(0, 1);
                    push = c.radius + minD;
                } else {
                    dir = new Vector2(dx / dist, dy / dist);
                }

                c.pos = c.pos.add(dir.mult(push));

                // Remove velocity into the wall to allow sliding
                let dot = c.vel.x * dir.x + c.vel.y * dir.y;
                if (dot < 0) {
                    c.vel.x -= dot * dir.x;
                    c.vel.y -= dot * dir.y;
                }
                return true;
            }
            return false;
        }

        class Wall {
            constructor(x, y, w, h) { this.pos = new Vector2(x, y); this.w = w; this.h = h; }
            draw(ctx) {
                ctx.fillStyle = 'rgba(10, 15, 20, 0.8)'; ctx.strokeStyle = '#00aaff'; ctx.lineWidth = 2;
                ctx.fillRect(this.pos.x, this.pos.y, this.w, this.h);
                ctx.strokeRect(this.pos.x, this.pos.y, this.w, this.h);
                ctx.beginPath(); ctx.moveTo(this.pos.x, this.pos.y); ctx.lineTo(this.pos.x + 10, this.pos.y + 10); ctx.stroke();
            }
        }

        class Player extends Entity {
            constructor() {
                super(0, 0, 18);
                this.maxHp = 80 + (save.lvl_hp * UPGRADES.hp.valPerLvl);
                this.hp = this.maxHp; this.overshield = 0;

                this.maxSpeed = 320; this.accel = 3000; this.friction = 0.8;
                this.recoil = new Vector2(); this.angle = 0;

                this.dashes = 3; this.dashRecharge = 0;
                this.dashRechargeRate = 3.0 - (save.lvl_dash * UPGRADES.dash.valPerLvl);
                this.isDashing = false; this.dashTimer = 0;

                this.heat = 0; this.overheated = false;
                this.heatDrain = 40 + (save.lvl_heat * UPGRADES.heat.valPerLvl);
                this.dmgMultiplier = 1 + (save.lvl_damage * UPGRADES.damage.valPerLvl);

                this.weapon = 'default'; this.weaponAmmo = 0;
                // 5-slot loadout: 0=blaster(perm), 1=dart(perm,cd), 2=flamer(perm,cd), 3-4=acquired pickups
                this.slots = [
                    { type: 'blaster', ammo: -1, cd: 0, maxCd: 0, label: 'BLASTER' },
                    { type: 'dart', ammo: -1, cd: 0, maxCd: 12, label: 'DART PISTOL' },
                    { type: 'flamer', ammo: -1, cd: 0, maxCd: 20, label: 'WRIST FLAMER' },
                    { type: null, ammo: 0, cd: 0, maxCd: 0, label: '--' },
                    { type: null, ammo: 0, cd: 0, maxCd: 0, label: '--' }
                ];
                this.activeSlot = 0;
                this.forceCooldown = 0; this.forceShield = 0;
            }
            getActiveWeapon() { return this.slots[this.activeSlot].type || 'blaster'; }
            switchToSlot(s) {
                if (s === this.activeSlot) return;
                let slot = this.slots[s];
                if (!slot) return;
                if (s < 3 && slot.cd > 0) return; // perm weapon on cooldown
                if (s >= 3 && !slot.type) return; // empty acquired slot
                this.activeSlot = s;
                this.weapon = this.getActiveWeapon();
                this.weaponAmmo = slot.ammo;
            }
            acquireWeapon(type, ammo) {
                let target = 3;
                if (this.slots[3].type !== null) target = 4;
                this.slots[target] = { type, ammo, cd: 0, maxCd: 0, label: type.toUpperCase() };
                this.activeSlot = target;
                this.weapon = type;
                this.weaponAmmo = ammo;
            }
            update(dt, walls) {
                let moveDir = new Vector2();
                if (input.isPressed('w')) moveDir.y -= 1; if (input.isPressed('s')) moveDir.y += 1;
                if (input.isPressed('a')) moveDir.x -= 1; if (input.isPressed('d')) moveDir.x += 1;
                moveDir = moveDir.normalize();

                if (input.isPressed('1')) this.switchToSlot(0);
                if (input.isPressed('2')) this.switchToSlot(1);
                if (input.isPressed('3')) this.switchToSlot(2);
                if (input.isPressed('4')) this.switchToSlot(3);
                if (input.isPressed('5')) this.switchToSlot(4);

                // Tick cooldowns on perm sidearms
                for (let i = 1; i < 3; i++) {
                    if (this.slots[i].cd > 0) this.slots[i].cd -= dt;
                    if (this.slots[i].cd < 0) this.slots[i].cd = 0;
                    // auto-switch back from depleted sidearm to blaster
                    if (this.activeSlot === i && this.slots[i].cd > 0) this.switchToSlot(0);
                }

                if (this.dashes < 3) {
                    this.dashRecharge += dt;
                    if (this.dashRecharge >= this.dashRechargeRate) { this.dashRecharge = 0; this.dashes++; }
                }

                if (input.isPressed('shift') && this.dashTimer <= 0 && this.dashes > 0 && moveDir.mag() > 0) {
                    this.dashTimer = 0.35; this.dashes--; this.isDashing = true; audio.dash();
                    this.vel = moveDir.mult(this.maxSpeed * 3.5);
                    engine.camera.shake(6, 0.15); engine.scene.spawnParticles(this.pos, '#00aaff', 20);
                }
                if (this.dashTimer > 0) { this.dashTimer -= dt; if (this.dashTimer <= 0) this.isDashing = false; }

                if (!this.isDashing) {
                    this.vel = this.vel.add(moveDir.mult(this.accel * dt));
                    this.vel.x *= this.friction; this.vel.y *= this.friction;
                    if (this.vel.mag() > this.maxSpeed) this.vel = this.vel.normalize().mult(this.maxSpeed);
                }
                this.pos = this.pos.add(this.vel.mult(dt)).add(this.recoil.mult(dt));
                this.recoil.x *= 0.8; this.recoil.y *= 0.8;

                for (let w of walls) { resolveCircleAABB(this, w); }

                if (this.heat > 0) {
                    if (this.overheated) {
                        this.heat -= this.heatDrain * 0.6 * dt;
                    } else if (!input.isMouseDown && !input.justClicked) {
                        this.heat -= this.heatDrain * dt;
                    }
                }

                if (input.isPressed('r') && this.heat > 10) {
                    this.heat = 0; this.overheated = false; audio.vent(); engine.camera.shake(12, 0.2);
                    engine.scene.spawnParticles(this.pos, '#ffffff', 40, 3);
                    for (let e of engine.scene.enemies) { if (e.pos.dist(this.pos) < 250) { e.vel = e.pos.sub(this.pos).normalize().mult(1500); } }
                }

                if (this.heat <= 0) { this.heat = 0; this.overheated = false; }
                if (this.heat >= 100 && !this.overheated) { this.overheated = true; audio.overheat(); }

                if (this.forceCooldown > 0) this.forceCooldown -= dt;
                if (this.forceShield > 0) this.forceShield -= dt;
            }

            takeDamage(amt) {
                if (this.forceShield > 0) return;
                let wasDamaged = this.hp;
                if (this.overshield > 0) {
                    let over = amt - this.overshield; this.overshield -= amt;
                    if (this.overshield < 0) this.overshield = 0;
                    if (over > 0) this.hp -= over;
                } else { this.hp -= amt; }
                
                if (this.hp < wasDamaged) {
                    let canvas = document.getElementById('gameCanvas');
                    if (canvas) {
                        canvas.classList.add('hit');
                        setTimeout(() => canvas.classList.remove('hit'), 200);
                    }
                }
            }

            draw(ctx) {
                ctx.save(); ctx.translate(this.pos.x, this.pos.y); ctx.rotate(this.angle);
                if (engine.images.mando && engine.images.mando.complete && engine.images.mando.naturalWidth > 0) {
                    ctx.drawImage(engine.images.mando, -32, -32, 64, 64);
                } else {
                    ctx.beginPath(); ctx.arc(0, 0, this.radius, 0, Math.PI * 2); ctx.fillStyle = '#a9b8c2'; ctx.fill();
                }
                if (this.isDashing) { ctx.beginPath(); ctx.arc(0, 0, this.radius + 12, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(0, 170, 255, 0.6)'; ctx.lineWidth = 4; ctx.stroke(); }
                ctx.restore();

                if (this.forceShield > 0) {
                    ctx.beginPath(); ctx.arc(this.pos.x, this.pos.y, this.radius + 20, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(0, 255, 170, ${Math.min(1.0, this.forceShield)})`; ctx.lineWidth = 4; ctx.stroke();
                    ctx.fillStyle = `rgba(0, 255, 170, ${Math.min(0.2, this.forceShield * 0.2)})`; ctx.fill();
                }
            }
        }

        class Grogu extends Entity {
            constructor(p) { super(p.pos.x, p.pos.y, 12); this.target = p; }
            update(dt) {
                let d = this.pos.dist(this.target.pos);
                if (d > 60) { this.vel = this.target.pos.sub(this.pos).normalize().mult(d * 3.0); }
                else { this.vel.x *= 0.8; this.vel.y *= 0.8; }
                super.update(dt);
            }
            draw(ctx) {
                ctx.save(); ctx.translate(this.pos.x, this.pos.y);
                let f = Math.sin(Date.now() * 0.005) * 6;
                if (engine.images.grogu && engine.images.grogu.complete && engine.images.grogu.naturalWidth > 0) {
                    ctx.drawImage(engine.images.grogu, -24, -24 + f, 48, 48);
                }
                ctx.restore();
            }
        }

        class Enemy extends Entity {
            constructor(x, y, type, waveMult) {
                super(x, y, type == 'bounty' ? 22 : type == 'darktrooper' ? 22 : type == 'scout' ? 16 : 18); this.type = type;
                // HP tuned so scouts survive 3-4 hits, darktroopers 5-6 hits at base blaster damage (20 * 2 = 40)
                this.hp = (type == 'bounty' ? 200 : type == 'darktrooper' ? 160 : type == 'scout' ? 80 : 50) * waveMult * currentDifficulty.mult;
                this.maxHp = this.hp;
                this.speed = (type == 'bounty' ? 200 : type == 'darktrooper' ? 190 : type == 'scout' ? 300 : 145) * (currentDifficulty.mult > 1 ? 1.1 : 1.0);
                this.color = type == 'bounty' ? '#ffaa00' : type == 'darktrooper' ? '#ff3333' : type == 'scout' ? '#00ffff' : '#fff';
                this.sniperTimer = 0; this.aimAngle = 0; this.strafeDir = Math.random() > 0.5 ? 1 : -1;
                this.meleeTimer = 0; this.strafePhaseTick = 0;
            }
            update(dt, playerPos, allEnemies, walls) {
                let d = this.pos.dist(playerPos); let dir = playerPos.sub(this.pos).normalize();

                // ---- Line of Sight via Ray Marching ----
                let canSee = true;
                let steps = 12;
                for (let i = 1; i <= steps; i++) {
                    let px = this.pos.x + dir.x * (d * i / steps);
                    let py = this.pos.y + dir.y * (d * i / steps);
                    for (let w of walls) {
                        if (px > w.pos.x && px < w.pos.x + w.w && py > w.pos.y && py < w.pos.y + w.h) { canSee = false; break; }
                    }
                    if (!canSee) break;
                }

                // ---- Strafe phase flip (prevents deadlock orbiting) ----
                this.strafePhaseTick += dt;
                if (this.strafePhaseTick > 2.5 + Math.random()) { this.strafeDir *= -1; this.strafePhaseTick = 0; }

                let moveDir = dir;
                let activeSpeed = this.speed;

                // ---- Type-specific movement intent ----
                if (this.type === 'darktrooper' || this.type === 'scout') {
                    // Melee/flanker: circle and close, always want to be at ~60px
                    if (!canSee) {
                        // Overdrive orbit around wall
                        let tangent = new Vector2(-dir.y, dir.x).mult(this.strafeDir);
                        moveDir = tangent.mult(0.85).add(dir.mult(0.15)).normalize();
                        activeSpeed = this.speed * 2.2;
                    } else if (d > 120) {
                        // Rush in
                        moveDir = dir;
                    } else if (d < 60) {
                        // Too close - sidestep
                        moveDir = new Vector2(-dir.y, dir.x).mult(this.strafeDir);
                    } else {
                        // Strafing orbit at engagement range
                        moveDir = dir.mult(0.3).add(new Vector2(-dir.y, dir.x).mult(this.strafeDir * 0.9)).normalize();
                    }
                } else if (this.type === 'bounty') {
                    if (!canSee || d > 350) moveDir = dir;
                    else if (d < 220) moveDir = dir.mult(-1);
                    else moveDir = new Vector2(-dir.y, dir.x).mult(this.strafeDir * 0.8);
                } else if (this.type === 'stormtrooper') {
                    if (!canSee || d > 400) moveDir = dir;
                    else if (d < 280) moveDir = dir.mult(-1);
                    else moveDir = new Vector2(-dir.y, dir.x).mult(this.strafeDir * 0.5);
                }

                // ---- Separation (boids-style) ----
                let sep = new Vector2();
                for (let e of allEnemies) {
                    let dist = this.pos.dist(e.pos);
                    if (e !== this && dist < this.radius + e.radius + 12 && dist > 0.1) {
                        sep = sep.add(this.pos.sub(e.pos).normalize().mult(30 / dist));
                    }
                }

                // Ranged units: Overdrive orbit when blocked
                if (!canSee && (this.type === 'stormtrooper' || this.type === 'bounty')) {
                    let tangent = new Vector2(-dir.y, dir.x).mult(this.strafeDir);
                    moveDir = tangent.mult(0.85).add(dir.mult(0.15)).normalize();
                    activeSpeed = this.speed * 2.5;
                } else if (canSee && this.type === 'scout' && Math.random() < 0.03) {
                    sep = sep.add(new Vector2(-dir.y, dir.x).mult(120 * this.strafeDir));
                }

                // ---- Ranged units keep distance, Melee units close in ----
                if (d < 150 && (this.type === 'stormtrooper' || this.type === 'bounty')) {
                    moveDir = dir.mult(-1);
                    activeSpeed = this.speed;
                }

                this.vel = moveDir.mult(activeSpeed).add(sep.mult(80));

                // ---- Melee damage (Darktrooper/Scout contact) ----
                if ((this.type === 'darktrooper' || this.type === 'scout') && d < 50 && canSee) {
                    this.meleeTimer += dt;
                    if (this.meleeTimer >= (this.type === 'darktrooper' ? 0.8 : 0.5)) {
                        let dmg = (this.type === 'darktrooper' ? 22 : 10) * currentDifficulty.mult;
                        engine.scene.player.takeDamage(dmg);
                        engine.scene.spawnParticles(this.pos, '#ff3333', 8);
                        engine.camera.shake(5, 0.2);
                        this.meleeTimer = 0;
                    }
                } else { this.meleeTimer = 0; }

                // ---- Ranged attacks ----
                if (this.type === 'bounty' && canSee && d < 450) {
                    this.sniperTimer += dt;
                    if (this.sniperTimer >= 0.9) {
                        this.aimAngle = Math.atan2(playerPos.y - this.pos.y, playerPos.x - this.pos.x);
                        engine.scene.projectiles.push(new Projectile(this.pos.x, this.pos.y, new Vector2(Math.cos(this.aimAngle), Math.sin(this.aimAngle)), 900, '#ffaa00', false));
                        audio.shoot(); this.sniperTimer = 0;
                    }
                } else if (this.type === 'stormtrooper' && canSee && d < 500) {
                    this.sniperTimer += dt; this.aimAngle = Math.atan2(playerPos.y - this.pos.y, playerPos.x - this.pos.x);
                    if (this.sniperTimer >= 2.2) {
                        engine.scene.projectiles.push(new Projectile(this.pos.x, this.pos.y, new Vector2(Math.cos(this.aimAngle), Math.sin(this.aimAngle)), 1000, '#ff3333', false));
                        audio.shoot(); this.sniperTimer = 0;
                    }
                } else if (!canSee) { this.sniperTimer = 0; }

                this.vel.x += (Math.random() - 0.5) * 10;
                this.vel.y += (Math.random() - 0.5) * 10;
                super.update(dt);
                for (let w of walls) { resolveCircleAABB(this, w); }
            }

            draw(ctx) {
                if (this.type === 'stormtrooper' && this.sniperTimer > 0) {
                    ctx.beginPath(); ctx.moveTo(this.pos.x, this.pos.y); ctx.lineTo(this.pos.x + Math.cos(this.aimAngle) * 800, this.pos.y + Math.sin(this.aimAngle) * 800);
                    ctx.strokeStyle = `rgba(255, 50, 50, ${(this.sniperTimer) / 2.5 * 0.5})`; ctx.lineWidth = 1; ctx.stroke();
                }

                ctx.save(); ctx.translate(this.pos.x, this.pos.y);
                if (this.vel.x < 0) ctx.scale(-1, 1);

                ctx.beginPath(); ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fill();

                if (this.type === 'stormtrooper') {
                    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, -2, this.radius - 2, 0, Math.PI * 2); ctx.fill();
                    ctx.fillStyle = '#000'; ctx.fillRect(-8, -8, 16, 4);
                    ctx.beginPath(); ctx.moveTo(-6, 2); ctx.lineTo(0, 8); ctx.lineTo(6, 2); ctx.stroke();
                } else if (this.type === 'darktrooper') {
                    ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(0, -2, this.radius - 2, 0, Math.PI * 2); ctx.fill();
                    ctx.shadowColor = '#f00'; ctx.shadowBlur = 10; ctx.fillStyle = '#f00';
                    ctx.fillRect(-8, -6, 6, 3); ctx.fillRect(2, -6, 6, 3); ctx.shadowBlur = 0;
                    ctx.strokeStyle = '#555'; ctx.lineWidth = 2; ctx.strokeRect(-10, 2, 20, 6);
                } else if (this.type === 'scout') {
                    ctx.fillStyle = '#eee'; ctx.beginPath(); ctx.arc(0, 0, this.radius - 2, 0, Math.PI * 2); ctx.fill();
                    ctx.fillStyle = '#000'; ctx.fillRect(-10, -8, 20, 8);
                    ctx.fillStyle = '#fff'; ctx.fillRect(-12, -12, 24, 4);
                } else if (this.type === 'bounty') {
                    ctx.fillStyle = '#ffaa00'; ctx.beginPath(); ctx.arc(0, 0, this.radius, 0, Math.PI * 2); ctx.fill();
                    ctx.fillStyle = '#000'; ctx.fillRect(-4, -12, 8, 20); ctx.fillRect(-12, -4, 24, 6);
                }
                ctx.restore();

                if (this.hp < this.maxHp) { ctx.fillStyle = '#ff3333'; ctx.fillRect(this.pos.x - 15, this.pos.y - 25, 30 * (this.hp / this.maxHp), 4); }
            }
        }

        class Boss extends Entity {
            constructor(x, y, waveMult) {
                super(x, y, 40); this.hp = 1500 * waveMult * currentDifficulty.mult; this.maxHp = this.hp;
                this.color = '#ff3333'; this.phaseTimer = 0; this.aimAngle = 0; this.dashing = false;
            }
            update(dt, playerPos, walls) {
                let dir = playerPos.sub(this.pos).normalize();
                this.aimAngle = Math.atan2(playerPos.y - this.pos.y, playerPos.x - this.pos.x);
                if (!this.dashing) this.vel = dir.mult(80);

                this.phaseTimer += dt;
                if (this.phaseTimer > 4.0) {
                    if (Math.random() > 0.5) {
                        this.dashing = true; this.vel = dir.mult(1500); audio.dash(); audio.bossShoot();
                        engine.camera.shake(10, 0.4); this.phaseTimer = -0.5;
                    } else {
                        engine.scene.enemyStrikes.push({ pos: new Vector2(playerPos.x, playerPos.y), timer: 1.5 });
                        audio.orbitalCall();
                        this.phaseTimer = -1.0;
                    }
                }
                if (this.phaseTimer > 0 && this.phaseTimer < 0.1) this.dashing = false;
                super.update(dt);
                for (let w of walls) { resolveCircleAABB(this, w); }
            }
            draw(ctx) {
                ctx.save(); ctx.translate(this.pos.x, this.pos.y);
                ctx.beginPath(); ctx.arc(0, 0, this.radius, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0,0,0,0.8)'; ctx.fill(); ctx.strokeStyle = '#f00'; ctx.lineWidth = 3; ctx.stroke();

                ctx.fillStyle = '#111'; ctx.beginPath(); ctx.moveTo(-30, 20); ctx.lineTo(-70, 50); ctx.lineTo(-70, -50); ctx.lineTo(-30, -20); ctx.fill();
                ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(0, 0, this.radius - 4, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#f00'; ctx.fillRect(-10, -10, 20, 6);

                ctx.rotate(this.aimAngle);
                ctx.shadowColor = '#fff'; ctx.shadowBlur = 20; ctx.strokeStyle = '#000'; ctx.lineWidth = 8;
                ctx.beginPath(); ctx.moveTo(20, 15); ctx.lineTo(100, 15); ctx.stroke();
                ctx.shadowBlur = 0; ctx.strokeStyle = '#fff'; ctx.lineWidth = 4;
                ctx.beginPath(); ctx.moveTo(20, 15); ctx.lineTo(95, 15); ctx.stroke();
                ctx.restore();

                ctx.fillStyle = '#ff3333'; ctx.fillRect(this.pos.x - 50, this.pos.y - 60, 100 * (this.hp / this.maxHp), 8);
                ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.strokeRect(this.pos.x - 50, this.pos.y - 60, 100, 8);
            }
        }

        class Projectile extends Entity {
            constructor(x, y, dir, speed, color = '#ff0000', isPlayer = true, r = 4, pierce = false) {
                super(x, y, r); this.vel = dir.mult(speed); this.life = 1.5;
                this.angle = Math.atan2(dir.y, dir.x); this.color = color;
                this.isPlayer = isPlayer; this.isPierce = pierce; this.hits = new Set();
                this.hasBounced = false;
            }
            update(dt, walls) {
                super.update(dt); this.life -= dt; if (this.life <= 0) this.dead = true;
                if (!this.isPierce) {
                    for (let w of walls) {
                        if (this.pos.x > w.pos.x && this.pos.x < w.pos.x + w.w && this.pos.y > w.pos.y && this.pos.y < w.pos.y + w.h) {
                            if (this.isPlayer && engine.scene.perks.includes('RICOCHET') && !this.hasBounced) {
                                this.hasBounced = true;
                                let oX = Math.min(Math.abs(this.pos.x - w.pos.x), Math.abs(this.pos.x - (w.pos.x + w.w)));
                                let oY = Math.min(Math.abs(this.pos.y - w.pos.y), Math.abs(this.pos.y - (w.pos.y + w.h)));
                                if (oX < oY) this.vel.x *= -1; else this.vel.y *= -1;
                                this.angle = Math.atan2(this.vel.y, this.vel.x);
                            } else { this.dead = true; }
                            break;
                        }
                    }
                }
            }
            draw(ctx) {
                ctx.save(); ctx.translate(this.pos.x, this.pos.y); ctx.rotate(this.angle);
                ctx.fillStyle = '#fff'; ctx.shadowColor = this.color; ctx.shadowBlur = 15;
                ctx.fillRect(-this.radius * 4, -this.radius, this.radius * 8, this.radius * 2);
                ctx.restore();
            }
        }

        class BeskarIngot extends Entity {
            constructor(x, y, amt) { super(x, y, 10); this.amt = amt; this.life = 12.0; }
            update(dt) { this.life -= dt; if (this.life <= 0) this.dead = true; }
            draw(ctx) {
                if (this.life < 3 && Math.floor(Date.now() / 150) % 2 === 0) return; // blink when expiring
                let f = Math.sin(Date.now() * 0.01) * 5;
                ctx.save(); ctx.translate(this.pos.x, this.pos.y + f);
                ctx.fillStyle = '#a9b8c2'; ctx.shadowColor = '#fff'; ctx.shadowBlur = 10;
                ctx.fillRect(-8, -12, 16, 24); ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.strokeRect(-8, -12, 16, 24);
                ctx.restore();
            }
        }

        class WeaponDrop extends Entity {
            constructor(x, y, type) { super(x, y, 15); this.wtype = type; this.life = 10.0; }
            update(dt) { this.life -= dt; if (this.life <= 0) this.dead = true; }
            draw(ctx) {
                if (this.life < 3 && Math.floor(Date.now() / 150) % 2 === 0) return; // blink when expiring
                let f = Math.sin(Date.now() * 0.01) * 5;
                ctx.save(); ctx.translate(this.pos.x, this.pos.y + f);
                ctx.fillStyle = this.wtype === 'sniper' ? '#00aaff' : this.wtype === 'heavy' ? '#ffaa00' : '#00ffaa';
                ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 20;
                ctx.fillRect(-15, -10, 30, 20);
                ctx.fillStyle = '#fff'; ctx.font = '12px Oswald'; ctx.textAlign = 'center'; ctx.fillText('GUN', 0, 5);
                ctx.restore();
            }
        }

        class BactaStim extends Entity {
            constructor(x, y) { super(x, y, 12); this.life = 12.0; }
            update(dt) { this.life -= dt; if (this.life <= 0) this.dead = true; }
            draw(ctx) {
                if (this.life < 3 && Math.floor(Date.now() / 150) % 2 === 0) return; // blink when expiring
                let f = Math.sin(Date.now() * 0.01) * 5;
                ctx.save(); ctx.translate(this.pos.x, this.pos.y + f);
                ctx.fillStyle = '#fff'; ctx.shadowColor = '#00ffaa'; ctx.shadowBlur = 15;
                ctx.fillRect(-8, -8, 16, 16); ctx.fillStyle = '#00ffaa';
                ctx.fillRect(-2, -6, 4, 12); ctx.fillRect(-6, -2, 12, 4);
                ctx.strokeStyle = '#00ffaa'; ctx.lineWidth = 1; ctx.strokeRect(-8, -8, 16, 16);
                ctx.restore();
            }
        }

        class FloatingText extends Entity {
            constructor(x, y, text, color) { super(x, y, 0); this.text = text; this.color = color; this.life = 1.0; this.vel = new Vector2(0, -50); }
            update(dt) { super.update(dt); this.life -= dt * 1.5; if (this.life <= 0) this.dead = true; }
            draw(ctx) {
                ctx.globalAlpha = Math.max(0, this.life); ctx.fillStyle = this.color;
                ctx.font = 'bold 24px Oswald'; ctx.textAlign = 'center'; ctx.shadowColor = '#000'; ctx.shadowBlur = 4;
                ctx.fillText(this.text, this.pos.x, this.pos.y); ctx.globalAlpha = 1.0; ctx.shadowBlur = 0;
            }
        }

        class Particle extends Entity {
            constructor(x, y, color, speed, size = 1) {
                super(x, y, MathUtils.randomRange(2 * size, 5 * size));
                let ang = Math.random() * Math.PI * 2; this.vel = new Vector2(Math.cos(ang), Math.sin(ang)).mult(speed);
                this.color = color; this.maxLife = MathUtils.randomRange(0.2, 0.5); this.life = this.maxLife;
            }
            update(dt) { super.update(dt); this.vel.x *= 0.88; this.vel.y *= 0.88; this.life -= dt; if (this.life <= 0) this.dead = true; }
            draw(ctx) { ctx.globalAlpha = Math.max(0, Math.min(1.0, this.life / this.maxLife)); ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1.0; }
        }

        // ==========================================
        // SCENE: EXTRACT
        // ==========================================
        class ExtractionMode {
            constructor() {
                this.player = new Player(); this.grogu = new Grogu(this.player);
                this.enemies = []; this.projectiles = []; this.particles = []; this.texts = [];
                this.loot = []; this.boss = null; this.walls = [];
                this.enemyStrikes = [];

                for (let i = 0; i < 30; i++) {
                    let wx = MathUtils.randomRange(-2500, 2500); let wy = MathUtils.randomRange(-2500, 2500);
                    if (Math.abs(wx) < 500 && Math.abs(wy) < 500) continue;
                    let isVert = Math.random() > 0.5;
                    this.walls.push(new Wall(wx, wy, isVert ? MathUtils.randomRange(40, 100) : MathUtils.randomRange(200, 600), isVert ? MathUtils.randomRange(200, 600) : MathUtils.randomRange(40, 100)));
                }

                // ARENA BOUNDARIES
                let arenaSize = 3000; let thick = 500;
                this.walls.push(new Wall(-arenaSize, -arenaSize, arenaSize * 2, thick)); // Top
                this.walls.push(new Wall(-arenaSize, arenaSize - thick, arenaSize * 2, thick)); // Bottom
                this.walls.push(new Wall(-arenaSize, -arenaSize, thick, arenaSize * 2)); // Left
                this.walls.push(new Wall(arenaSize - thick, -arenaSize, thick, arenaSize * 2)); // Right

                this.wave = 1; this.waveKills = 0; this.killsNeeded = 30;
                this.beskarCollected = 0; this.combo = 1.0; this.comboTimer = 0;
                this.extractionPos = null; this.extractionTimer = -1; this.bountySpawned = false;
                this.killStreak = 0; this.streakTimer = 0;
                this.eventTimer = 0; this.groguVision = 0; this.bountyBonus = 1.0;

                this.perks = []; this.runXp = 0; this.xpNeeded = 5; this.level = 1;

                this.lastShot = 0; this.spawnTimer = 0;
                this.stratagemReady = true; this.stratagemCooldown = 0; this.stratagemMarker = null;
                this.state = 'playing'; this.timeScale = 1.0;

                this.storyQueue = []; this.storyActive = false;

                // Randomised mission briefing each run
                const briefings = [
                    ["GREEF KARGA", "Mando, the Imperial Remnant is swarming that sector. Get the Beskar and get out.",
                        "THE MANDALORIAN", "I'm not leaving without what they owe me."],
                    ["FENNEC SHAND", "Heavy Imperial presence confirmed at your coordinates, Mandalorian. This won't be clean.",
                        "THE MANDALORIAN", "It never is."],
                    ["THE ARMORER", "You have been called to serve, Mandalorian. The Creed demands this. This is the Way.",
                        "THE MANDALORIAN", "This is the Way."],
                    ["BO-KATAN KRYZE", "The Empire moves on Mandalorian people. Every remnant you eliminate weakens Gideon's grip.",
                        "THE MANDALORIAN", "Then I'll eliminate all of them."],
                    ["KUIIL", "I have reprogrammed the sector map. The Imperials do not know you are coming. Use that.",
                        "THE MANDALORIAN", "Good. Element of surprise is all I need."],
                ];
                let b = briefings[Math.floor(Math.random() * briefings.length)];
                this.queueStory(b[0], b[1]);
                this.queueStory(b[2], b[3]);
                this.updateHUD();
                this.showWaveIntro(1);
            }

            queueStory(speaker, text) { this.storyQueue.push({ speaker, text }); this.playNextStory(); }

            playNextStory() {
                if (this.storyActive || this.storyQueue.length === 0) return;
                this.storyActive = true; let s = this.storyQueue.shift();
                let box = document.getElementById('story-box'); let spk = document.getElementById('story-speaker'); let txt = document.getElementById('story-text');
                box.style.display = 'block'; setTimeout(() => box.style.opacity = '1', 50);
                spk.innerText = s.speaker + ":"; spk.className = (s.speaker === 'MOFF GIDEON') ? 'story-speaker enemy' : 'story-speaker';
                txt.innerText = ""; let i = 0;
                let intv = setInterval(() => {
                    txt.innerText += s.text.charAt(i); i++;
                    if (i >= s.text.length) {
                        clearInterval(intv);
                        setTimeout(() => { box.style.opacity = '0'; setTimeout(() => { box.style.display = 'none'; this.storyActive = false; this.playNextStory(); }, 500); }, 3500);
                    }
                }, 30);
            }

            spawnParticles(pos, color, amt, size = 1) { for (let i = 0; i < amt; i++) this.particles.push(new Particle(pos.x, pos.y, color, MathUtils.randomRange(50, 400), size)); }
            spawnLootPing(pos) {
                let screenX = pos.x - engine.camera.pos.x + window.innerWidth / 2;
                let screenY = pos.y - engine.camera.pos.y + window.innerHeight / 2;
                let ping = document.createElement('div');
                ping.className = 'loot-ping';
                ping.style.left = `${screenX}px`;
                ping.style.top = `${screenY}px`;
                document.getElementById('game-container').appendChild(ping);
                setTimeout(() => ping.remove(), 500);
            }
            showWaveIntro(wNum) {
                let el = document.getElementById('wave-intro');
                let txt = document.getElementById('wave-intro-text');
                let sub = document.getElementById('wave-intro-sub');
                if (!el || !txt || !sub) return;

                let subtitle = "IMPERIAL SECTOR PURGE";
                if (wNum === 2) subtitle = "SCOUT RECON ASSAULT";
                else if (wNum === 3) subtitle = "DARK TROOPER SECTOR DEPLOYMENT";
                else if (wNum === 4) subtitle = "ELITE COMMAND SQUADRON INCOMING";
                else if (wNum >= 5) subtitle = "MAXIMUM COMBAT CLASSIFICATION ESCALATION";

                txt.innerText = `WAVE ${wNum}`;
                sub.innerText = subtitle;

                el.classList.add('show');
                this.timeScale = 0.05; // visceral time dilation!
                audio.alarm();

                setTimeout(() => {
                    if (el) el.classList.remove('show');
                }, 1800);
            }

            triggerLevelUp() {
                this.runXp -= this.xpNeeded; this.level++;
                this.xpNeeded = Math.floor(this.xpNeeded * 1.5) + 5;
                this.state = 'levelup'; audio.powerup();

                let pool = AVAILABLE_PERKS.filter(p => !this.perks.includes(p.id));
                if (pool.length < 3) {
                    pool = pool.concat([
                        { id: 'STAT_DMG', name: 'WEAPON CALIBRATION', desc: '+15% Raw Damage', icon: 'fa-solid fa-crosshairs' },
                        { id: 'STAT_HP', name: 'BESKAR REINFORCEMENT', desc: '+25 Max HP & Full Heal', icon: 'fa-solid fa-shield-heart' },
                        { id: 'STAT_SPEED', name: 'SERVO OVERDRIVE', desc: '+10% Movement Speed', icon: 'fa-solid fa-gauge-high' }
                    ]);
                }
                let shuffled = pool.sort(() => 0.5 - Math.random());
                let offered = shuffled.slice(0, 3);

                let html = '';
                for (let p of offered) {
                    html += `<div class="perk-card" onclick="engine.scene.selectPerk('${p.id}')">
                <i class="${p.icon || 'fa-solid fa-bolt'}" style="font-size:32px; color:#fff; margin-bottom:10px;"></i>
                <h3>${p.name}</h3><p>${p.desc}</p>
            </div>`;
                }
                document.getElementById('perk-container').innerHTML = html;
                document.getElementById('levelup-screen').style.display = 'flex';
            }

            selectPerk(id) {
                if (id === 'STAT_DMG') this.player.dmgMultiplier += 0.15;
                else if (id === 'STAT_HP') { this.player.maxHp += 25; this.player.hp = this.player.maxHp; }
                else if (id === 'STAT_SPEED') { this.player.maxSpeed *= 1.1; }
                else { this.perks.push(id); if (id === 'SPEED') this.player.maxSpeed *= 1.25; }

                document.getElementById('levelup-screen').style.display = 'none';
                this.state = 'playing'; audio.heal();
            }

            updateHUD() {
                let p = this.player;

                // Wave bar
                if (this.extractionPos) {
                    document.getElementById('wave-text').innerText = "DEFEND THE LZ";
                    document.getElementById('wave-sub').innerText = this.extractionTimer > 0 ? `${this.extractionTimer.toFixed(1)}s REMAINING` : "PROCEED TO EXTRACTION";
                    document.getElementById('wave-bar-fill').style.width = this.extractionTimer > 0 ? `${Math.max(0, (this.extractionTimer / 20)) * 100}%` : '0%';
                } else {
                    document.getElementById('wave-text').innerText = this.boss ? "BOSS ENCOUNTER" : `WAVE ${this.wave}`;
                    document.getElementById('wave-sub').innerText = this.boss ? "Eliminate Moff Gideon" : `Defeat ${this.killsNeeded - this.waveKills} Remnants`;
                    document.getElementById('wave-bar-fill').style.width = `${Math.min(100, (this.waveKills / this.killsNeeded) * 100)}%`;
                }

                // Health
                document.getElementById('health-ui').innerText = `${Math.max(0, Math.floor(p.hp))}`;
                document.getElementById('health-ui').style.color = p.hp < p.maxHp * 0.3 ? "#ff3333" : p.hp < p.maxHp * 0.6 ? "#ffaa00" : "#00ff88";
                document.getElementById('overshield-ui').style.display = p.overshield > 0 ? "inline" : "none";

                // Beskar / Combo / XP
                document.getElementById('run-beskar-ui').innerText = this.beskarCollected;
                document.getElementById('combo-ui').innerText = `x${this.combo.toFixed(1)}`;
                document.getElementById('combo-ui').style.color = this.combo >= 5.0 ? '#ff3333' : '#ffaa00';
                document.getElementById('xp-bar-fill').style.width = `${Math.min(100, (this.runXp / this.xpNeeded) * 100)}%`;

                // Heat
                document.getElementById('heat-bar-fill').style.width = `${p.heat}%`;
                document.getElementById('heat-bar-fill').style.background = p.overheated ? "#fff" : "#ff3333";

                // Dash charges
                let dStr = ""; for (let i = 0; i < 3; i++) { dStr += (i < p.dashes) ? "■ " : "□ "; }
                document.getElementById('dash-charges-ui').innerText = `[${dStr.trim()}]`;
                document.getElementById('dash-charges-ui').style.color = p.dashes > 0 ? "#00aaff" : "#ff3333";

                // Grogu barrier
                document.getElementById('force-ready-ui').innerText = p.forceCooldown <= 0 ? "READY" : Math.ceil(p.forceCooldown) + "s";
                document.getElementById('force-ready-ui').style.color = p.forceCooldown <= 0 ? "#00eeff" : "#555";

                // Permanent weapon slots
                let blasterEl = document.getElementById('slot-blaster-ui');
                let dartEl = document.getElementById('slot-dart-ui');
                let flamerEl = document.getElementById('slot-flamer-ui');
                if (blasterEl) blasterEl.style.color = p.activeSlot === 0 ? '#00aaff' : '#444';
                if (dartEl) {
                    let dart = p.slots[1];
                    dartEl.style.color = p.activeSlot === 1 ? '#00ffaa' : dart.cd > 0 ? '#555' : '#00ffaa';
                    document.getElementById('dart-cd-ui').innerText = dart.cd > 0 ? Math.ceil(dart.cd) + 's' : 'READY';
                }
                if (flamerEl) {
                    let fl = p.slots[2];
                    flamerEl.style.color = p.activeSlot === 2 ? '#ff7700' : fl.cd > 0 ? '#555' : '#ff7700';
                    document.getElementById('flamer-cd-ui').innerText = fl.cd > 0 ? Math.ceil(fl.cd) + 's' : 'READY';
                }
                // Acquired pickup slots
                let sl4 = p.slots[3]; let sl5 = p.slots[4];
                let el4 = document.getElementById('acq-slot4-ui');
                let el5 = document.getElementById('acq-slot5-ui');
                if (el4) { el4.innerHTML = sl4.type ? `<span>[4] ${sl4.label}</span><span style="color:#ffaa00">${sl4.ammo}</span>` : '<span>[4] --</span><span></span>'; el4.style.color = p.activeSlot === 3 ? '#ffaa00' : '#555'; }
                if (el5) { el5.innerHTML = sl5.type ? `<span>[5] ${sl5.label}</span><span style="color:#ffaa00">${sl5.ammo}</span>` : '<span>[5] --</span><span></span>'; el5.style.color = p.activeSlot === 4 ? '#ffaa00' : '#555'; }
            }

            update(oldDt) {
                if (this.state !== 'playing') return;

                // Near-death physiological heartbeat sync
                if (this.player.hp < this.player.maxHp * 0.25) {
                    this.heartbeatTimer = (this.heartbeatTimer || 0) + oldDt;
                    if (this.heartbeatTimer >= 0.85) {
                        this.heartbeatTimer = 0;
                        audio.heartbeat();
                        engine.camera.shake(6, 0.18);
                    }
                    document.querySelector('.vignette').classList.add('heartbeat');
                } else {
                    document.querySelector('.vignette').classList.remove('heartbeat');
                }

                // Ethereal Force vision vignette glow
                if (this.groguVision > 0) {
                    document.querySelector('.vignette').classList.add('grogu-active');
                } else {
                    document.querySelector('.vignette').classList.remove('grogu-active');
                }

                // Dynamic visual temperature grading - escalation saturation & contrast
                let targetContrast = 1.12 + (this.wave * 0.015) + (this.combo * 0.04);
                let targetSaturate = 1.20 + (this.wave * 0.02) + (this.combo * 0.06);
                let targetHue = Math.min(25, this.combo * 3.0);
                engine.canvas.style.filter = `contrast(${targetContrast.toFixed(2)}) saturate(${targetSaturate.toFixed(2)}) hue-rotate(${targetHue.toFixed(1)}deg)`;

                this.timeScale = Math.min(1.0, this.timeScale + oldDt * 2.0);
                let dt = oldDt * this.timeScale;

                if (this.comboTimer > 0) { this.comboTimer -= dt; if (this.comboTimer <= 0) this.combo = 1.0; }

                // Kill Streak decay
                if (this.streakTimer > 0) { this.streakTimer -= dt; if (this.streakTimer <= 0) this.killStreak = 0; }

                // Wanted Level (displayed as floating text milestone)
                let wantedLevel = Math.min(5, Math.floor(save.totalKills / 20));

                // Low HP danger warning
                if (this.player.hp < this.player.maxHp * 0.2 && Math.random() < 0.005) {
                    let dangerLines = [
                        "ARMOR CRITICAL — FIND BACTA!",
                        "MANDO! Get to cover!",
                        "Grogu senses danger... MOVE!"
                    ];
                    this.texts.push(new FloatingText(this.player.pos.x, this.player.pos.y - 80, dangerLines[Math.floor(Math.random() * dangerLines.length)], '#ff3333'));
                }

                let mx = engine.camera.pos.x + input.mouse.x - window.innerWidth / 2;
                let my = engine.camera.pos.y + input.mouse.y - window.innerHeight / 2;
                let mouseWorld = new Vector2(mx, my);

                this.player.angle = Math.atan2(mouseWorld.y - this.player.pos.y, mouseWorld.x - this.player.pos.x);
                this.player.update(dt, this.walls);
                this.grogu.update(dt);

                // Manual Extraction (E)
                if (input.isPressed('e') && !this.extractionPos && this.waveKills > 0) {
                    this.queueStory("GREEF KARGA", "Copy that Mando. Razor Crest is inbound. Defend the LZ!");
                    this.openExtraction();
                }

                // Random mid-run event every ~45 seconds
                this.eventTimer = (this.eventTimer || 0) + dt;
                if (this.eventTimer > 45 + Math.random() * 20 && !this.extractionPos) {
                    this.eventTimer = 0;
                    let events = [
                        () => {
                            // Supply Drop - Bacta + Beskar rains from sky
                            let ex = this.player.pos.x + MathUtils.randomRange(-300, 300);
                            let ey = this.player.pos.y + MathUtils.randomRange(-300, 300);
                            for (let i = 0; i < 5; i++) this.loot.push(new BeskarIngot(ex + MathUtils.randomRange(-60, 60), ey + MathUtils.randomRange(-60, 60), 8));
                            for (let i = 0; i < 2; i++) this.loot.push(new BactaStim(ex + MathUtils.randomRange(-40, 40), ey + MathUtils.randomRange(-40, 40)));
                            this.texts.push(new FloatingText(ex, ey - 80, '\u2605 SUPPLY DROP INCOMING', '#00aaff'));
                            this.queueStory('GREEF KARGA', 'I dropped some supplies near your position. Don\'t let the Imps get them!');
                        },
                        () => {
                            // Arms Cache - random weapon drop
                            let wtypes = ['heavy', 'sniper', 'thermal'];
                            let wt = wtypes[Math.floor(Math.random() * wtypes.length)];
                            let ex = this.player.pos.x + MathUtils.randomRange(-200, 200);
                            let ey = this.player.pos.y + MathUtils.randomRange(-200, 200);
                            this.loot.push(new WeaponDrop(ex, ey, wt));
                            this.texts.push(new FloatingText(ex, ey - 60, '\u25a0 ARMS CACHE', '#ffaa00'));
                            this.queueStory('FENNEC SHAND', 'Found you a little gift from the Guild\'s armory. Make it count.');
                        },
                        () => {
                            // Grogu Vision - briefly reveals all enemies
                            this.texts.push(new FloatingText(this.player.pos.x, this.player.pos.y - 100, '\u25c9 GROGU SENSES DANGER', '#00ffaa'));
                            this.groguVision = 4.0; // seconds
                            this.queueStory('THE CHILD', '...(Grogu closes his eyes and reaches out with the Force)');
                            audio.heal();
                        },
                        () => {
                            // Bounty Intel - next bounty worth 3x
                            this.bountyBonus = 3.0;
                            this.texts.push(new FloatingText(this.player.pos.x, this.player.pos.y - 100, '\u25c6 BOUNTY INTEL RECEIVED', '#ffaa00'));
                            this.queueStory('GREEF KARGA', 'New bounty sheet incoming. High-value targets are marked. Triple pay!');
                        }
                    ];
                    events[Math.floor(Math.random() * events.length)]();
                }

                // Grogu Vision timer
                if (this.groguVision > 0) this.groguVision -= dt;

                // Grogu Shield (Space)
                if ((input.isPressed(' ') || input.isPressed('space')) && this.player.forceCooldown <= 0) {
                    this.player.forceCooldown = 25; this.player.forceShield = 5.0;
                    audio.heal(); engine.camera.shake(15, 0.5);
                    this.spawnParticles(this.player.pos, '#00ffaa', 50, 3);
                    for (let e of this.enemies) { if (e.pos.dist(this.player.pos) < 400) { e.vel = e.pos.sub(this.player.pos).normalize().mult(2000); } }
                }

                let wType = this.player.getActiveWeapon();
                let fireRate = wType === 'heavy' ? 70 : wType === 'sniper' ? 600 : wType === 'thermal' ? 1000 : wType === 'dart' ? 80 : wType === 'flamer' ? 50 : 140;
                if (this.perks.includes('OVERCLOCK')) fireRate *= 0.75;

                if ((input.isMouseDown || input.justClicked) && Date.now() - this.lastShot > fireRate && !this.player.isDashing && !this.player.overheated) {
                    let dir = mouseWorld.sub(this.player.pos).normalize();
                    let aSlot = this.player.activeSlot;
                    let fired = false;

                    if (wType === 'blaster') {
                        if (this.perks.includes('DOUBLE')) {
                            let t = new Vector2(-dir.y, dir.x).mult(8);
                            this.projectiles.push(new Projectile(this.player.pos.x + dir.x * 20 + t.x, this.player.pos.y + dir.y * 20 + t.y, dir, 2200, '#00aaff', true));
                            this.projectiles.push(new Projectile(this.player.pos.x + dir.x * 20 - t.x, this.player.pos.y + dir.y * 20 - t.y, dir, 2200, '#00aaff', true));
                        } else {
                            this.projectiles.push(new Projectile(this.player.pos.x + dir.x * 20, this.player.pos.y + dir.y * 20, dir, 2200, '#00aaff', true));
                        }
                        this.player.heat += 8; audio.shoot(); fired = true;
                    } else if (wType === 'dart') {
                        // Fast light dart burst - 3 rapid bolts
                        for (let i = 0; i < 3; i++) setTimeout(() => {
                            if (!this.player || this.state !== 'playing') return;
                            let sp = dir.add(new Vector2(MathUtils.randomRange(-0.05, 0.05), MathUtils.randomRange(-0.05, 0.05))).normalize();
                            this.projectiles.push(new Projectile(this.player.pos.x, this.player.pos.y, sp, 3000, '#00ffaa', true, 5));
                        }, i * 60);
                        this.player.heat += 2; audio.shoot(); fired = true;
                        this.player.slots[1].cd = this.player.slots[1].maxCd; // start cooldown
                        this.player.switchToSlot(0); // return to blaster
                    } else if (wType === 'flamer') {
                        // Wrist flamer - cone of slow fireballs
                        for (let i = 0; i < 8; i++) {
                            let a = this.player.angle + MathUtils.randomRange(-0.4, 0.4);
                            let fd = new Vector2(Math.cos(a), Math.sin(a));
                            let fp = new Projectile(this.player.pos.x + dir.x * 20, this.player.pos.y + dir.y * 20, fd, MathUtils.randomRange(400, 800), '#ff7700', true, 8);
                            fp.life = 0.6; this.projectiles.push(fp);
                        }
                        engine.camera.shake(8, 0.2); audio.shoot(); fired = true;
                        this.player.slots[2].cd = this.player.slots[2].maxCd;
                        this.player.switchToSlot(0);
                    } else if (wType === 'heavy') {
                        for (let i = 0; i < 3; i++) {
                            let spread = dir.add(new Vector2(MathUtils.randomRange(-0.2, 0.2), MathUtils.randomRange(-0.2, 0.2))).normalize();
                            this.projectiles.push(new Projectile(this.player.pos.x, this.player.pos.y, spread, 1800, '#ffaa00', true));
                        }
                        this.player.heat += 12; audio.shoot(); fired = true;
                    } else if (wType === 'sniper') {
                        this.projectiles.push(new Projectile(this.player.pos.x, this.player.pos.y, dir, 4000, '#00aaff', true, 8, true));
                        this.player.heat += 20; audio.orbitalStrike(); fired = true;
                    } else if (wType === 'thermal') {
                        this.projectiles.push(new Projectile(this.player.pos.x, this.player.pos.y, dir, 600, '#ff5500', true, 10, false));
                        this.player.heat += 5; audio.shoot(); fired = true;
                    }

                    if (fired) {
                        if (aSlot >= 3) {
                            this.player.slots[aSlot].ammo--;
                            this.player.weaponAmmo = this.player.slots[aSlot].ammo;
                            if (this.player.slots[aSlot].ammo <= 0) {
                                this.player.slots[aSlot] = { type: null, ammo: 0, cd: 0, maxCd: 0, label: '--' };
                                this.player.switchToSlot(0);
                                this.texts.push(new FloatingText(this.player.pos.x, this.player.pos.y - 60, 'OUT OF AMMO', '#ff3333'));
                            }
                        }
                        let recoilAmt = wType === 'sniper' ? -1200 : wType === 'heavy' ? -700 : wType === 'flamer' ? -400 : wType === 'thermal' ? -300 : -500;
                        this.player.recoil = dir.mult(recoilAmt);
                        engine.camera.shake(wType === 'sniper' ? 15 : wType === 'heavy' ? 8 : wType === 'flamer' ? 6 : 4, 0.1);
                        this.lastShot = Date.now();
                        input.justClicked = false;
                    }
                }

                if (input.isPressed('q') && this.stratagemReady) {
                    this.stratagemReady = false; this.stratagemCooldown = 15;
                    this.stratagemMarker = { pos: mouseWorld, timer: 1.0 };
                    audio.orbitalCall();
                    document.getElementById('stratagem-ready').innerText = "LOCKING"; document.getElementById('stratagem-ready').style.color = "#ff3333";
                }
                if (!this.stratagemReady) {
                    this.stratagemCooldown -= oldDt;
                    if (this.stratagemCooldown <= 0) {
                        this.stratagemReady = true;
                        document.getElementById('stratagem-ready').innerText = "READY"; document.getElementById('stratagem-ready').style.color = "#ffaa00";
                    } else { document.getElementById('stratagem-ready').innerText = Math.ceil(this.stratagemCooldown) + "s"; }
                }
                if (this.stratagemMarker) {
                    this.stratagemMarker.timer -= oldDt;
                    if (this.stratagemMarker.timer <= 0) {
                        engine.camera.shake(30, 0.8); this.spawnParticles(this.stratagemMarker.pos, '#ff5500', 300, 3);
                        for (let e of this.enemies) { if (e.pos.dist(this.stratagemMarker.pos) < 500) { e.hp -= 200 * this.player.dmgMultiplier; } }
                        if (this.boss && this.boss.pos.dist(this.stratagemMarker.pos) < 600) { this.boss.hp -= 300 * this.player.dmgMultiplier; }
                        this.stratagemMarker = null; this.timeScale = 0.2;
                    }
                }

                for (let i = this.enemyStrikes.length - 1; i >= 0; i--) {
                    let s = this.enemyStrikes[i];
                    s.timer -= oldDt;
                    if (s.timer <= 0) {
                        engine.camera.shake(25, 0.5); audio.orbitalStrike();
                        this.spawnParticles(s.pos, '#ff3333', 100, 4);
                        if (this.player.pos.dist(s.pos) < 300 && this.player.forceShield <= 0) {
                            this.player.hp -= 60 * currentDifficulty.mult;
                        }
                        this.enemyStrikes.splice(i, 1);
                    }
                }

                this.spawnTimer -= dt;
                if (this.spawnTimer <= 0 && !this.boss && (!this.extractionPos || this.extractionTimer > 0)) {
                    let mult = 1 + (this.wave * 0.1);
                    let squads = Math.min(3, 1 + Math.floor(this.wave / 3)); // 1 to 3 squads based on wave
                    for (let s = 0; s < squads; s++) {
                        let ang = Math.random() * Math.PI * 2; let dist = window.innerWidth * 0.8;
                        let sx = this.player.pos.x + Math.cos(ang) * dist; let sy = this.player.pos.y + Math.sin(ang) * dist;
                        let count = Math.min(6, 2 + Math.floor(this.wave / 2)); // 2 to 6 enemies per squad
                        for (let i = 0; i < count; i++) {
                            let r = Math.random();
                            let type = 'stormtrooper';
                            if (this.wave >= 2 && r > 0.6) type = 'scout';
                            if (this.wave >= 3 && r < 0.2) type = 'darktrooper';
                            this.enemies.push(new Enemy(sx + MathUtils.randomRange(-50, 50), sy + MathUtils.randomRange(-50, 50), type, mult));
                        }
                    }
                    this.spawnTimer = Math.max(2.0, 5.0 - (this.wave * 0.2));
                }

                if (this.wave % 5 === 0 && this.waveKills === 0 && !this.boss && !this.bountySpawned && !this.extractionPos) {
                    this.bountySpawned = true;
                    this.enemies.push(new Enemy(this.player.pos.x, this.player.pos.y - 1000, 'bounty', 1 + (this.wave * 0.15)));
                    this.queueStory("GREEF KARGA", "High Value Target detected. Eliminate them for a massive Beskar payout!");
                    audio.alarm();
                }

                for (let p of this.projectiles) p.update(dt, this.walls);
                for (let t of this.texts) t.update(dt);

                for (let l of this.loot) {
                    l.update(dt);
                    if (l.pos.dist(this.player.pos) < (l instanceof WeaponDrop ? 50 : 40)) {
                        l.dead = true;
                        this.spawnLootPing(l.pos);
                        if (l instanceof BeskarIngot) {
                            audio.beskar();
                            this.beskarCollected += l.amt; this.runXp += l.amt;
                            this.texts.push(new FloatingText(l.pos.x, l.pos.y - 20, `+${l.amt} BESKAR`, '#a9b8c2'));
                            if (this.runXp >= this.xpNeeded) this.triggerLevelUp();
                        } else if (l instanceof WeaponDrop) {
                            audio.powerup();
                            let ammo = l.wtype === 'heavy' ? 80 : l.wtype === 'sniper' ? 15 : l.wtype === 'thermal' ? 8 : 40;
                            this.player.acquireWeapon(l.wtype, ammo);
                            let names = { heavy: 'HEAVY REPEATER', sniper: 'AMBAN SNIPER', thermal: 'THERMAL DET.' };
                            this.texts.push(new FloatingText(l.pos.x, l.pos.y - 30, `PICKED UP ${names[l.wtype] || l.wtype.toUpperCase()}`, '#ffaa00'));
                        } else if (l instanceof BactaStim) {
                            audio.heal();
                            this.player.hp = Math.min(this.player.maxHp, this.player.hp + 25);
                            this.texts.push(new FloatingText(l.pos.x, l.pos.y - 30, '+25 HP', '#00ffaa'));
                        }
                    }
                }

                for (let e of this.enemies) {
                    e.update(dt, this.player.pos, this.enemies, this.walls);
                    for (let p of this.projectiles) {
                        if (!p.dead && p.isPlayer && p.pos.dist(e.pos) < e.radius + p.radius) {
                            if (!p.isPierce) p.dead = true;
                            else if (p.hits.has(e)) continue; p.hits.add(e);

                            // Use active weapon for damage — fixes stale this.player.weapon bug
                            let aw = this.player.getActiveWeapon();
                            let dmg = (aw === 'sniper' ? 90 : aw === 'heavy' ? 18 : aw === 'dart' ? 12 : aw === 'flamer' ? 10 : 20) * this.player.dmgMultiplier;
                            e.hp -= dmg; audio.hit(); this.spawnParticles(p.pos, p.color, 8);
                            this.texts.push(new FloatingText(e.pos.x, e.pos.y, Math.floor(dmg), '#fff'));

                            // PRECISION KILL bonus — reward long-range kills
                            let killDist = p.pos.dist(this.player.pos);
                            if (killDist > 400 && e.hp <= 0) {
                                let precBonus = Math.floor(killDist / 80);
                                this.beskarCollected += precBonus;
                                this.texts.push(new FloatingText(e.pos.x, e.pos.y - 30, `PRECISION +${precBonus}`, '#00ffaa'));
                            }

                            if (this.perks.includes('EXPLOSIVE')) {
                                this.spawnParticles(e.pos, '#ff5500', 15, 2);
                                for (let other of this.enemies) {
                                    if (other !== e && other.pos.dist(e.pos) < 100) {
                                        other.hp -= dmg * 0.5;
                                        this.texts.push(new FloatingText(other.pos.x, other.pos.y, Math.floor(dmg * 0.5), '#ff5500'));
                                    }
                                }
                            }
                        }
                    }
                    if (e.hp <= 0) {
                        e.dead = true; this.waveKills++;
                        this.spawnParticles(e.pos, e.color, settings.particles === 'high' ? 25 : 10); audio.kill();
                        save.totalKills = (save.totalKills || 0) + 1;
                        this.combo = Math.min(5.0, this.combo + 0.1); this.comboTimer = 4.0;

                        // Kill Streak bonus
                        this.killStreak = (this.killStreak || 0) + 1;
                        this.streakTimer = 3.5;
                        if (this.killStreak === 5) this.texts.push(new FloatingText(e.pos.x, e.pos.y - 60, '★ KILLING SPREE!', '#ffaa00'));
                        if (this.killStreak === 10) this.texts.push(new FloatingText(e.pos.x, e.pos.y - 60, '★★ RAMPAGE!', '#ff5500'));
                        if (this.killStreak === 20) this.texts.push(new FloatingText(e.pos.x, e.pos.y - 60, '★★★ THIS IS THE WAY', '#00ffaa'));
                        // Signet of Mandalore: 5x combo kill bonus
                        if (this.combo >= 5.0) {
                            let bonus = Math.floor(3 * currentDifficulty.beskar);
                            this.beskarCollected += bonus;
                            if (Math.random() < 0.2) this.texts.push(new FloatingText(e.pos.x, e.pos.y - 80, `SIGNET +${bonus}`, '#a9b8c2'));
                        }

                        let base = (e.type == 'bounty' ? 20 : e.type == 'darktrooper' ? 5 : 1) * currentDifficulty.beskar;
                        let dropAmt = Math.max(1, Math.floor(base * this.combo));

                        if (Math.random() < (e.type == 'bounty' ? 1.0 : 0.2)) {
                            let amt = Math.max(1, Math.floor(dropAmt * (e.type === 'bounty' ? (this.bountyBonus || 1.0) : 1.0)));
                            this.loot.push(new BeskarIngot(e.pos.x, e.pos.y, amt));
                            if (e.type === 'bounty') this.bountyBonus = 1.0; // reset after use
                        }

                        // Weapon Drops
                        if (Math.random() < (e.type == 'bounty' ? 0.8 : e.type == 'darktrooper' ? 0.08 : 0.01)) {
                            let wtypes = ['heavy', 'sniper', 'thermal'];
                            let wt = wtypes[Math.floor(Math.random() * wtypes.length)];
                            this.loot.push(new WeaponDrop(e.pos.x + 20, e.pos.y, wt));
                        }

                        // Bacta Drops (Aggressive Healing)
                        if (Math.random() < (e.type == 'bounty' ? 1.0 : e.type == 'darktrooper' ? 0.2 : 0.05)) {
                            this.loot.push(new BactaStim(e.pos.x - 20, e.pos.y));
                        }

                        if (this.perks.includes('VAMPIRISM') && Math.random() < 0.1) {
                            this.player.hp = Math.min(this.player.maxHp, this.player.hp + 10);
                            this.texts.push(new FloatingText(this.player.pos.x, this.player.pos.y - 30, "+10 HP", "#00ff88"));
                            audio.heal();
                        }
                        if (e.type == 'bounty') this.bountySpawned = false;
                    }
                    // Contact damage - melee units stay alive and use their timer; ranged units destroy on ramming
                    let isColliding = e.pos.dist(this.player.pos) < e.radius + this.player.radius;
                    if (!this.player.isDashing && isColliding) {
                        if (e.type === 'darktrooper' || e.type === 'scout') {
                            // Melee types: push player back, DON'T die
                            this.player.vel = this.player.pos.sub(e.pos).normalize().mult(600);
                        } else {
                            // Ranged types ramming: kamikaze
                            let dmg = (e.type === 'bounty' ? 30 : 12);
                            let wasDamaged = this.player.hp;
                            this.player.takeDamage(dmg); e.dead = true;
                            if (wasDamaged > this.player.hp) {
                                engine.camera.shake(15, 0.3); audio.hit(); this.timeScale = 0.5;
                                document.getElementById('damage-fx').classList.add('active');
                                setTimeout(() => document.getElementById('damage-fx').classList.remove('active'), 150);
                            }
                        }
                    }

                    // Physical collision resolution to prevent overlapping/clipping
                    let contactDist = e.pos.dist(this.player.pos);
                    let minContactDist = e.radius + this.player.radius;
                    if (contactDist < minContactDist) {
                        let pushAmt = minContactDist - contactDist;
                        let pushDir = e.pos.sub(this.player.pos).normalize();
                        if (contactDist === 0) pushDir = new Vector2(1, 0);
                        e.pos = e.pos.add(pushDir.mult(pushAmt));
                    }
                }

                if (this.boss) {
                    this.boss.update(dt, this.player.pos, this.walls);
                    for (let p of this.projectiles) {
                        if (!p.dead && p.isPlayer && p.pos.dist(this.boss.pos) < this.boss.radius + p.radius) {
                            if (!p.isPierce) p.dead = true; else if (p.hits.has(this.boss)) continue; p.hits.add(this.boss);
                            let aw = this.player.getActiveWeapon();
                            let dmg = (aw === 'sniper' ? 100 : aw === 'heavy' ? 15 : aw === 'dart' ? 12 : aw === 'flamer' ? 8 : 20) * this.player.dmgMultiplier;
                            this.boss.hp -= dmg; audio.hit(); this.spawnParticles(p.pos, p.color, 10);
                            this.texts.push(new FloatingText(this.boss.pos.x, this.boss.pos.y - 20, Math.floor(dmg), '#ffaa00'));
                        }
                    }
                    if (!this.player.isDashing && this.boss.dashing && this.boss.pos.dist(this.player.pos) < this.boss.radius + this.player.radius) {
                        let wasDamaged = this.player.hp;
                        this.player.takeDamage(60);
                        if (wasDamaged > this.player.hp) {
                            engine.camera.shake(25, 0.5); audio.hit();
                            document.getElementById('damage-fx').classList.add('active'); setTimeout(() => document.getElementById('damage-fx').classList.remove('active'), 150);
                        }
                        this.player.vel = this.player.pos.sub(this.boss.pos).normalize().mult(1500);
                        this.boss.dashing = false;
                    }
                    if (this.boss.hp <= 0) {
                        let bossPos = new Vector2(this.boss.pos.x, this.boss.pos.y);
                        this.boss.dead = true; engine.camera.shake(40, 1.5); audio.orbitalStrike();
                        this.spawnParticles(bossPos, '#ffcc00', settings.particles === 'high' ? 500 : 150, 3); this.timeScale = 0.05;
                        this.boss = null;
                        for (let i = 0; i < 15; i++) this.loot.push(new BeskarIngot(bossPos.x + MathUtils.randomRange(-50, 50), bossPos.y + MathUtils.randomRange(-50, 50), Math.max(10, Math.floor(15 * currentDifficulty.beskar * this.combo))));
                        for (let i = 0; i < 3; i++) this.loot.push(new BactaStim(bossPos.x + MathUtils.randomRange(-50, 50), bossPos.y + MathUtils.randomRange(-50, 50)));
                        this.queueStory("GREEF KARGA", "Moff Gideon is down! Collect your Beskar and get to the Razor Crest NOW!");
                        if (!this.extractionPos) this.openExtraction();
                    }
                }

                for (let p of this.projectiles) {
                    if (!p.dead && !p.isPlayer && p.pos.dist(this.player.pos) < this.player.radius + p.radius) {
                        p.dead = true;
                        let wasDamaged = this.player.hp;
                        this.player.takeDamage(20);
                        if (wasDamaged > this.player.hp) {
                            engine.camera.shake(15, 0.3); audio.hit();
                            document.getElementById('damage-fx').classList.add('active'); setTimeout(() => document.getElementById('damage-fx').classList.remove('active'), 150);
                        }
                    }
                }

                this.projectiles = this.projectiles.filter(p => !p.dead);
                this.enemies = this.enemies.filter(e => !e.dead);
                this.particles = this.particles.filter(p => !p.dead);
                this.loot = this.loot.filter(l => !l.dead);
                this.texts = this.texts.filter(t => !t.dead);

                if (this.waveKills >= this.killsNeeded && !this.boss && !this.extractionPos) {
                    if (this.wave % 5 === 0) {
                        this.boss = new Boss(this.player.pos.x, this.player.pos.y - 1000, 1 + (this.wave * 0.2));
                        audio.alarm();
                        let bossLines = [
                            "You have something I want. Hand over the child, Mandalorian.",
                            "Impressive survival. But you face the Empire now.",
                            "The Dark Saber will be mine. And you will die here.",
                            "I've been waiting for you, Mandalorian. Surrender the asset."
                        ];
                        this.queueStory("MOFF GIDEON", bossLines[Math.floor(Math.random() * bossLines.length)]);
                    } else {
                        this.wave++; this.waveKills = 0; this.killsNeeded = 30 + (this.wave * 15);
                        if (this.wave > (save.bestWave || 0)) { save.bestWave = this.wave; }
                        this.showWaveIntro(this.wave);

                        // Named Imperial commander per wave for immersion
                        const commanders = ['Commander Hux', 'Admiral Versio', 'Captain Pellaeon', 'Lieutenant Edrison', 'Major Staz', 'Admiral Sloane', 'Commander Ormes', 'Captain Brunson', 'Admiral Konstantine', 'Colonel Jendon'];
                        const cmd = commanders[Math.min(this.wave - 2, commanders.length - 1)];

                        const waveStories = [
                            null,
                            ["GREEF KARGA", "Imperial scout patrol inbound. Take them down, Mando."],
                            ["KUIIL", `${cmd} has deployed Dark Troopers to this sector. I have spoken.`],
                            ["GREEF KARGA", `${cmd} is coordinating the assault! Watch your flanks!`],
                            ["THE ARMORER", "This is the Way. Forge your path through the remnant."],
                            ["FENNEC SHAND", `${cmd} just called in air support. Nice knowing you, Mando.`],
                            ["GREEF KARGA", `Six waves. ${cmd}'s men just keep coming. You're a legend in this sector.`],
                            ["BO-KATAN KRYZE", `Fight on! ${cmd} will fall like the others. Mandalore will be restored!`],
                            ["KUIIL", "The Child is safe because of your battles. Do not falter."],
                            ["GREEF KARGA", `Wave nine. ${cmd} is throwing EVERYTHING. Dart, Flame, and run!`],
                            ["THE ARMORER", "You walk the Way of the Mandalore. No Imperial can stop you."],
                        ];
                        const story = waveStories[Math.min(this.wave - 1, waveStories.length - 1)];
                        if (story) this.queueStory(story[0], story[1]); else this.queueStory("GREEF KARGA", `Wave ${this.wave}. ${cmd} commands the remnant. Eliminate them all.`);
                        if (window.audio) audio.powerup();
                    }
                }

                if (this.extractionPos) {
                    if (this.player.pos.dist(this.extractionPos) < 150) {
                        if (this.extractionTimer === -1) {
                            this.extractionTimer = 20.0;
                            this.queueStory("GREEF KARGA", "Hold the LZ! Razor Crest is descending! Survive!");
                        }
                        if (this.extractionTimer > 0) {
                            this.extractionTimer -= dt;
                            this.spawnTimer -= dt * 6; // Absolute Insane spawn rate!
                        }

                        if (this.extractionTimer <= 0 && this.extractionTimer !== -1 && this.state === 'playing') {
                            this.state = 'win';
                            save.beskar += this.beskarCollected;
                            if (this.wave > (save.bestWave || 0)) save.bestWave = this.wave;
                            let newRecord = this.wave > (save.bestWave || 0);
                            saveGame();
                            document.getElementById('end-title').innerText = newRecord ? "NEW RECORD! BOUNTY SECURED" : "BOUNTY SECURED";
                            document.getElementById('end-title').style.color = newRecord ? "#00ffaa" : "#00aaff";
                            let recap = `<div style="font-family:'Share Tech Mono';font-size:13px;color:#888;margin-top:8px;line-height:2;">`;
                            recap += `WAVE SURVIVED: <span style="color:#00aaff">${this.wave}</span><br>`;
                            recap += `TOTAL BESKAR: <span style="color:#a9b8c2">${this.beskarCollected}</span><br>`;
                            recap += `KILLS: <span style="color:#ff3333">${save.totalKills || 0}</span><br>`;
                            recap += `BEST COMBO: <span style="color:#ffaa00">${this.combo.toFixed(1)}x</span>`;
                            recap += `</div>`;
                            document.getElementById('end-beskar').innerHTML = recap;
                            document.getElementById('end-screen').style.display = 'flex';
                        }
                    } else if (this.extractionTimer > 0) {
                        if (Math.random() < 0.05) this.texts.push(new FloatingText(this.player.pos.x, this.player.pos.y - 50, "RETURN TO LZ!", "#ff3333"));
                    }
                }

                if (this.player.hp <= 0) {
                    this.state = 'lose';
                    // Partial beskar reward on death (25%) — makes death feel less punishing, encourages retry
                    let salvaged = Math.floor(this.beskarCollected * 0.25);
                    save.beskar += salvaged;
                    if (this.wave > (save.bestWave || 0)) save.bestWave = this.wave;
                    saveGame(); // Always save stats on death

                    document.getElementById('end-title').innerText = "K.I.A.";
                    document.getElementById('end-title').style.color = "#ff3333";
                    // Rich end screen
                    let recap = `<div style="font-family:'Share Tech Mono';font-size:13px;color:#888;margin-top:8px;line-height:2;">`;
                    recap += `WAVE SURVIVED: <span style="color:#00aaff">${this.wave}</span><br>`;
                    recap += `KILLS THIS RUN: <span style="color:#ff3333">${save.totalKills || 0}</span><br>`;
                    recap += `BESKAR COLLECTED: <span style="color:#a9b8c2">${this.beskarCollected}</span><br>`;
                    recap += `SALVAGED (25%): <span style="color:#00ff88">+${salvaged}</span><br>`;
                    recap += `BEST COMBO: <span style="color:#ffaa00">${this.combo.toFixed(1)}x</span>`;
                    recap += `</div>`;
                    document.getElementById('end-beskar').innerHTML = recap;
                    document.getElementById('end-screen').style.display = 'flex';
                }

                this.updateHUD();
                engine.camera.update(dt, this.player.pos, mouseWorld);
            }

            openExtraction() {
                // Find a spawn position inside the bounds
                let pos = new Vector2(this.player.pos.x, this.player.pos.y - 1200);
                
                // Let's refine the position to be within play area and not inside any walls
                let attempts = 0;
                let found = false;
                
                while (!found && attempts < 100) {
                    if (attempts > 0) {
                        // If standard direction failed, try a random direction and distance
                        let angle = Math.random() * Math.PI * 2;
                        let dist = MathUtils.randomRange(800, 1500);
                        pos = new Vector2(
                            this.player.pos.x + Math.cos(angle) * dist,
                            this.player.pos.y + Math.sin(angle) * dist
                        );
                    }
                    
                    // Clamp to playable bounds (playable area is x, y between -2500 and 2500)
                    pos.x = Math.max(-2350, Math.min(2350, pos.x));
                    pos.y = Math.max(-2350, Math.min(2350, pos.y));
                    
                    // Check if it overlaps with any walls (with some padding, e.g., 150px extraction radius + 20px)
                    let overlap = false;
                    for (let w of this.walls) {
                        // Check overlap between circle (pos, 150px) and AABB wall
                        let tx = Math.max(w.pos.x, Math.min(pos.x, w.pos.x + w.w));
                        let ty = Math.max(w.pos.y, Math.min(pos.y, w.pos.y + w.h));
                        let dist = Math.hypot(pos.x - tx, pos.y - ty);
                        if (dist < 170) { // overlaps extraction zone + padding
                            overlap = true;
                            break;
                        }
                    }
                    if (!overlap) {
                        found = true;
                    }
                    attempts++;
                }
                
                this.extractionPos = pos;
                audio.alarm();
            }

            draw(ctx) {
                let sand = engine.images.sand;
                if (sand && sand.complete && sand.naturalWidth > 0) {
                    let sW = sand.width; let sH = sand.height;
                    let startX = Math.floor((engine.camera.pos.x - window.innerWidth / 2) / sW) * sW;
                    let startY = Math.floor((engine.camera.pos.y - window.innerHeight / 2) / sH) * sH;

                    for (let x = startX; x < engine.camera.pos.x + window.innerWidth / 2 + sW; x += sW) {
                        for (let y = startY; y < engine.camera.pos.y + window.innerHeight / 2 + sH; y += sH) {
                            ctx.drawImage(sand, x, y);
                        }
                    }
                    ctx.fillStyle = 'rgba(10, 5, 0, 0.5)';
                    ctx.fillRect(engine.camera.pos.x - window.innerWidth / 2, engine.camera.pos.y - window.innerHeight / 2, window.innerWidth, window.innerHeight);
                } else {
                    let grid = 150; let dx = (engine.camera.pos.x) % grid; let dy = (engine.camera.pos.y) % grid;
                    ctx.strokeStyle = '#051015'; ctx.lineWidth = 4;
                    for (let x = -grid * 2; x < window.innerWidth + grid * 2; x += grid) { ctx.beginPath(); ctx.moveTo(x - dx, -100); ctx.lineTo(x - dx, window.innerHeight + 100); ctx.stroke(); }
                    for (let y = -grid * 2; y < window.innerHeight + grid * 2; y += grid) { ctx.beginPath(); ctx.moveTo(-100, y - dy); ctx.lineTo(window.innerWidth + 100, y - dy); ctx.stroke(); }
                }

                if (this.extractionPos) {
                    let pulse = Math.abs(Math.sin(Date.now() * 0.005)) * 0.6 + 0.4;
                    ctx.beginPath(); ctx.arc(this.extractionPos.x, this.extractionPos.y, 150, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(0, 170, 255, ${pulse * 0.2})`; ctx.fill();
                    ctx.strokeStyle = `rgba(0, 170, 255, ${pulse})`; ctx.lineWidth = 12; ctx.stroke();

                    ctx.font = '700 42px Oswald'; ctx.fillStyle = '#0af'; ctx.textAlign = 'center';
                    if (this.extractionTimer > 0) {
                        ctx.fillText(`DEFEND: ${this.extractionTimer.toFixed(1)}s`, this.extractionPos.x, this.extractionPos.y - 170);
                    } else if (this.extractionTimer === 0) {
                        ctx.fillText('EXTRACTION READY', this.extractionPos.x, this.extractionPos.y - 170);
                    } else {
                        ctx.fillText('RAZOR CREST LZ', this.extractionPos.x, this.extractionPos.y - 170);
                    }
                }

                if (this.stratagemMarker) {
                    ctx.beginPath(); ctx.arc(this.stratagemMarker.pos.x, this.stratagemMarker.pos.y, 500, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 85, 0, 0.1)`; ctx.fill(); ctx.strokeStyle = '#ff5500'; ctx.lineWidth = 2; ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(this.stratagemMarker.pos.x, this.stratagemMarker.pos.y - window.innerHeight); ctx.lineTo(this.stratagemMarker.pos.x, this.stratagemMarker.pos.y);
                    let beamWidth = (1.5 - this.stratagemMarker.timer) * 15;
                    ctx.lineWidth = beamWidth; ctx.strokeStyle = `rgba(255, 170, 0, 0.9)`; ctx.stroke();
                }

                for (let s of this.enemyStrikes) {
                    ctx.beginPath(); ctx.arc(s.pos.x, s.pos.y, 300, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 50, 50, 0.1)`; ctx.fill(); ctx.strokeStyle = '#ff3333'; ctx.lineWidth = 2; ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(s.pos.x, s.pos.y - window.innerHeight); ctx.lineTo(s.pos.x, s.pos.y);
                    let beamWidth = (1.5 - s.timer) * 15;
                    ctx.lineWidth = beamWidth; ctx.strokeStyle = `rgba(255, 50, 50, 0.9)`; ctx.stroke();
                }

                for (let w of this.walls) w.draw(ctx);
                for (let l of this.loot) l.draw(ctx);
                this.grogu.draw(ctx);
                if (this.boss) this.boss.draw(ctx);
                for (let e of this.enemies) e.draw(ctx);
                this.player.draw(ctx);
                for (let p of this.projectiles) p.draw(ctx);
                for (let p of this.particles) p.draw(ctx);
                for (let t of this.texts) t.draw(ctx);

                // --- KINETIC SPEED LINES (visual cue of extreme velocity/flow) ---
                if (this.player.isDashing || this.combo >= 4.0) {
                    ctx.save();
                    ctx.setTransform(1, 0, 0, 1, 0, 0); // screen-space
                    ctx.strokeStyle = this.player.isDashing ? 'rgba(0, 170, 255, 0.3)' : 'rgba(255, 170, 0, 0.18)';
                    ctx.lineWidth = 2;
                    let count = this.player.isDashing ? 35 : 15;
                    let cX = window.innerWidth / 2;
                    let cY = window.innerHeight / 2;
                    for (let i = 0; i < count; i++) {
                        let angle = (i / count) * Math.PI * 2 + (Date.now() * 0.001);
                        let length = MathUtils.randomRange(120, 320);
                        let startDist = MathUtils.randomRange(250, 450);
                        let x1 = cX + Math.cos(angle) * startDist;
                        let y1 = cY + Math.sin(angle) * startDist;
                        let x2 = cX + Math.cos(angle) * (startDist + length);
                        let y2 = cY + Math.sin(angle) * (startDist + length);
                        ctx.beginPath();
                        ctx.moveTo(x1, y1);
                        ctx.lineTo(x2, y2);
                        ctx.stroke();
                    }
                    ctx.restore();
                }

                // --- PULSING DYNAMIC TACTICAL RETICLE ---
                let mx = engine.camera.pos.x + input.mouse.x - window.innerWidth / 2;
                let my = engine.camera.pos.y + input.mouse.y - window.innerHeight / 2;

                ctx.save(); ctx.translate(mx, my);
                let crossColor = '#00eeff';
                if (this.player.overheated) {
                    crossColor = Math.floor(Date.now() / 150) % 2 === 0 ? '#ff3333' : '#ffffff';
                } else if (this.player.heat > 60) {
                    crossColor = '#ff7700';
                } else if (this.player.heat > 30) {
                    crossColor = '#ffea00';
                }

                let recoilSpread = (this.player.heat / 100) * 15;
                ctx.strokeStyle = crossColor; ctx.lineWidth = 2;
                
                ctx.beginPath(); ctx.arc(0, 0, 8 + recoilSpread, 0, Math.PI * 2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(-16 - recoilSpread, 0); ctx.lineTo(-6 - recoilSpread, 0);
                ctx.moveTo(6 + recoilSpread, 0); ctx.lineTo(16 + recoilSpread, 0);
                ctx.moveTo(0, -16 - recoilSpread); ctx.lineTo(0, -6 - recoilSpread);
                ctx.moveTo(0, 6 + recoilSpread); ctx.lineTo(0, 16 + recoilSpread);
                ctx.stroke();

                ctx.beginPath(); ctx.arc(0, 0, 24 + recoilSpread, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * (this.player.heat / 100)));
                ctx.strokeStyle = this.player.overheated ? '#ff3333' : 'rgba(0, 238, 255, 0.4)'; ctx.lineWidth = 3; ctx.stroke();

                if (this.player.dashTimer > 0) {
                    ctx.beginPath(); ctx.arc(0, 0, 18 + recoilSpread, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * (this.player.dashTimer / 0.35)));
                    ctx.strokeStyle = 'rgba(0, 255, 170, 0.7)'; ctx.lineWidth = 3; ctx.stroke();
                }
                ctx.restore();

                // --- GROGU VISION: World-space enemy halos ---
                if (this.groguVision > 0) {
                    let pulse = 0.4 + Math.abs(Math.sin(Date.now() * 0.005)) * 0.5;
                    for (let e of this.enemies) {
                        ctx.beginPath(); ctx.arc(e.pos.x, e.pos.y, e.radius + 18, 0, Math.PI * 2);
                        ctx.strokeStyle = `rgba(0,255,170,${pulse})`; ctx.lineWidth = 3; ctx.stroke();
                        // Type label above enemy
                        ctx.font = '700 14px Share Tech Mono'; ctx.textAlign = 'center'; ctx.fillStyle = `rgba(0,255,170,${pulse})`;
                        ctx.fillText(e.type.toUpperCase(), e.pos.x, e.pos.y - e.radius - 22);
                    }
                    if (this.boss) {
                        ctx.beginPath(); ctx.arc(this.boss.pos.x, this.boss.pos.y, this.boss.radius + 25, 0, Math.PI * 2);
                        ctx.strokeStyle = `rgba(255,0,0,${pulse})`; ctx.lineWidth = 5; ctx.stroke();
                    }
                }

                // --- TACTICAL MINIMAP ---
                if (typeof settings === 'undefined' || settings.minimap) {
                    ctx.save();
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    let mapSize = 200;
                    let mapX = window.innerWidth - mapSize - 20;
                    let mapY = 20;

                    ctx.beginPath();
                    ctx.rect(mapX, mapY, mapSize, mapSize);
                    ctx.fillStyle = 'rgba(0, 15, 25, 0.8)'; ctx.fill();
                    ctx.strokeStyle = '#00aaff'; ctx.lineWidth = 2; ctx.stroke();

                    ctx.clip(); // Ensure nothing draws outside the minimap bounds

                    // Map Grid
                    ctx.strokeStyle = 'rgba(0, 170, 255, 0.2)';
                    ctx.beginPath();
                    ctx.moveTo(mapX + mapSize / 2, mapY); ctx.lineTo(mapX + mapSize / 2, mapY + mapSize);
                    ctx.moveTo(mapX, mapY + mapSize / 2); ctx.lineTo(mapX + mapSize, mapY + mapSize / 2);
                    ctx.stroke();

                    let scale = 0.04;
                    let cx = this.player.pos.x;
                    let cy = this.player.pos.y;

                    // Draw Walls on Map
                    for (let w of this.walls) {
                        ctx.fillStyle = 'rgba(0, 170, 255, 0.4)';
                        ctx.fillRect(mapX + mapSize / 2 + (w.pos.x - cx) * scale, mapY + mapSize / 2 + (w.pos.y - cy) * scale, w.w * scale, w.h * scale);
                    }

                    let drawOnMap = (pos, color, r) => {
                        ctx.fillStyle = color;
                        ctx.beginPath(); ctx.arc(mapX + mapSize / 2 + (pos.x - cx) * scale, mapY + mapSize / 2 + (pos.y - cy) * scale, r, 0, Math.PI * 2); ctx.fill();
                    };

                    // Enemies — pulsing red on minimap, bright + large during Grogu Vision
                    let visionActive = this.groguVision > 0;
                    for (let e of this.enemies) {
                        let r = visionActive ? 4 + Math.abs(Math.sin(Date.now() * 0.01)) * 2 : 2.5;
                        let col = visionActive ? (e.type === 'darktrooper' ? '#ff6600' : e.type === 'scout' ? '#00ffff' : '#ff3333') : '#ff3333';
                        drawOnMap(e.pos, col, r);
                    }
                    if (this.boss) drawOnMap(this.boss.pos, '#ff0000', 6);
                    if (this.extractionPos) drawOnMap(this.extractionPos, '#00aaff', 6);
                    for (let l of this.loot) {
                        if (l.life < 3 && Math.floor(Date.now() / 150) % 2 === 0) continue; // blink on map too
                        if (l instanceof BeskarIngot) drawOnMap(l.pos, '#a9b8c2', 1.0);
                        else drawOnMap(l.pos, '#00ffaa', 1.5);
                    }

                    // Draw Player Center
                    drawOnMap(this.player.pos, '#fff', 3.5);

                    ctx.restore();
                } // end if(settings.minimap)
            }
        }

        class Engine {
            constructor() {
                this.canvas = document.getElementById('gameCanvas'); this.ctx = this.canvas.getContext('2d', { alpha: false });
                this.camera = new Camera(); this.scene = null; this.lastTime = performance.now();
                this.images = {}; this.animationFrameId = null;
                this.loadImages();
                window.addEventListener('resize', () => this.resize()); this.resize();
            }
            loadImages() {
                ['mando', 'grogu'].forEach(n => {
                    let img = new Image(); img.src = `assets/${n}.png`; img.onload = () => { this.images[n] = img; };
                });
                let sand = new Image(); sand.src = `assets/textures/sand.png`; sand.onload = () => { this.images['sand'] = sand; };
            }
            resize() { this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight; }
            start(sceneClass) {
                if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
                audio.init(); this.scene = new sceneClass();
                document.querySelectorAll('.menu-screen').forEach(e => e.style.display = 'none');
                document.querySelectorAll('.hud').forEach(e => e.style.display = 'flex');
                document.getElementById('top-ui').style.display = 'block';
                document.getElementById('stratagem-ui').style.display = 'block';
                this.lastTime = performance.now();
                this.animationFrameId = requestAnimationFrame((t) => this.loop(t));
            }
            loop(time) {
                let dt = (time - this.lastTime) / 1000; if (dt > 0.1) dt = 0.1;
                this.lastTime = time;
                if (this.scene) {
                    try {
                        if (this.scene.state === 'playing') this.scene.update(dt);
                        this.ctx.fillStyle = '#010404'; this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                        this.ctx.save(); this.camera.apply(this.ctx); this.scene.draw(this.ctx); this.ctx.restore();
                    } catch (e) {
                        console.error(e);
                        this.ctx.restore();
                    }
                }
                this.animationFrameId = requestAnimationFrame((t) => this.loop(t));
            }
        }
        const engine = new Engine();
