/**
 * TYPING TEST PROFESSIONAL - Version 2.0 FINAL
 * ✨ Text tetap, cursor hijau yang gerak (static display)
 * ✨ Salah tetap salah meski dihapus (permanent error tracking)
 * ✨ Scoring dengan penalty (skor = WPM*akurasi - error*penalty)
 * ✨ UI nyaman untuk anak-anak (2.5rem+, spacing 3.5rem+)
 * ✨ Admin history lengkap dengan tanggal & jam
 * ✨ Quote motivasi editable & real-time clock
 */

// ========== GLOBAL STATE ==========
let state = {
    screen: 'home',
    siswa: null,
    allSiswa: [],
    allKelas: [],
    allKata: [],
    settings: {},
    
    // Test state
    testText: '',
    userInput: '',
    currentIndex: 0,
    correctChars: 0,
    totalErrors: 0, // PENTING: Total errors EVER (tidak berkurang meski dihapus)
    startTime: null,
    duration: 60,
    timer: null,
    finished: false,
    
    // Admin
    adminMode: false
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    renderScreen();
    if (state.screen === 'home') {
        loadHomeData();
        startClock();
    }
});

// ========== UTILITY: Clock & Date ==========
function startClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    const dayName = days[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const clockEl = document.getElementById('live-clock');
    const dateEl = document.getElementById('live-date');
    
    if (clockEl) clockEl.textContent = `${hours}:${minutes}:${seconds}`;
    if (dateEl) dateEl.textContent = `${dayName}, ${date} ${month} ${year}`;
}

// ========== NAVIGATION ==========
function navigateTo(screen) {
    state.screen = screen;
    renderScreen();
    
    if (screen === 'home') {
        loadHomeData();
        startClock();
    } else if (screen === 'pilih-siswa') {
        loadSiswa();
    } else if (screen === 'leaderboard-full') {
        loadFullLeaderboard();
    } else if (screen === 'admin') {
        if (!state.adminMode) {
            navigateTo('login-admin');
        } else {
            loadAdminDashboard();
        }
    }
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
    else if (state.screen === 'admin') app.innerHTML = renderAdmin();
}

// ========== HOME SCREEN ==========
function renderHome() {
    return `
        <div class="container mx-auto px-4 py-8 max-w-7xl">
            <!-- Header dengan Jam & Tanggal -->
            <div class="text-center mb-8">
                <div class="text-6xl font-black text-gray-800 mb-2" id="live-clock">00:00:00</div>
                <div class="text-xl text-gray-600 font-semibold mb-8" id="live-date">Loading...</div>
                
                <h1 class="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-4">
                    ⚡ TYPING TEST
                </h1>
                <p class="text-2xl text-gray-600 font-medium mb-6">
                    Uji Kecepatan Mengetik Bahasa Indonesia
                </p>
                
                <!-- Quote Motivasi -->
                <div class="max-w-3xl mx-auto bg-gradient-to-r from-emerald-50 to-blue-50 rounded-3xl p-8 shadow-lg border-2 border-emerald-200 mb-8">
                    <p class="text-2xl text-gray-700 italic font-medium" id="quote-motivasi">
                        "Lebih baik salah daripada tidak mencoba sama sekali"
                    </p>
                </div>
            </div>
            
            <!-- Tombol Mulai -->
            <div class="max-w-2xl mx-auto mb-16">
                <button onclick="navigateTo('pilih-siswa')" 
                        class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-12 px-12 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-200 text-4xl">
                    <span class="text-7xl block mb-3">🎯</span>
                    MULAI TES
                    <span class="block text-xl font-normal mt-3 opacity-90">Klik untuk memulai</span>
                </button>
            </div>
            
            <!-- Stats & Leaderboard -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div class="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl p-8 border-2 border-gray-100">
                    <h3 class="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                        <span class="text-4xl">📊</span>
                        STATISTIK HARI INI
                    </h3>
                    <div class="space-y-5">
                        <div class="flex justify-between items-center py-3 border-b border-gray-200">
                            <span class="text-gray-700 text-lg font-semibold">Total Pemain</span>
                            <span class="text-4xl font-black text-blue-600" id="stat-pemain">0</span>
                        </div>
                        <div class="flex justify-between items-center py-3 border-b border-gray-200">
                            <span class="text-gray-700 text-lg font-semibold">Rata-rata WPM</span>
                            <span class="text-4xl font-black text-emerald-600" id="stat-wpm">0</span>
                        </div>
                        <div class="flex justify-between items-center py-3">
                            <span class="text-gray-700 text-lg font-semibold">Akurasi Terbaik</span>
                            <span class="text-4xl font-black text-purple-600"><span id="stat-akurasi">0</span>%</span>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl p-8 border-2 border-gray-100 lg:col-span-2">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-2xl font-black text-gray-800 flex items-center gap-3">
                            <span class="text-4xl">🏆</span>
                            TOP 5 LEADERBOARD
                        </h3>
                        <button onclick="navigateTo('leaderboard-full')" class="text-blue-600 hover:text-blue-700 font-bold text-lg">
                            Lihat Semua →
                        </button>
                    </div>
                    <div id="leaderboard-preview" class="space-y-4">
                        <div class="text-center py-8 text-gray-400 text-lg">Memuat...</div>
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="text-center space-y-3">
                <button onclick="navigateTo('login-admin')" 
                        class="text-gray-500 hover:text-gray-700 font-bold inline-flex items-center gap-2 px-8 py-4 rounded-2xl hover:bg-white/50 transition-all text-lg">
                    <span class="text-2xl">⚙️</span>
                    Halaman Admin
                </button>
            </div>
        </div>
    `;
}

