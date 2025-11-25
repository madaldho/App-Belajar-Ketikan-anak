/**
 * TYPING TEST PRO - CLEAN EDITION
 * Logic & Templates
 */

// GLOBAL STATE
let state = {
    screen: 'home',
    siswa: null,
    allSiswa: [],
    allKelas: [],
    allKata: [],
    settings: {},
    
    // Test Vars
    testText: '',
    userInput: '',
    startTime: null,
    duration: 60,
    timer: null,
    finished: false,
    totalErrors: 0,
    lastCaretTop: 0, // To track line changes
    
    adminMode: false
};

// INIT
document.addEventListener('DOMContentLoaded', () => {
    loadHomeData();
    startClock();
    renderScreen();
});

// UTILS
const $ = (id) => document.getElementById(id);

function navigateTo(screen) {
    if (state.timer) clearInterval(state.timer);
    state.screen = screen;
    renderScreen();
    
    if (screen === 'home') loadHomeData();
    if (screen === 'pilih-siswa') loadSiswa();
}

function startClock() {
    setInterval(() => {
        const now = new Date();
        if($('clock')) $('clock').textContent = now.toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'});
        if($('date')) $('date').textContent = now.toLocaleDateString('id-ID', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
    }, 1000);
}

// RENDER ENGINE
function renderScreen() {
    const app = $('app');
    app.className = 'app-container fade-in';
    
    let html = '';
    switch(state.screen) {
        case 'home': html = renderHome(); break;
        case 'pilih-siswa': html = renderPilihSiswa(); break;
        case 'countdown': html = renderCountdown(); break;
        case 'tes': html = renderTes(); break;
        case 'hasil': html = renderHasil(); break;
        case 'leaderboard-full': html = renderLeaderboardFull(); break;
        case 'login-admin': html = renderLoginAdmin(); break;
        case 'admin': html = renderAdmin(); break;
    }
    app.innerHTML = html;
}

// TEMPLATES
function renderHome() {
    return `
        <header class="flex-between" style="padding: 1rem 0;">
            <div>
                <h1>TypingChamp</h1>
                <p class="text-muted">Uji Kecepatan Mengetik</p>
            </div>
            <div class="text-right">
                <div id="clock" style="font-weight: 700; font-size: 1.5rem;">00:00</div>
                <div id="date" class="text-muted">Loading...</div>
            </div>
        </header>

        <div class="dashboard-grid">
            <!-- Left: Hero & Stats -->
            <div class="flex-col gap-4">
                <div class="card hero-section">
                    <h2 style="margin-bottom: 1rem;">Siap Mengetik?</h2>
                    <p id="quote" style="font-style: italic; margin-bottom: 2rem;">"..."</p>
                    
                    <button onclick="navigateTo('pilih-siswa')" class="btn btn-primary btn-lg" style="width: 100%;">
                        🚀 MULAI TES SEKARANG
                    </button>
                </div>
                
                <div class="card flex-between">
                    <div class="text-center flex-1">
                        <h3>Total Pemain</h3>
                        <div class="stat-number" id="stat-pemain">0</div>
                    </div>
                    <div class="text-center flex-1" style="border-left: 2px solid #f1f5f9;">
                        <h3>Top WPM</h3>
                        <div class="stat-number" style="color: var(--success);" id="stat-wpm">0</div>
                    </div>
                </div>
            </div>

            <!-- Right: Leaderboard -->
            <div class="card">
                <div class="flex-between" style="margin-bottom: 1rem;">
                    <h3>🏆 Top Leaderboard</h3>
                    <button onclick="navigateTo('leaderboard-full')" class="btn btn-secondary">Lihat Semua</button>
                </div>
                <div id="lb-preview">Loading...</div>
            </div>
        </div>
        
        <div class="text-center" style="margin-top: 2rem;">
            <button onclick="navigateTo('login-admin')" class="btn btn-secondary">Admin Panel</button>
        </div>
    `;
}

function renderPilihSiswa() {
    return `
        <div class="flex-between" style="margin-bottom: 2rem;">
            <button onclick="navigateTo('home')" class="btn btn-secondary">← Kembali</button>
            <h2>Pilih Pemain</h2>
            <button onclick="tambahPemain()" class="btn btn-primary">➕ Tambah Pemain</button>
        </div>
        
        <div class="card">
            <div class="flex-center gap-2" style="margin-bottom: 1.5rem; background: #f8fafc; padding: 1rem; border-radius: 12px;">
                <label style="font-weight: 600;">Filter Kelas:</label>
                <select id="filter-kelas" onchange="filterSiswa()" class="input" style="max-width: 200px;">
                    <option value="">Semua</option>
                </select>
            </div>
            
            <div id="siswa-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
                Loading...
            </div>
        </div>
    `;
}

function renderCountdown() {
    return `
        <div class="flex-center flex-col" style="height: 80vh;">
            <h2>${state.siswa.nama}</h2>
            <p class="text-muted">Bersiap...</p>
            <div id="count" style="font-size: 10rem; font-weight: 900; color: var(--primary);">3</div>
        </div>
    `;
}

function renderTes() {
    return `
        <div class="test-container">
            <div class="flex-between" style="margin-bottom: 2px;">
                <div>
                    <h3 style="font-size: 1.8rem;">${state.siswa.nama}</h3>
                    <span class="text-muted" style="font-weight: 600;">${state.siswa.kelas_nama}</span>
                </div>
                <div class="text-right">
                    <span class="text-muted">WAKTU</span>
                    <div id="timer" style="font-size: 2.5rem; font-weight: 800; color: var(--error);">00:00</div>
                </div>
            </div>
            
            <div class="typing-area" id="text-area" onclick="$('hidden-input').focus()">
                <div style="position: relative; z-index: 1;">
                    <div id="caret"></div>
                    <div id="text-content"></div>
                </div>
            </div>
            <input type="text" id="hidden-input" style="opacity: 0; position: absolute;">
            
            <div class="card flex-between" style="margin-top: 2rem;">
                <div class="text-center">
                    <h3>WPM</h3>
                    <div id="wpm" class="stat-number">0</div>
                </div>
                <div class="text-center">
                    <h3>Akurasi</h3>
                    <div id="acc" class="stat-number" style="color: var(--accent);">100%</div>
                </div>
                <div class="text-center">
                    <h3>Salah</h3>
                    <div id="err" class="stat-number" style="color: var(--error);">0</div>
                </div>
            </div>
            
            <div class="text-center" style="margin-top: 2rem;">
                <button onclick="endTest(true)" class="btn btn-danger">Batalkan Tes</button>
            </div>
        </div>
    `;
}

function renderHasil() {
    return `
        <div class="flex-center flex-col" style="min-height: 80vh;">
            <div id="confetti-origin"></div>
            <div id="rank-badge"></div>
            
            <div class="card result-card">
                <p class="text-muted">Hasil Tes</p>
                <h2>${state.siswa.nama}</h2>
                
                <div class="score-big">${state.hasil.skor}</div>
                <p style="font-weight: 700; letter-spacing: 1px;">TOTAL SKOR</p>
                
                <div class="flex-between" style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #f1f5f9;">
                    <div>
                        <div style="font-size: 1.5rem; font-weight: 700;">${state.hasil.wpm}</div>
                        <div class="text-muted">WPM</div>
                    </div>
                    <div>
                        <div style="font-size: 1.5rem; font-weight: 700;">${state.hasil.akurasi}%</div>
                        <div class="text-muted">Akurasi</div>
                    </div>
                    <div>
                        <div style="font-size: 1.5rem; font-weight: 700; color: var(--error);">${state.totalErrors}</div>
                        <div class="text-muted">Salah</div>
                    </div>
                </div>
            </div>
            
            <div class="flex-center gap-4" style="margin-top: 2rem;">
                <button onclick="mainLagi()" class="btn btn-primary btn-lg">🔄 Main Lagi</button>
                <button onclick="navigateTo('home')" class="btn btn-secondary btn-lg">🏠 Home</button>
            </div>
        </div>
    `;
}

function renderAdmin() {
    return `
        <div class="app-container">
            <div class="flex-between" style="margin-bottom: 2rem;">
                <h2>Admin Dashboard</h2>
                <div class="flex-center gap-2">
                    <button onclick="loadAdminDashboard()" class="btn btn-secondary" title="Refresh Data">🔄</button>
                    <button onclick="navigateTo('home')" class="btn btn-secondary">Logout</button>
                </div>
            </div>
            
            <!-- Tabs -->
            <div class="flex-center gap-2" style="margin-bottom: 2rem; background: #fff; padding: 0.5rem; border-radius: 12px; box-shadow: var(--shadow);">
                <button onclick="switchAdminTab('stats')" class="btn btn-primary" id="tab-stats">Overview</button>
                <button onclick="switchAdminTab('students')" class="btn btn-secondary" id="tab-students">Siswa</button>
                <button onclick="switchAdminTab('history')" class="btn btn-secondary" id="tab-history">History</button>
                <button onclick="switchAdminTab('settings')" class="btn btn-secondary" id="tab-settings">Settings</button>
                <button onclick="switchAdminTab('tools')" class="btn btn-secondary" id="tab-tools">Tools</button>
            </div>
            
            <div id="admin-content" class="card">
                Loading...
            </div>
        </div>
    `;
}

// Admin Logic
let adminTab = 'stats';

async function loadAdminDashboard() {
    switchAdminTab('stats');
}

async function switchAdminTab(tab) {
    adminTab = tab;
    
    // Update Buttons
    ['stats', 'students', 'history', 'settings', 'tools'].forEach(t => {
        const btn = $(`tab-${t}`);
        if(btn) btn.className = t === tab ? 'btn btn-primary' : 'btn btn-secondary';
    });
    
    const content = $('admin-content');
    content.innerHTML = 'Loading...';
    
    try {
        if(tab === 'stats') {
            const stats = await fetch('/api/statistik-harian').then(r=>r.json());
            content.innerHTML = `
                <div class="dashboard-grid">
                    <div class="stat-box">
                        <h3>Total Tes Hari Ini</h3>
                        <div class="stat-number">${stats.total_tes}</div>
                    </div>
                    <div class="stat-box">
                        <h3>Total Pemain</h3>
                        <div class="stat-number" style="color: var(--accent)">${stats.total_pemain}</div>
                    </div>
                    <div class="stat-box">
                        <h3>Rata-rata Skor</h3>
                        <div class="stat-number" style="color: var(--warning)">${stats.rata_rata_skor}</div>
                    </div>
                    <div class="stat-box">
                        <h3>Top WPM</h3>
                        <div class="stat-number" style="color: var(--success)">${stats.wpm_tertinggi}</div>
                    </div>
                </div>
            `;
        } 
        else if(tab === 'students') {
            const students = await fetch('/api/siswa').then(r=>r.json());
            content.innerHTML = `
                <div style="max-height: 500px; overflow-y: auto;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f8fafc; text-align: left;">
                                <th style="padding: 1rem;">Nama</th>
                                <th style="padding: 1rem;">Kelas</th>
                                <th style="padding: 1rem;">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${students.map(s => `
                                <tr style="border-bottom: 1px solid #eee;">
                                    <td style="padding: 1rem;">${s.avatar} ${s.nama}</td>
                                    <td style="padding: 1rem;">${s.kelas_nama}</td>
                                    <td style="padding: 1rem;">
                                        <button onclick="deleteSiswa(${s.id})" class="btn btn-danger" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;">Hapus</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
        else if(tab === 'history') {
            const history = await fetch('/api/hasil-tes-all').then(r=>r.json());
            content.innerHTML = `
                <div style="max-height: 500px; overflow-y: auto;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f8fafc; text-align: left;">
                                <th style="padding: 1rem;">Waktu</th>
                                <th style="padding: 1rem;">Nama</th>
                                <th style="padding: 1rem;">WPM</th>
                                <th style="padding: 1rem;">Skor</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${history.map(h => `
                                <tr style="border-bottom: 1px solid #eee;">
                                    <td style="padding: 1rem;">${new Date(h.created_at).toLocaleTimeString()}</td>
                                    <td style="padding: 1rem;">${h.siswa_nama}</td>
                                    <td style="padding: 1rem;">${h.wpm}</td>
                                    <td style="padding: 1rem; font-weight: bold;">${h.skor}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
        else if(tab === 'settings') {
            const s = await fetch('/api/settings').then(r=>r.json());
            content.innerHTML = `
                <div class="flex-col gap-4" style="max-width: 600px; margin: 0 auto;">
                    <div>
                        <label style="font-weight: 700;">Quote Motivasi</label>
                        <textarea id="set-quote" class="input" rows="3">${s.quote_motivasi || ''}</textarea>
                    </div>
                    <div>
                        <label style="font-weight: 700;">Durasi Tes (detik)</label>
                        <input type="number" id="set-durasi" class="input" value="${s.durasi_tes || 60}">
                    </div>
                    <button onclick="saveSettings()" class="btn btn-primary">Simpan Pengaturan</button>
                </div>
            `;
        }
        else if(tab === 'tools') {
            content.innerHTML = `
                <div class="dashboard-grid">
                    <div class="stat-box" style="text-align: left; background: white; border: 1px solid #eee;">
                        <h3>📁 Import Siswa</h3>
                        <p class="text-muted" style="margin: 1rem 0;">Upload Excel (.xlsx) dengan kolom: Nama, Kelas</p>
                        
                        <div class="flex-center gap-2" style="margin-bottom: 1rem; justify-content: flex-start;">
                            <a href="/static/template_siswa.xlsx" download class="btn btn-secondary" style="font-size: 0.9rem; padding: 0.5rem 1rem;">
                                📄 Download Template
                            </a>
                        </div>

                        <input type="file" id="excel-file" class="input" style="margin-bottom: 1rem;">
                        <button onclick="uploadSiswa()" class="btn btn-primary">Upload Data</button>
                    </div>
                    
                    <div class="stat-box" style="text-align: left; background: #fff1f2; border: 1px solid #fecaca;">
                        <h3 style="color: var(--error);">⚠️ Danger Zone</h3>
                        <p class="text-muted" style="margin: 1rem 0;">Hapus semua data hasil tes. Data siswa tetap aman.</p>
                        <button onclick="resetLeaderboard()" class="btn btn-danger">RESET LEADERBOARD</button>
                    </div>
                </div>
            `;
        }
    } catch(e) {
        content.innerHTML = `<p class="text-center text-muted">Gagal memuat data: ${e}</p>`;
    }
}

async function deleteSiswa(id) {
    if(!confirm("Hapus siswa ini?")) return;
    try {
        await fetch(`/api/siswa/${id}`, {method: 'DELETE'});
        switchAdminTab('students');
    } catch(e) { alert("Gagal hapus"); }
}

async function saveSettings() {
    const q = $('set-quote').value;
    const d = $('set-durasi').value;
    await fetch('/api/settings', {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({key:'quote_motivasi', value:q})});
    await fetch('/api/settings', {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({key:'durasi_tes', value:d})});
    alert('Tersimpan!');
}

function renderLoginAdmin() {
    return `
        <div class="flex-center" style="height: 80vh;">
            <div class="card text-center" style="width: 400px;">
                <h2>Login Admin</h2>
                <input type="password" id="pin" class="input text-center" style="font-size: 2rem; margin: 2rem 0;" placeholder="PIN">
                <button onclick="handleLogin()" class="btn btn-primary" style="width: 100%;">MASUK</button>
                <button onclick="navigateTo('home')" class="btn btn-secondary" style="width: 100%; margin-top: 1rem;">Batal</button>
            </div>
        </div>
    `;
}

function renderLeaderboardFull() {
    // Trigger load data
    setTimeout(loadFullLeaderboardData, 100);
    return `
        <div class="app-container">
            <div class="flex-between" style="margin-bottom: 1rem;">
                 <button onclick="navigateTo('home')" class="btn btn-secondary">← Kembali</button>
                 <h2>Leaderboard</h2>
            </div>
            <div class="card" id="lb-full" style="flex: 1; overflow-y: auto;">Loading...</div>
        </div>
    `;
}

async function loadFullLeaderboardData() {
     try {
         const lb = await fetch('/api/leaderboard?limit=50').then(r=>r.json());
         $('lb-full').innerHTML = lb.map((x,i) => `
            <div class="lb-item">
                <div class="flex-center gap-4">
                    <span class="lb-rank" style="font-size: 1.2rem;">#${i+1}</span> 
                    <span style="font-size: 1.5rem;">${x.avatar}</span> 
                    <div class="flex-col">
                        <span class="lb-name">${x.siswa_nama}</span>
                        <span class="text-muted" style="font-size: 0.8rem;">${x.kelas_nama}</span>
                    </div>
                </div>
                <div class="lb-score" style="font-size: 1.2rem;">${x.skor}</div>
            </div>
         `).join('');
     } catch(e) {
         $('lb-full').innerHTML = '<p class="text-center">Gagal memuat data</p>';
     }
}

// ========== RESTORED LOGIC FUNCTIONS ==========

async function loadHomeData() {
    try {
        const s = await fetch('/api/settings').then(r=>r.json());
        if(s.quote_motivasi) $('quote').textContent = `"${s.quote_motivasi}"`;
        
        const st = await fetch('/api/statistik-harian').then(r=>r.json());
        $('stat-pemain').textContent = st.total_pemain;
        $('stat-wpm').textContent = Math.round(st.wpm_tertinggi);
        
        const lb = await fetch('/api/leaderboard?limit=5').then(r=>r.json());
        $('lb-preview').innerHTML = lb.length ? lb.map((x,i) => `
            <div class="lb-item">
                <div class="flex-center gap-2">
                    <span class="lb-rank">#${i+1}</span>
                    <span>${x.avatar}</span>
                    <span class="lb-name">${x.siswa_nama}</span>
                </div>
                <div class="lb-score">${x.skor}</div>
            </div>
        `).join('') : '<p class="text-center text-muted">Belum ada data</p>';
    } catch(e) {}
}

async function loadSiswa() {
    state.allKelas = await fetch('/api/kelas').then(r=>r.json());
    state.allSiswa = await fetch('/api/siswa').then(r=>r.json());
    $('filter-kelas').innerHTML = '<option value="">Semua</option>' + state.allKelas.map(k=>`<option value="${k.id}">${k.nama}</option>`).join('');
    displaySiswa(state.allSiswa);
}

function displaySiswa(list) {
    $('siswa-grid').innerHTML = list.map(s => `
        <div onclick='pilihSiswa(${JSON.stringify(s)})' class="card text-center" style="cursor: pointer; padding: 1rem;">
            <div style="font-size: 2.5rem;">${s.avatar}</div>
            <div style="font-weight: 700;">${s.nama}</div>
            <div class="text-muted">${s.kelas_nama}</div>
        </div>
    `).join('');
}

function filterSiswa() {
    const id = $('filter-kelas').value;
    displaySiswa(id ? state.allSiswa.filter(s=>s.kelas_id == id) : state.allSiswa);
}

async function tambahPemain() {
    const nama = prompt("Nama Pemain:");
    if(!nama) return;
    try {
        let cls = state.allKelas.find(k=>k.nama==='Umum');
        if(!cls) cls = await fetch('/api/kelas', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({nama:'Umum'})}).then(r=>r.json());
        
        const s = await fetch('/api/siswa', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({nama, kelas_id:cls.id, avatar:'👤'})}).then(r=>r.json());
        pilihSiswa(s);
    } catch(e) { alert("Gagal: " + e); }
}

function pilihSiswa(s) {
    state.siswa = s;
    state.screen = 'countdown';
    renderScreen();
    let n = 3;
    const t = setInterval(() => {
        n--;
        if(n>0) $('count').textContent = n;
        else { clearInterval(t); startTest(); }
    }, 1000);
}

async function startTest() {
    state.screen = 'tes';
    renderScreen();
    
    state.userInput = '';
    state.totalErrors = 0;
    state.startTime = Date.now();
    state.finished = false;
    state.lastCaretTop = 0; // Reset scroll tracking
    
    try {
        const kata = await fetch('/api/kata').then(r=>r.json());
        let t = [];
        for(let i=0; i<12; i++) t.push(kata[Math.floor(Math.random()*kata.length)].kata);
        state.testText = t.join(' ');
        renderText();
        
        const input = $('hidden-input');
        input.value = '';
        input.focus();
        input.onblur = () => setTimeout(()=>input.focus(), 10);
        input.oninput = (e) => handleInput(e.target.value);
        
        let time = 60;
        $('timer').textContent = "01:00";
        state.timer = setInterval(() => {
            time--;
            const m = Math.floor(time/60);
            const s = time%60;
            $('timer').textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
            if(time<=0) endTest();
        }, 1000);
    } catch(e) { alert("Error"); navigateTo('home'); }
}

function renderText() {
    const chars = state.testText.split('');
    const html = chars.map((c,i) => {
        let cls = 'char';
        if(i < state.userInput.length) cls += state.userInput[i] === c ? ' correct' : ' incorrect';
        else cls += ' pending';
        // Use normal space to allow wrapping, pre-wrap handles visualization
        return `<span class="${cls}" id="char-${i}">${c}</span>`;
    }).join('');
    $('text-content').innerHTML = html;
    
    // Caret & Auto-Scroll Logic
    const idx = state.userInput.length;
    const el = $(`char-${idx}`);
    const caret = $('caret');
    const area = $('text-area');
    
    if(el) {
        // Move Caret
        caret.style.display = 'block';
        caret.style.left = el.offsetLeft + 'px';
        caret.style.top = el.offsetTop + 'px';
        
        // Focus Line Logic (Typewriter Scrolling)
        // Keep active line near top (20px)
        const offsetTarget = 20; 
        const targetScroll = el.offsetTop - offsetTarget;
        
        // Only scroll if we deviate significantly to avoid jitter
        if (Math.abs(area.scrollTop - targetScroll) > 10) {
             area.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' });
        }
    } else {
        // End of text handling
        const last = $(`char-${state.testText.length-1}`);
        if(last) {
            caret.style.left = (last.offsetLeft + last.offsetWidth) + 'px';
            caret.style.top = last.offsetTop + 'px';
        }
    }
}

function handleInput(val) {
    if(state.finished) return;
    if(val.length > state.userInput.length) {
        if(val[val.length-1] !== state.testText[val.length-1]) state.totalErrors++;
    }
    state.userInput = val;
    renderText();
    
    // Stats
    const m = (Date.now() - state.startTime)/60000;
    const wpm = m>0 ? Math.round((val.length/5)/m) : 0;
    const acc = val.length>0 ? Math.round(((val.length-state.totalErrors)/val.length)*100) : 100;
    $('wpm').textContent = wpm;
    $('acc').textContent = acc + '%';
    $('err').textContent = state.totalErrors;
    
    if(val.length >= state.testText.length - 5) {
        // Add more text logic if needed
    }
}

async function endTest(cancel) {
    state.finished = true;
    clearInterval(state.timer);
    if(cancel) return navigateTo('home');
    
    const m = (Date.now() - state.startTime)/60000;
    const wpm = m>0 ? (state.userInput.length/5)/m : 0;
    const acc = state.userInput.length>0 ? ((state.userInput.length-state.totalErrors)/state.userInput.length)*100 : 0;
    const score = Math.max(0, Math.round((wpm*acc) - (state.totalErrors * 5)));
    
    state.hasil = {
        siswa_id: state.siswa.id, durasi:60, kata_benar:0, kata_salah:0,
        wpm: parseFloat(wpm.toFixed(1)), akurasi: parseFloat(acc.toFixed(1)), skor: score
    };
    
    await fetch('/api/hasil-tes', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(state.hasil)});
    state.screen = 'hasil';
    renderScreen();
    
    // Rank Check
    const lb = await fetch('/api/leaderboard?limit=100').then(r=>r.json());
    const rank = lb.findIndex(x=>x.skor === score && x.siswa_id === state.siswa.id) + 1;
    if(rank > 0 && rank <= 10) $('rank-badge').innerHTML = `<div class="rank-badge">🏆 JUARA #${rank}</div>`;
    
    if(window.confetti) confetti();
}

function mainLagi() {
    state.timer = null;
    state.userInput = '';
    startTest();
}

async function handleLogin() {
    const pin = $('pin').value;
    const r = await fetch('/api/auth/login', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({pin})});
    if(r.ok) { state.adminMode = true; navigateTo('admin'); }
    else alert("PIN Salah");
}

async function uploadSiswa() {
    const f = $('excel-file').files[0];
    if(!f) return alert("Pilih file dulu!");
    
    const fd = new FormData(); fd.append('file', f);
    
    try {
        const res = await fetch('/api/admin/import-siswa', {method:'POST', body:fd});
        const data = await res.json();
        
        if(res.ok) {
            alert(data.message);
            $('excel-file').value = ''; // Reset input
        } else {
            alert("Gagal: " + (data.detail || "Terjadi kesalahan"));
        }
    } catch(e) { 
        alert("Error Upload: " + e); 
    }
}

async function resetLeaderboard() {
    if(confirm("Reset?")) {
        await fetch('/api/admin/reset-leaderboard', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({confirm:true})});
        alert("Reset Berhasil");
    }
}
