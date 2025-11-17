/**
 * TYPING TEST - Per Character Mode
 * Modern, Professional, Responsive
 */

// ========== STATE ==========
let state = {
    screen: 'home',
    siswa: null,
    allSiswa: [],
    allKelas: [],
    testText: '',
    userInput: '',
    currentIndex: 0,
    correctChars: 0,
    incorrectChars: 0,
    startTime: null,
    duration: 60,
    timer: null,
    finished: false
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    renderScreen();
    if (state.screen === 'home') loadHomeData();
});

// ========== NAVIGATION ==========
function navigateTo(screen) {
    state.screen = screen;
    renderScreen();
    
    if (screen === 'home') loadHomeData();
    else if (screen === 'pilih-siswa') loadSiswa();
    else if (screen === 'leaderboard-full') loadFullLeaderboard();
}

function renderScreen() {
    const app = document.getElementById('app');
    
    if (state.screen === 'home') app.innerHTML = renderHome();
    else if (state.screen === 'pilih-siswa') app.innerHTML = renderPilihSiswa();
    else if (state.screen === 'countdown') app.innerHTML = renderCountdown();
    else if (state.screen === 'tes') app.innerHTML = renderTes();
    else if (state.screen === 'hasil') app.innerHTML = renderHasil();
    else if (state.screen === 'leaderboard-full') app.innerHTML = renderLeaderboardFull();
    else if (state.screen === 'login-admin') app.innerHTML = renderLoginAdmin();
}

// ========== HOME SCREEN ==========
function renderHome() {
    return `
        <div class="container mx-auto px-4 py-12 max-w-7xl">
            <div class="text-center mb-16 animate-fade-in">
                <h1 class="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-4">
                    ⚡ TYPING TEST
                </h1>
                <p class="text-xl md:text-2xl text-gray-600 font-medium">
                    Uji Kecepatan Mengetik Bahasa Indonesia
                </p>
            </div>
            
            <div class="max-w-2xl mx-auto mb-16">
                <button onclick="navigateTo('pilih-siswa')" 
                        class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-10 px-12 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-200">
                    <span class="text-6xl block mb-3">🎯</span>
                    <span class="text-4xl block">MULAI TES</span>
                    <span class="block text-lg font-normal mt-3 opacity-90">Klik untuk memulai</span>
                </button>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div class="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-gray-100">
                    <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                        <span class="text-3xl">📊</span>
                        STATISTIK HARI INI
                    </h3>
                    <div class="space-y-4">
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">Total Pemain</span>
                            <span class="text-3xl font-black text-blue-600" id="stat-pemain">0</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">Rata-rata WPM</span>
                            <span class="text-3xl font-black text-emerald-600" id="stat-wpm">0</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">Akurasi Terbaik</span>
                            <span class="text-3xl font-black text-purple-600"><span id="stat-akurasi">0</span>%</span>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-gray-100 lg:col-span-2">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl font-bold text-gray-800 flex items-center gap-3">
                            <span class="text-3xl">🏆</span>
                            TOP 5 LEADERBOARD
                        </h3>
                        <button onclick="navigateTo('leaderboard-full')" class="text-blue-600 hover:text-blue-700 font-semibold">
                            Lihat Semua →
                        </button>
                    </div>
                    <div id="leaderboard-preview" class="space-y-3">
                        <div class="text-center py-8 text-gray-400">Memuat...</div>
                    </div>
                </div>
            </div>
            
            <div class="text-center">
                <button onclick="navigateTo('login-admin')" 
                        class="text-gray-500 hover:text-gray-700 font-medium inline-flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-white/50 transition-all">
                    <span>⚙️</span>
                    Halaman Guru
                </button>
            </div>
        </div>
    `;
}

async function loadHomeData() {
    try {
        const stats = await fetch('/api/statistik-harian').then(r => r.json());
        document.getElementById('stat-pemain').textContent = stats.total_pemain;
        document.getElementById('stat-wpm').textContent = Math.round(stats.wpm_tertinggi);
        document.getElementById('stat-akurasi').textContent = stats.akurasi_terbaik.toFixed(1);
        
        const leaderboard = await fetch('/api/leaderboard?limit=5').then(r => r.json());
        displayLeaderboardPreview(leaderboard);
        
        setInterval(() => loadHomeData(), 30000);
    } catch (error) {
        console.error('Error loading home data:', error);
    }
}