async function loadHomeData() {
    try {
        // Load settings
        state.settings = await fetch('/api/settings').then(r => r.json());
        const quoteEl = document.getElementById('quote-motivasi');
        if (quoteEl && state.settings.quote_motivasi) {
            quoteEl.textContent = `"${state.settings.quote_motivasi}"`;
        }
        
        // Load stats
        const stats = await fetch('/api/statistik-harian').then(r => r.json());
        document.getElementById('stat-pemain').textContent = stats.total_pemain;
        document.getElementById('stat-wpm').textContent = Math.round(stats.wpm_tertinggi);
        document.getElementById('stat-akurasi').textContent = stats.akurasi_terbaik.toFixed(1);
        
        // Load leaderboard preview
        const leaderboard = await fetch('/api/leaderboard?limit=5').then(r => r.json());
        displayLeaderboardPreview(leaderboard);
        
        // Auto refresh every 30 seconds
        setTimeout(() => {
            if (state.screen === 'home') loadHomeData();
        }, 30000);
    } catch (error) {
        console.error('Error loading home data:', error);
    }
}

function displayLeaderboardPreview(data) {
    const container = document.getElementById('leaderboard-preview');
    if (!data || data.length === 0) {
        container.innerHTML = '<div class="text-center py-8 text-gray-500 text-lg">Belum ada data. Mulai tes pertama kamu!</div>';
        return;
    }
    
    container.innerHTML = data.map((item, i) => {
        const medals = ['🥇', '🥈', '🥉'];
        const bgClass = i < 3 ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300' : 'bg-gray-50 border-2 border-gray-200';
        
        return `
            <div class="flex items-center justify-between p-5 rounded-2xl ${bgClass} transition-all hover:scale-102 shadow-md">
                <div class="flex items-center gap-5 flex-1">
                    <span class="text-5xl font-black ${i < 3 ? 'text-amber-600' : 'text-gray-400'} min-w-[60px] text-center">
                        ${medals[i] || item.rank}
                    </span>
                    <span class="text-4xl">${item.avatar}</span>
                    <div>
                        <div class="font-black text-2xl text-gray-800">${item.siswa_nama}</div>
                        <div class="text-lg text-gray-600 font-semibold">Kelas ${item.kelas_nama}</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-4xl font-black text-amber-600">${item.skor} pts</div>
                    <div class="text-lg text-gray-600 font-semibold">${item.wpm} WPM · ${item.akurasi}%</div>
                </div>
            </div>
        `;
    }).join('');
}

