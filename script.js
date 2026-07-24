// 1. URL DATABASE FIREBASE UTAMAMU
const URL_DATABASE = "https://valo-discord-db-default-rtdb.asia-southeast1.firebasedatabase.app/members.json";

// 2. FUNGSI UNTUK MENGAMBIL DATA (FETCHING) DARI DATABASE ASLI
async function ambilDataDariDatabase() {
    const gridContainer = document.getElementById("grid-member");
    gridContainer.innerHTML = "<p style='color: #00ffcc;'>Menghubungkan ke database cloud...</p>";

    try {
        const respon = await fetch(URL_DATABASE);
        const dataJson = await respon.json();

        // Bersihkan tulisan loading
        gridContainer.innerHTML = "";

        if (!dataJson) {
            gridContainer.innerHTML = "<p style='color: #ff007f;'>Database kosong! Tambahkan data lewat halaman admin.</p>";
            return;
        }

        // ============================================================
        // 🔽 DI SINI LETAK KODE YANG KAMU TANYAKAN TADI TEMPATNYA 🔽
        // ============================================================
// HAPUS logika let urlAvatar yang lama, lalu PASTE versi baru ini di dalam kartu.innerHTML kalian:

    Object.keys(dataJson).forEach((key) => {
         const member = dataJson[key];
        if (!member || !member.nama) return;

        const kartu = document.createElement("div");
        kartu.className = "card-member";
        kartu.onclick = () => bukaProfil(member);

        // 🌟 LOGIKA AVATAR BARU: Jika isinya link internet (http) pakai linknya, jika teks biasa pakai API bottts terbaru
        let urlAvatar = member.avatarSeed;
        if (!urlAvatar || !urlAvatar.startsWith("http")) {
        // Kita pakai versi API Dicebear terbaru (/9.x/bottts/svg) agar gambarnya dijamin muncul
        urlAvatar = `https://dicebear.com{member.avatarSeed || 'default'}`;
    }

    kartu.innerHTML = `
        <img src="${urlAvatar}" alt="Avatar" class="avatar">
        <h4>${member.nama}</h4>
        <p class="role">${member.role}</p>
        <button class="btn-detail">Lihat Profil</button>
    `;
    
    gridContainer.appendChild(kartu);
});

        // ============================================================
        // 🔼 BATAS KODE PERUBAHAN 🔼
        // ============================================================

    } catch (error) {
        console.error("Gagal koneksi ke database:", error);
        gridContainer.innerHTML = "<p style='color: #ff007f;'>Gagal menyambungkan ke database asli!</p>";
    }
}

// 3. FUNGSI POP-UP DETAIL
function bukaProfil(member) {
    const modal = document.getElementById("modal-profil");
    
    document.getElementById("modal-nama").innerText = member.nama;
    document.getElementById("modal-role").innerText = member.role;
    document.getElementById("modal-games").innerText = member.games;
    document.getElementById("modal-bio").innerText = member.bio;
    document.getElementById("modal-join").innerText = member.joinDate;
    
    modal.style.display = "block";
}

function tutupProfil() {
    document.getElementById("modal-profil").style.display = "none";
}

// Jalankan fungsi penarikan data cloud saat website dibuka pertama kali
ambilDataDariDatabase();