function displayLeaderboardPreview(data) {
    const container = document.getElementById('leaderboard-preview');
    if (!data || data.length === 0) {
        container.innerHTML = '<div class="text-center py-8 text-gray-500">Belum ada data. Mulai tes pertama kamu!</div>';
        return;
    }
    
    container.innerHTML = data.map((item, i) => {
        const medals = ['🥇', '🥈', '🥉'];
        const bgClass = i < 3 ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200' : 'bg-gray-50';
        
        return `
            <div class="flex items-center justify-between p-4 rounded-2xl ${bgClass} transition-all hover:scale-102">
                <div class="flex items-center gap-4 flex-1">
                    <span class="text-3xl font-bold ${i < 3 ? 'text-amber-600' : 'text-gray-400'}">${medals[i] || item.rank}</span>
                    <span class="text-3xl">${item.avatar}</span>
                    <div>
                        <div class="font-bold text-lg text-gray-800">${item.siswa_nama}</div>
                        <div class="text-sm text-gray-600">Kelas ${item.kelas_nama}</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-2xl font-black text-amber-600">${item.skor} pts</div>
                    <div class="text-sm text-gray-600">${item.wpm} WPM · ${item.akurasi}%</div>
                </div>
            </div>
        `;
    }).join('');
}

// ========== PILIH SISWA ==========
function renderPilihSiswa() {
    return `
        <div class="container mx-auto px-4 py-8 max-w-6xl">
            <button onclick="navigateTo('home')" class="mb-6 text-gray-600 hover:text-gray-800 font-semibold inline-flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/50 transition-all">
                <span class="text-2xl">←</span> Kembali
            </button>
            
            <div class="text-center mb-10">
                <h2 class="text-6xl font-black text-gray-800 mb-6">Pilih Nama Kamu</h2>
                <div class="inline-flex items-center gap-3 bg-white rounded-2xl px-8 py-4 shadow-lg">
                    <label class="text-gray-700 font-bold">Filter Kelas:</label>
                    <select id="filter-kelas" onchange="filterSiswa()" 
                            class="bg-transparent border-none outline-none font-bold text-blue-600 cursor-pointer text-lg">
                        <option value="">Semua Kelas</option>
                    </select>
                </div>
            </div>
            
            <div id="siswa-grid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                <div class="col-span-full text-center py-12 text-gray-500">Memuat...</div>
            </div>
            
            <div class="text-center">
                <button onclick="guruIkut()" class="bg-white hover:bg-gray-50 text-gray-800 font-bold py-4 px-8 rounded-2xl shadow-lg border-2 border-gray-200 transition-all">
                    👨‍🏫 Guru Ikutan Tes
                </button>
            </div>
        </div>
    `;
}

async function loadSiswa() {
    try {
        state.allKelas = await fetch('/api/kelas').then(r => r.json());
        state.allSiswa = await fetch('/api/siswa').then(r => r.json());
        
        const select = document.getElementById('filter-kelas');
        select.innerHTML = '<option value="">Semua Kelas</option>' +
            state.allKelas.map(k => `<option value="${k.id}">${k.nama}</option>`).join('');
        
        displaySiswa(state.allSiswa);
    } catch (error) {
        console.error('Error loading siswa:', error);
    }
}

function displaySiswa(siswa) {
    const grid = document.getElementById('siswa-grid');
    if (!siswa || siswa.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center py-12 text-gray-500">Belum ada siswa</div>';
        return;
    }
    
    grid.innerHTML = siswa.map(s => `
        <button onclick='selectSiswa(${JSON.stringify(s)})' 
                class="bg-white hover:shadow-2xl hover:scale-105 rounded-3xl p-8 text-center transition-all duration-200 border-2 border-gray-100 hover:border-blue-400">
            <div class="text-7xl mb-4">${s.avatar}</div>
            <div class="font-bold text-xl text-gray-800 mb-2">${s.nama}</div>
            <div class="text-gray-600">Kelas ${s.kelas_nama}</div>
        </button>
    `).join('');
}