// ========== PILIH SISWA ==========
function renderPilihSiswa() {
    return `
        <div class="container mx-auto px-4 py-8 max-w-6xl">
            <button onclick="navigateTo('home')" class="mb-8 text-gray-600 hover:text-gray-800 font-bold inline-flex items-center gap-3 px-6 py-3 rounded-2xl hover:bg-white/50 transition-all text-lg">
                <span class="text-3xl">←</span> Kembali
            </button>
            
            <div class="text-center mb-12">
                <h2 class="text-7xl font-black text-gray-800 mb-8">Pilih Nama Kamu</h2>
                <div class="inline-flex items-center gap-4 bg-white rounded-3xl px-10 py-5 shadow-xl border-2 border-gray-200">
                    <label class="text-gray-700 font-black text-xl">Kelas:</label>
                    <select id="filter-kelas" onchange="filterSiswa()" 
                            class="bg-transparent border-none outline-none font-black text-blue-600 cursor-pointer text-2xl">
                        <option value="">Semua Kelas</option>
                    </select>
                </div>
            </div>
            
            <div id="siswa-grid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-10">
                <div class="col-span-full text-center py-12 text-gray-500 text-xl">Memuat...</div>
            </div>
            
            <div class="text-center">
                <button onclick="guruIkut()" class="bg-white hover:bg-gray-50 text-gray-800 font-black py-5 px-10 rounded-3xl shadow-xl border-3 border-gray-300 transition-all text-xl">
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
        grid.innerHTML = '<div class="col-span-full text-center py-12 text-gray-500 text-xl">Belum ada siswa</div>';
        return;
    }
    
    grid.innerHTML = siswa.map(s => `
        <button onclick='selectSiswa(${JSON.stringify(s)})' 
                class="bg-white hover:shadow-2xl hover:scale-110 rounded-3xl p-10 text-center transition-all duration-200 border-3 border-gray-200 hover:border-blue-400">
            <div class="text-8xl mb-5">${s.avatar}</div>
            <div class="font-black text-2xl text-gray-800 mb-3">${s.nama}</div>
            <div class="text-xl text-gray-600 font-bold">Kelas ${s.kelas_nama}</div>
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
            <h3 class="text-3xl text-gray-600 mb-3 font-semibold">Pemain:</h3>
            <h2 class="text-6xl font-black text-gray-800 mb-20">
                ${state.siswa.nama} <span class="text-gray-500">(${state.siswa.kelas_nama})</span>
            </h2>
            <p class="text-3xl text-gray-600 mb-10 font-semibold">Bersiap...</p>
            <div id="countdown-num" class="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-12 animate-pulse">3</div>
            <p class="text-2xl text-gray-500 font-semibold">Letakkan jari di keyboard</p>
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

// ========== TES SCREEN (TEXT TETAP, CURSOR GERAK) ==========
function renderTes() {
    return `
        <div class="container mx-auto px-4 py-6 max-w-6xl">
            <div class="flex justify-between items-center mb-8">
                <div class="text-2xl font-black text-gray-700">
                    ${state.siswa.nama} <span class="text-gray-500">(${state.siswa.kelas_nama})</span>
                </div>
                <div class="text-right">
                    <div class="text-lg text-gray-500 font-semibold">Sisa Waktu</div>
                    <div id="timer" class="text-6xl font-black text-red-500 mono">01:00</div>
                </div>
            </div>
            
            <div class="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-12 md:p-16 mb-8 border-2 border-gray-200">
                <!-- TEXT DISPLAY: Tetap di posisinya, yang gerak cuma highlight -->
                <div id="text-display" class="mono text-left mb-10 leading-loose select-none cursor-text" 
                     onclick="document.getElementById('hidden-input').focus()"
                     style="font-size: 2.5rem; line-height: 4rem; min-height: 300px; word-wrap: break-word;">
                </div>
                
                <input type="text" 
                       id="hidden-input" 
                       autocomplete="off"
                       autocapitalize="off"
                       autocorrect="off"
                       spellcheck="false"
                       style="position: absolute; opacity: 0;">
                
                <!-- STATS BAR -->
                <div class="grid grid-cols-4 gap-8 pt-10 border-t-4 border-gray-300">
                    <div class="text-center">
                        <div class="text-5xl font-black text-emerald-500" id="wpm-display">0</div>
                        <div class="text-sm text-gray-600 font-bold mt-2">WPM</div>
                    </div>
                    <div class="text-center">
                        <div class="text-5xl font-black text-blue-500"><span id="accuracy-display">100</span>%</div>
                        <div class="text-sm text-gray-600 font-bold mt-2">AKURASI</div>
                    </div>
                    <div class="text-center">
                        <div class="text-5xl font-black text-purple-500" id="correct-display">0</div>
                        <div class="text-sm text-gray-600 font-bold mt-2">BENAR</div>
                    </div>
                    <div class="text-center">
                        <div class="text-5xl font-black text-red-500" id="error-display">0</div>
                        <div class="text-sm text-gray-600 font-bold mt-2">SALAH</div>
                    </div>
                </div>
            </div>
            
            <div class="text-center text-gray-600 text-lg font-semibold">
                <p>💡 Klik area teks untuk mulai · Tekan <kbd class="bg-gray-300 px-4 py-2 rounded-lg font-mono font-bold">ESC</kbd> untuk berhenti</p>
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
    state.totalErrors = 0; // PENTING: Total error tidak berkurang
    state.startTime = Date.now();
    state.finished = false;
    
    // Load kata untuk generate continuous text
    try {
        state.allKata = await fetch('/api/kata').then(r => r.json());
        generateContinuousText();
        
        displayText();
        startTimer();
        setupInput();
    } catch (error) {
        console.error('Error loading test:', error);
        alert('Gagal memuat teks. Kembali ke home.');
        navigateTo('home');
    }
}

function generateContinuousText() {
    // Generate text yang panjang (multiple sentences)
    let text = '';
    for (let i = 0; i < 10; i++) {
        const randomKata = state.allKata[Math.floor(Math.random() * state.allKata.length)];
        text += randomKata.kata + ' ';
    }
    state.testText = text.trim();
}

function displayText() {
    const display = document.getElementById('text-display');
    const chars = state.testText.split('');
    
    display.innerHTML = chars.map((char, i) => {
        let className = 'char';
        
        if (i < state.userInput.length) {
            // Sudah diketik
            if (state.userInput[i] === char) {
                className += ' correct'; // Hijau
            } else {
                className += ' incorrect'; // Merah
            }
        } else if (i === state.userInput.length) {
            // Current position (cursor)
            className += ' current';
        } else {
            // Belum diketik
            className += ' pending';
        }
        
        return `<span class="${className}">${char === ' ' ? '&nbsp;' : char}</span>`;
    }).join('');
}

function setupInput() {
    const input = document.getElementById('hidden-input');
    input.value = '';
    input.focus();
    
    let previousLength = 0;
    
    input.addEventListener('input', (e) => {
        if (state.finished) return;
        
        const currentInput = e.target.value;
        state.userInput = currentInput;
        
        // Deteksi jika user menghapus karakter (backspace)
        if (currentInput.length < previousLength) {
            // User backspace, tapi error count TIDAK BERKURANG
            // Ini yang diminta: "salah tetap salah"
        } else {
            // User nambah karakter baru
            const newCharIndex = currentInput.length - 1;
            const typedChar = currentInput[newCharIndex];
            const targetChar = state.testText[newCharIndex];
            
            if (typedChar !== targetChar) {
                // SALAH - increment total errors
                state.totalErrors++;
            }
        }
        
        previousLength = currentInput.length;
        
        // Hitung correct chars saat ini
        state.correctChars = 0;
        for (let i = 0; i < state.userInput.length; i++) {
            if (state.userInput[i] === state.testText[i]) {
                state.correctChars++;
            }
        }
        
        displayText();
        updateStats();
        
        // Check if need more text
        if (state.userInput.length >= state.testText.length - 50) {
            // Add more text
            const randomKata = state.allKata[Math.floor(Math.random() * state.allKata.length)];
            state.testText += ' ' + randomKata.kata;
            displayText();
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
    // WPM: characters typed / 5 / minutes elapsed
    const elapsed = (Date.now() - state.startTime) / 1000 / 60;
    const wpm = elapsed > 0 ? Math.round(state.userInput.length / 5 / elapsed) : 0;
    
    // Akurasi: (total typed - total errors) / total typed * 100
    // PENTING: totalErrors tidak berkurang meski dihapus
    const accuracy = state.userInput.length > 0
        ? Math.max(0, ((state.userInput.length - state.totalErrors) / state.userInput.length) * 100).toFixed(1)
        : 100;
    
    document.getElementById('wpm-display').textContent = wpm;
    document.getElementById('accuracy-display').textContent = accuracy;
    document.getElementById('correct-display').textContent = state.correctChars;
    document.getElementById('error-display').textContent = state.totalErrors;
}

async function endTest() {
    if (state.finished) return;
    state.finished = true;
    
    if (state.timer) clearInterval(state.timer);
    
    const elapsed = (Date.now() - state.startTime) / 1000;
    const elapsedMin = elapsed / 60;
    
    // WPM: total characters typed / 5 / minutes
    const wpm = elapsedMin > 0 ? state.userInput.length / 5 / elapsedMin : 0;
    
    // Akurasi: (typed - errors) / typed * 100
    const accuracy = state.userInput.length > 0
        ? Math.max(0, ((state.userInput.length - state.totalErrors) / state.userInput.length) * 100)
        : 0;
    
    // Skor dengan PENALTY: (WPM * akurasi) - (error * penalty)
    const penalty = parseInt(state.settings.penalty_salah || 5);
    const baseScore = wpm * accuracy;
    const penaltyScore = state.totalErrors * penalty;
    const skor = Math.max(0, Math.round(baseScore - penaltyScore));
    
    state.hasil = {
        siswa_id: state.siswa.id,
        durasi: Math.round(elapsed),
        kata_benar: Math.floor(state.correctChars / 5),
        kata_salah: Math.floor(state.totalErrors / 5),
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
        <div class="container mx-auto px-4 py-10 max-w-5xl">
            <div id="confetti"></div>
            
            <div class="text-center mb-12">
                <h2 class="text-7xl font-black text-gray-800 mb-4">🎉 HASIL TES 🎉</h2>
                <p class="text-3xl text-gray-600 font-bold">
                    ${state.siswa.nama} <span class="text-gray-400">(${state.siswa.kelas_nama})</span>
                </p>
            </div>
            
            <div class="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-12 mb-10 text-white">
                <div class="grid grid-cols-3 gap-10 text-center">
                    <div class="border-r-4 border-white/30">
                        <div class="text-8xl font-black mb-3">${state.hasil.wpm.toFixed(0)}</div>
                        <div class="text-2xl opacity-90 font-bold">WPM</div>
                    </div>
                    <div class="border-r-4 border-white/30">
                        <div class="text-8xl font-black mb-3">${state.hasil.akurasi.toFixed(1)}%</div>
                        <div class="text-2xl opacity-90 font-bold">Akurasi</div>
                    </div>
                    <div>
                        <div class="text-8xl font-black mb-3">${state.hasil.skor}</div>
                        <div class="text-2xl opacity-90 font-bold">SKOR</div>
                    </div>
                </div>
                
                <div class="mt-8 pt-8 border-t-4 border-white/30 text-center">
                    <p class="text-xl opacity-90">Total Karakter: <span class="font-black">${state.userInput.length}</span></p>
                    <p class="text-xl opacity-90">Total Salah: <span class="font-black">${state.totalErrors}</span> (Penalty: -${state.totalErrors * (parseInt(state.settings.penalty_salah || 5))} poin)</p>
                </div>
            </div>
            
            <div id="rank-notif" class="mb-10"></div>
            
            <div class="grid grid-cols-2 gap-6 mb-8">
                <button onclick="mainLagi()" 
                        class="bg-blue-600 hover:bg-blue-700 text-white font-black py-6 px-10 rounded-3xl shadow-xl transform hover:scale-105 transition-all text-2xl">
                    🔄 Main Lagi
                </button>
                <button onclick="navigateTo('leaderboard-full')" 
                        class="bg-white hover:bg-gray-50 text-gray-800 font-black py-6 px-10 rounded-3xl shadow-xl border-3 border-gray-300 transform hover:scale-105 transition-all text-2xl">
                    🏆 Leaderboard
                </button>
            </div>
            
            <div class="text-center text-gray-600 text-xl font-bold">
                <p>Kembali ke home dalam <span id="auto-counter" class="font-black text-blue-600 text-3xl">10</span> detik...</p>
            </div>
        </div>
    `;
}

function showConfetti() {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    const container = document.getElementById('confetti');
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 12px;
            height: 12px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw;
            top: -20px;
            animation: fall ${2 + Math.random() * 2}s linear forwards;
            z-index: 9999;
        `;
        container.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4500);
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
    // Langsung mulai countdown dengan siswa yang sama (tidak perlu pilih ulang)
    startCountdown();
}

// ========== LEADERBOARD FULL ==========
function renderLeaderboardFull() {
    return `
        <div class="container mx-auto px-4 py-10 max-w-6xl">
            <button onclick="navigateTo('home')" class="mb-8 text-gray-600 hover:text-gray-800 font-bold inline-flex items-center gap-3 px-6 py-3 rounded-2xl hover:bg-white/50 transition-all text-xl">
                <span class="text-3xl">←</span> Kembali
            </button>
            
            <div class="text-center mb-12">
                <h2 class="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 mb-4">
                    🏆 LEADERBOARD
                </h2>
                <p class="text-2xl text-gray-600 font-bold">Ranking Pemain Terbaik</p>
            </div>
            
            <div class="flex justify-center gap-4 mb-10">
                <select id="filter-kelas-lb" onchange="loadFullLeaderboard()" 
                        class="px-10 py-5 rounded-3xl font-black bg-white shadow-xl cursor-pointer border-2 border-gray-300 outline-none text-2xl">
                    <option value="">Semua Kelas</option>
                </select>
            </div>
            
            <div id="leaderboard-list" class="space-y-5">
                <div class="text-center py-16 text-gray-500 text-2xl">Memuat...</div>
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
            list.innerHTML = '<div class="text-center py-16 text-gray-500 text-2xl">Belum ada data</div>';
            return;
        }
        
        list.innerHTML = data.map((item, i) => {
            const medals = ['🥇', '🥈', '🥉'];
            const bgClass = i < 3 
                ? 'bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100 border-4 border-amber-400 shadow-2xl' 
                : 'bg-white border-2 border-gray-300 shadow-lg';
            
            return `
                <div class="${bgClass} rounded-3xl p-8 transition-all hover:scale-102">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-6 flex-1">
                            <span class="text-6xl font-black ${i < 3 ? 'text-amber-600' : 'text-gray-400'} min-w-[80px] text-center">
                                ${medals[i] || item.rank}
                            </span>
                            <span class="text-5xl">${item.avatar}</span>
                            <div>
                                <div class="font-black text-3xl text-gray-800">${item.siswa_nama}</div>
                                <div class="text-xl text-gray-600 font-bold">Kelas ${item.kelas_nama}</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-5xl font-black text-amber-600 mb-2">${item.skor} POIN</div>
                            <div class="text-xl text-gray-600 font-bold">${item.wpm} WPM · ${item.akurasi}% Akurasi</div>
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
            <button onclick="navigateTo('home')" class="mb-8 text-gray-600 hover:text-gray-800 font-bold inline-flex items-center gap-2 text-xl">
                <span class="text-3xl">←</span> Kembali
            </button>
            
            <div class="bg-white rounded-3xl shadow-2xl p-12">
                <h2 class="text-5xl font-black text-gray-800 mb-10 text-center">🔐 Login Admin</h2>
                
                <form onsubmit="loginAdmin(event)" class="space-y-8">
                    <div>
                        <label class="block text-gray-700 font-black mb-4 text-2xl">PIN Admin:</label>
                        <input type="password" 
                               id="admin-pin" 
                               maxlength="4"
                               class="w-full px-8 py-6 border-4 border-gray-300 rounded-3xl focus:border-blue-500 focus:outline-none text-5xl text-center mono"
                               placeholder="••••"
                               required>
                    </div>
                    
                    <button type="submit" 
                            class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-6 rounded-3xl shadow-2xl transition-all text-2xl">
                        MASUK
                    </button>
                    
                    <p class="text-lg text-gray-500 text-center font-semibold">
                        PIN default: <code class="bg-gray-200 px-4 py-2 rounded-xl font-mono font-black text-xl">1234</code>
                    </p>
                    
                    <div id="login-error" class="hidden text-red-500 text-center font-black text-xl"></div>
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
            state.adminMode = true;
            navigateTo('admin');
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

// ========== ADMIN DASHBOARD ==========
function renderAdmin() {
    return `
        <div class="container mx-auto px-4 py-8 max-w-7xl">
            <div class="flex justify-between items-center mb-10">
                <h1 class="text-6xl font-black text-gray-800">Admin Dashboard</h1>
                <button onclick="state.adminMode = false; navigateTo('home')" 
                        class="bg-red-500 hover:bg-red-600 text-white font-black py-4 px-8 rounded-2xl text-xl">
                    Logout
                </button>
            </div>
            
            <!-- Tabs -->
            <div class="flex gap-3 mb-8 overflow-x-auto">
                <button onclick="showAdminTab('history')" id="tab-history" 
                        class="px-8 py-4 rounded-2xl font-black transition-all text-xl bg-blue-600 text-white">
                    📜 History Tes
                </button>
                <button onclick="showAdminTab('settings')" id="tab-settings" 
                        class="px-8 py-4 rounded-2xl font-black transition-all text-xl bg-gray-200 text-gray-700">
                    ⚙️ Pengaturan
                </button>
                <button onclick="showAdminTab('siswa')" id="tab-siswa" 
                        class="px-8 py-4 rounded-2xl font-black transition-all text-xl bg-gray-200 text-gray-700">
                    👥 Siswa & Kelas
                </button>
                <button onclick="showAdminTab('kata')" id="tab-kata" 
                        class="px-8 py-4 rounded-2xl font-black transition-all text-xl bg-gray-200 text-gray-700">
                    📝 Kalimat Tes
                </button>
            </div>
            
            <!-- Content -->
            <div id="admin-content" class="bg-white rounded-3xl shadow-xl p-10 border-2 border-gray-200">
                <div class="text-center py-16 text-gray-500 text-2xl">Memuat...</div>
            </div>
        </div>
    `;
}

async function loadAdminDashboard() {
    showAdminTab('history');
}

async function showAdminTab(tab) {
    // Update tab buttons
    document.querySelectorAll('[id^="tab-"]').forEach(btn => {
        btn.className = 'px-8 py-4 rounded-2xl font-black transition-all text-xl bg-gray-200 text-gray-700';
    });
    document.getElementById(`tab-${tab}`).className = 'px-8 py-4 rounded-2xl font-black transition-all text-xl bg-blue-600 text-white';
    
    const content = document.getElementById('admin-content');
    
    if (tab === 'history') {
        content.innerHTML = '<div class="text-center py-16 text-2xl">Memuat history...</div>';
        await loadHistoryTab();
    } else if (tab === 'settings') {
        content.innerHTML = '<div class="text-center py-16 text-2xl">Memuat settings...</div>';
        await loadSettingsTab();
    } else if (tab === 'siswa') {
        content.innerHTML = '<div class="text-center py-16 text-2xl">Tab Siswa & Kelas (Coming Soon)</div>';
    } else if (tab === 'kata') {
        content.innerHTML = '<div class="text-center py-16 text-2xl">Tab Kalimat Tes (Coming Soon)</div>';
    }
}

async function loadHistoryTab() {
    try {
        // Get all results with siswa info
        const response = await fetch('/api/hasil-tes-all');
        let results = [];
        
        if (response.ok) {
            results = await response.json();
        }
        
        const content = document.getElementById('admin-content');
        
        if (!results || results.length === 0) {
            content.innerHTML = '<div class="text-center py-16 text-gray-500 text-2xl">Belum ada history tes</div>';
            return;
        }
        
        content.innerHTML = `
            <h3 class="text-4xl font-black text-gray-800 mb-8">📜 History Semua Tes</h3>
            
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="bg-gray-100 border-b-4 border-gray-300">
                            <th class="px-6 py-5 text-left font-black text-xl">Tanggal & Jam</th>
                            <th class="px-6 py-5 text-left font-black text-xl">Nama</th>
                            <th class="px-6 py-5 text-left font-black text-xl">Kelas</th>
                            <th class="px-6 py-5 text-center font-black text-xl">WPM</th>
                            <th class="px-6 py-5 text-center font-black text-xl">Akurasi</th>
                            <th class="px-6 py-5 text-center font-black text-xl">Skor</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${results.map(r => {
                            const date = new Date(r.created_at);
                            const dateStr = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
                            const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                            
                            return `
                                <tr class="border-b-2 border-gray-200 hover:bg-gray-50 transition-all">
                                    <td class="px-6 py-5 font-semibold text-lg">
                                        <div class="text-gray-800">${dateStr}</div>
                                        <div class="text-gray-600 text-base">${timeStr}</div>
                                    </td>
                                    <td class="px-6 py-5 font-bold text-xl text-gray-800">${r.siswa_nama}</td>
                                    <td class="px-6 py-5 font-semibold text-lg text-gray-600">${r.kelas_nama}</td>
                                    <td class="px-6 py-5 text-center font-black text-2xl text-emerald-600">${r.wpm}</td>
                                    <td class="px-6 py-5 text-center font-black text-2xl text-blue-600">${r.akurasi}%</td>
                                    <td class="px-6 py-5 text-center font-black text-2xl text-amber-600">${r.skor}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        console.error('Error loading history:', error);
        const content = document.getElementById('admin-content');
        content.innerHTML = '<div class="text-center py-16 text-red-500 text-2xl">Error memuat history</div>';
    }
}

async function loadSettingsTab() {
    try {
        state.settings = await fetch('/api/settings').then(r => r.json());
        
        const content = document.getElementById('admin-content');
        content.innerHTML = `
            <h3 class="text-4xl font-black text-gray-800 mb-8">⚙️ Pengaturan Aplikasi</h3>
            
            <form onsubmit="saveSettings(event)" class="space-y-8">
                <div class="bg-blue-50 border-2 border-blue-300 rounded-3xl p-8">
                    <label class="block text-gray-800 font-black mb-4 text-2xl">💬 Quote Motivasi (di Home):</label>
                    <textarea id="setting-quote" rows="3" 
                              class="w-full px-6 py-4 border-4 border-gray-300 rounded-2xl focus:border-blue-500 focus:outline-none text-2xl"
                              placeholder="Masukkan quote motivasi...">${state.settings.quote_motivasi || ''}</textarea>
                    <p class="text-gray-600 mt-3 text-lg">Contoh: "Lebih baik salah daripada tidak mencoba sama sekali"</p>
                </div>
                
                <div class="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-8">
                    <label class="block text-gray-800 font-black mb-4 text-2xl">⏱️ Durasi Tes (detik):</label>
                    <input type="number" id="setting-durasi" min="30" max="300" 
                           class="w-full px-6 py-4 border-4 border-gray-300 rounded-2xl focus:border-blue-500 focus:outline-none text-3xl font-bold text-center"
                           value="${state.settings.durasi_tes || 60}">
                </div>
                
                <div class="bg-red-50 border-2 border-red-300 rounded-3xl p-8">
                    <label class="block text-gray-800 font-black mb-4 text-2xl">❌ Penalty per Kesalahan (poin):</label>
                    <input type="number" id="setting-penalty" min="0" max="50" 
                           class="w-full px-6 py-4 border-4 border-gray-300 rounded-2xl focus:border-blue-500 focus:outline-none text-3xl font-bold text-center"
                           value="${state.settings.penalty_salah || 5}">
                    <p class="text-gray-600 mt-3 text-lg">Setiap karakter salah mengurangi skor sebanyak ini</p>
                </div>
                
                <button type="submit" 
                        class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-6 rounded-3xl shadow-2xl transition-all text-3xl">
                    💾 SIMPAN PENGATURAN
                </button>
            </form>
        `;
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

async function saveSettings(e) {
    e.preventDefault();
    
    const quote = document.getElementById('setting-quote').value;
    const durasi = document.getElementById('setting-durasi').value;
    const penalty = document.getElementById('setting-penalty').value;
    
    try {
        await fetch('/api/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: 'quote_motivasi', value: quote })
        });
        
        await fetch('/api/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: 'durasi_tes', value: durasi })
        });
        
        await fetch('/api/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: 'penalty_salah', value: penalty })
        });
        
        alert('✅ Pengaturan berhasil disimpan!');
        state.settings = await fetch('/api/settings').then(r => r.json());
    } catch (error) {
        console.error('Error saving settings:', error);
        alert('❌ Gagal menyimpan pengaturan');
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to { transform: translateY(100vh) rotate(360deg); opacity: 0; }
    }
    
    .char.correct { color: #10B981; font-weight: 700; }
    .char.incorrect { color: #EF4444; background: rgba(239, 68, 68, 0.2); border-radius: 4px; font-weight: 700; }
    .char.current { 
        background: #3B82F6; 
        color: white; 
        border-radius: 4px; 
        padding: 2px 4px;
        animation: blink 0.8s infinite;
        font-weight: 700;
    }
    .char.pending { color: #9CA3AF; }
    
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0.6; }
    }
`;
document.head.appendChild(style);