function filterSiswa() {
    const kelasId = document.getElementById('filter-kelas').value;
    const filtered = kelasId ? state.allSiswa.filter(s => s.kelas_id == kelasId) : state.allSiswa;
    displaySiswa(filtered);
}

function selectSiswa(siswa) {
    state.siswa = siswa;
    startCountdown();
}

function guruIkut() {
    const nama = prompt('Nama Guru:');
    if (nama) {
        state.siswa = { id: 0, nama, kelas_nama: 'Guru', avatar: '👨‍🏫' };
        startCountdown();
    }
}

// ========== COUNTDOWN ==========
function renderCountdown() {
    return `
        <div class="container mx-auto px-4 py-20 text-center">
            <h3 class="text-2xl text-gray-600 mb-2">Pemain:</h3>
            <h2 class="text-5xl font-black text-gray-800 mb-16">
                ${state.siswa.nama} <span class="text-gray-500">(${state.siswa.kelas_nama})</span>
            </h2>
            <p class="text-2xl text-gray-600 mb-8">Bersiap...</p>
            <div id="countdown-num" class="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-8 animate-pulse">3</div>
            <p class="text-xl text-gray-500">Letakkan jari di keyboard</p>
        </div>
    `;
}

function startCountdown() {
    state.screen = 'countdown';
    renderScreen();
    
    let count = 3;
    const interval = setInterval(() => {
        count--;
        const el = document.getElementById('countdown-num');
        if (count > 0) {
            el.textContent = count;
        } else {
            clearInterval(interval);
            el.textContent = 'MULAI!';
            setTimeout(() => startTest(), 500);
        }
    }, 1000);
}

// ========== TES SCREEN (PER HURUF) ==========
function renderTes() {
    return `
        <div class="container mx-auto px-4 py-6 max-w-6xl">
            <div class="flex justify-between items-center mb-6">
                <div class="text-lg font-semibold text-gray-700">
                    ${state.siswa.nama} <span class="text-gray-500">(${state.siswa.kelas_nama})</span>
                </div>
                <div class="text-right">
                    <div class="text-sm text-gray-500">Sisa Waktu</div>
                    <div id="timer" class="text-5xl font-black text-red-500 mono">01:00</div>
                </div>
            </div>
            
            <div class="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-10 md:p-16 mb-6 border border-gray-100">
                <div id="text-display" class="mono text-left mb-8 leading-relaxed select-none cursor-text" 
                     onclick="document.getElementById('hidden-input').focus()"
                     style="min-height: 200px; word-wrap: break-word;">
                </div>
                
                <input type="text" 
                       id="hidden-input" 
                       autocomplete="off"
                       autocapitalize="off"
                       autocorrect="off"
                       spellcheck="false">
                
                <div class="grid grid-cols-4 gap-6 pt-8 border-t-2 border-gray-200">
                    <div class="text-center">
                        <div class="text-4xl font-black text-emerald-500" id="wpm-display">0</div>
                        <div class="text-xs text-gray-600 font-semibold mt-1">WPM</div>
                    </div>
                    <div class="text-center">
                        <div class="text-4xl font-black text-blue-500"><span id="accuracy-display">100</span>%</div>
                        <div class="text-xs text-gray-600 font-semibold mt-1">AKURASI</div>
                    </div>
                    <div class="text-center">
                        <div class="text-4xl font-black text-purple-500" id="correct-display">0</div>
                        <div class="text-xs text-gray-600 font-semibold mt-1">BENAR</div>
                    </div>
                    <div class="text-center">
                        <div class="text-4xl font-black text-red-500" id="incorrect-display">0</div>
                        <div class="text-xs text-gray-600 font-semibold mt-1">SALAH</div>
                    </div>
                </div>
            </div>
            
            <div class="text-center text-gray-600 text-sm">
                <p>💡 Klik area teks untuk mulai · Tekan <kbd class="bg-gray-200 px-3 py-1 rounded font-mono">ESC</kbd> untuk berhenti</p>
            </div>
        </div>
    `;
}

async function startTest() {
    state.screen = 'tes';
    renderScreen();
    
    // Reset state
    state.userInput = '';
    state.currentIndex = 0;
    state.correctChars = 0;
    state.incorrectChars = 0;
    state.startTime = Date.now();
    state.finished = false;
    
    // Load random sentence
    try {
        const kataList = await fetch('/api/kata').then(r => r.json());
        const randomKata = kataList[Math.floor(Math.random() * kataList.length)];
        state.testText = randomKata.kata;
        
        displayText();
        startTimer();
        setupInput();
    } catch (error) {
        console.error('Error loading test text:', error);
        alert('Gagal memuat teks. Kembali ke home.');
        navigateTo('home');
    }
}

function displayText() {
    const display = document.getElementById('text-display');
    display.innerHTML = state.testText.split('').map((char, i) => {
        let className = 'char pending';
        
        if (i < state.userInput.length) {
            className = state.userInput[i] === char ? 'char correct' : 'char incorrect';
        } else if (i === state.userInput.length) {
            className = 'char current';
        }
        
        return `<span class="${className}">${char === ' ' ? '&nbsp;' : char}</span>`;
    }).join('');
}

function setupInput() {
    const input = document.getElementById('hidden-input');
    input.value = '';
    input.focus();
    
    input.addEventListener('input', (e) => {
        if (state.finished) return;
        
        state.userInput = e.target.value;
        
        // Count correct/incorrect
        state.correctChars = 0;
        state.incorrectChars = 0;
        
        for (let i = 0; i < state.userInput.length; i++) {
            if (state.userInput[i] === state.testText[i]) {
                state.correctChars++;
            } else {
                state.incorrectChars++;
            }
        }
        
        displayText();
        updateStats();
        
        // Check if finished
        if (state.userInput.length === state.testText.length && state.correctChars === state.testText.length) {
            endTest();
        }
    });
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (confirm('Yakin ingin berhenti?')) endTest();
        }
    });
}

function startTimer() {
    let timeLeft = state.duration;
    const timerEl = document.getElementById('timer');
    
    state.timer = setInterval(() => {
        timeLeft--;
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        
        if (timeLeft <= 0) endTest();
    }, 1000);
}

function updateStats() {
    const elapsed = (Date.now() - state.startTime) / 1000 / 60;
    const wpm = elapsed > 0 ? Math.round((state.correctChars / 5) / elapsed) : 0;
    const accuracy = state.userInput.length > 0 
        ? ((state.correctChars / state.userInput.length) * 100).toFixed(1) 
        : 100;
    
    document.getElementById('wpm-display').textContent = wpm;
    document.getElementById('accuracy-display').textContent = accuracy;
    document.getElementById('correct-display').textContent = state.correctChars;
    document.getElementById('incorrect-display').textContent = state.incorrectChars;
}

async function endTest() {
    if (state.finished) return;
    state.finished = true;
    
    if (state.timer) clearInterval(state.timer);
    
    const elapsed = (Date.now() - state.startTime) / 1000;
    const elapsedMin = elapsed / 60;
    const wpm = elapsedMin > 0 ? (state.correctChars / 5) / elapsedMin : 0;
    const total = state.correctChars + state.incorrectChars;
    const accuracy = total > 0 ? (state.correctChars / total) * 100 : 0;
    const skor = Math.round(wpm * accuracy * 10);
    
    state.hasil = {
        siswa_id: state.siswa.id,
        durasi: Math.round(elapsed),
        kata_benar: Math.floor(state.correctChars / 5),
        kata_salah: Math.floor(state.incorrectChars / 5),
        wpm: parseFloat(wpm.toFixed(1)),
        akurasi: parseFloat(accuracy.toFixed(1)),
        skor
    };
    
    // Save if not guru
    if (state.siswa.id !== 0) {
        try {
            await fetch('/api/hasil-tes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(state.hasil)
            });
        } catch (error) {
            console.error('Error saving result:', error);
        }
    }
    
    state.screen = 'hasil';
    renderScreen();
    showConfetti();
    startAutoReturn();
}

// ========== HASIL SCREEN ==========
function renderHasil() {
    return `
        <div class="container mx-auto px-4 py-8 max-w-4xl">
            <div id="confetti"></div>
            
            <div class="text-center mb-10">
                <h2 class="text-6xl font-black text-gray-800 mb-3">Hasil Tes</h2>
                <p class="text-2xl text-gray-600">${state.siswa.nama} <span class="text-gray-400">(${state.siswa.kelas_nama})</span></p>
            </div>
            
            <div class="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-10 mb-8 text-white">
                <div class="grid grid-cols-3 gap-8 text-center">
                    <div>
                        <div class="text-7xl font-black mb-2">${state.hasil.wpm}</div>
                        <div class="text-lg opacity-90">WPM</div>
                    </div>
                    <div>
                        <div class="text-7xl font-black mb-2">${state.hasil.akurasi}%</div>
                        <div class="text-lg opacity-90">Akurasi</div>
                    </div>
                    <div>
                        <div class="text-7xl font-black mb-2">${state.hasil.skor}</div>
                        <div class="text-lg opacity-90">Skor</div>
                    </div>
                </div>
            </div>
            
            <div id="rank-notif" class="mb-8"></div>
            
            <div class="grid grid-cols-2 gap-4 mb-6">
                <button onclick="mainLagi()" 
                        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-8 rounded-2xl shadow-xl transform hover:scale-105 transition-all text-lg">
                    🔄 Main Lagi
                </button>
                <button onclick="navigateTo('leaderboard-full')" 
                        class="bg-white hover:bg-gray-50 text-gray-800 font-bold py-5 px-8 rounded-2xl shadow-xl border-2 border-gray-300 transform hover:scale-105 transition-all text-lg">
                    🏆 Leaderboard
                </button>
            </div>
            
            <div class="text-center text-gray-600">
                <p>Kembali ke home dalam <span id="auto-counter" class="font-bold text-blue-600">10</span> detik...</p>
            </div>
        </div>
    `;
}

function showConfetti() {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    const container = document.getElementById('confetti');
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw;
            top: -10px;
            animation: fall ${2 + Math.random() * 2}s linear forwards;
        `;
        container.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4000);
    }
}

function startAutoReturn() {
    let count = 10;
    const interval = setInterval(() => {
        count--;
        const el = document.getElementById('auto-counter');
        if (el) el.textContent = count;
        if (count <= 0) {
            clearInterval(interval);
            navigateTo('home');
        }
    }, 1000);
}

function mainLagi() {
    navigateTo('pilih-siswa');
}

// ========== LEADERBOARD FULL ==========
function renderLeaderboardFull() {
    return `
        <div class="container mx-auto px-4 py-8 max-w-6xl">
            <button onclick="navigateTo('home')" class="mb-6 text-gray-600 hover:text-gray-800 font-semibold inline-flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/50 transition-all">
                <span class="text-2xl">←</span> Kembali
            </button>
            
            <div class="text-center mb-10">
                <h2 class="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 mb-4">
                    🏆 LEADERBOARD
                </h2>
                <p class="text-xl text-gray-600">Ranking Pemain Terbaik</p>
            </div>
            
            <div class="flex justify-center gap-3 mb-8">
                <select id="filter-kelas-lb" onchange="loadFullLeaderboard()" 
                        class="px-8 py-4 rounded-2xl font-bold bg-white shadow-lg cursor-pointer border-none outline-none text-lg">
                    <option value="">Semua Kelas</option>
                </select>
            </div>
            
            <div id="leaderboard-list" class="space-y-4">
                <div class="text-center py-12 text-gray-500">Memuat...</div>
            </div>
        </div>
    `;
}

async function loadFullLeaderboard() {
    try {
        const kelasId = document.getElementById('filter-kelas-lb')?.value || '';
        const url = kelasId ? `/api/leaderboard?kelas_id=${kelasId}&limit=50` : '/api/leaderboard?limit=50';
        const data = await fetch(url).then(r => r.json());
        
        const list = document.getElementById('leaderboard-list');
        if (!data || data.length === 0) {
            list.innerHTML = '<div class="text-center py-12 text-gray-500">Belum ada data</div>';
            return;
        }
        
        list.innerHTML = data.map((item, i) => {
            const medals = ['🥇', '🥈', '🥉'];
            const bgClass = i < 3 
                ? 'bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100 border-3 border-amber-400' 
                : 'bg-white';
            
            return `
                <div class="${bgClass} rounded-2xl p-6 shadow-lg border border-gray-200 transition-all hover:scale-102">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-5 flex-1">
                            <span class="text-4xl font-black ${i < 3 ? 'text-amber-600' : 'text-gray-400'}">
                                ${medals[i] || item.rank}
                            </span>
                            <span class="text-4xl">${item.avatar}</span>
                            <div>
                                <div class="font-black text-2xl text-gray-800">${item.siswa_nama}</div>
                                <div class="text-gray-600 font-semibold">Kelas ${item.kelas_nama}</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-4xl font-black text-amber-600">${item.skor} pts</div>
                            <div class="text-gray-600 font-semibold">${item.wpm} WPM · ${item.akurasi}%</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Load kelas for filter
        if (!state.allKelas.length) {
            state.allKelas = await fetch('/api/kelas').then(r => r.json());
            const select = document.getElementById('filter-kelas-lb');
            if (select) {
                select.innerHTML = '<option value="">Semua Kelas</option>' +
                    state.allKelas.map(k => `<option value="${k.id}">${k.nama}</option>`).join('');
            }
        }
    } catch (error) {
        console.error('Error loading leaderboard:', error);
    }
}

// ========== LOGIN ADMIN ==========
function renderLoginAdmin() {
    return `
        <div class="container mx-auto px-4 py-20 max-w-md">
            <button onclick="navigateTo('home')" class="mb-6 text-gray-600 hover:text-gray-800 font-semibold inline-flex items-center gap-2">
                <span class="text-2xl">←</span> Kembali
            </button>
            
            <div class="bg-white rounded-3xl shadow-2xl p-10">
                <h2 class="text-4xl font-bold text-gray-800 mb-8 text-center">🔐 Login Admin</h2>
                
                <form onsubmit="loginAdmin(event)" class="space-y-6">
                    <div>
                        <label class="block text-gray-700 font-bold mb-3 text-lg">PIN Admin:</label>
                        <input type="password" 
                               id="admin-pin" 
                               maxlength="4"
                               class="w-full px-6 py-5 border-2 border-gray-300 rounded-2xl focus:border-blue-500 focus:outline-none text-4xl text-center mono"
                               placeholder="••••"
                               required>
                    </div>
                    
                    <button type="submit" 
                            class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-5 rounded-2xl shadow-xl transition-all text-xl">
                        MASUK
                    </button>
                    
                    <p class="text-sm text-gray-500 text-center">
                        PIN default: <code class="bg-gray-100 px-3 py-1 rounded font-mono font-bold">1234</code>
                    </p>
                    
                    <div id="login-error" class="hidden text-red-500 text-center font-bold"></div>
                </form>
            </div>
        </div>
    `;
}

async function loginAdmin(e) {
    e.preventDefault();
    const pin = document.getElementById('admin-pin').value;
    const errorDiv = document.getElementById('login-error');
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin })
        });
        
        if (response.ok) {
            alert('🎉 Login berhasil! (Admin dashboard akan ditambahkan)');
            navigateTo('home');
        } else {
            const data = await response.json();
            errorDiv.textContent = data.detail || 'PIN salah!';
            errorDiv.classList.remove('hidden');
            setTimeout(() => errorDiv.classList.add('hidden'), 3000);
        }
    } catch (error) {
        errorDiv.textContent = 'Terjadi kesalahan';
        errorDiv.classList.remove('hidden');
    }
}

// Add CSS animation for confetti
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to { transform: translateY(100vh) rotate(360deg); opacity: 0; }
    }
`;
document.head.appendChild(style);
