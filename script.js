// 1. URL DATABASE FIREBASE UTAMAMU
const URL_DATABASE = "https://valo-discord-db-default-rtdb.asia-southeast1.firebasedatabase.app/members.json";

// 2. FUNGSI UNTUK MENGAMBIL DATA DARI FIREBASE CLOUD
async function ambilDataDariDatabase() {
    const gridContainer = document.getElementById("grid-member");
    gridContainer.innerHTML = "<p style='color: #228be6;'>Menghubungkan ke database cloud...</p>";

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
        // 🌟 LOGIKA CETAK KARTU ALA DISCORD PROFILE (GLASSMORPHISM)
        // ============================================================
        Object.keys(dataJson).forEach((key) => {
            const member = dataJson[key];
            if (!member || !member.nama) return;

            const kartu = document.createElement("div");
            kartu.className = "card-member";
            kartu.onclick = () => bukaProfil(member);

            // LOGIKA AVATAR SUPER PINTAR:
            let urlAvatar = member.avatarSeed;
            if (!urlAvatar) {
                // Jika data foto kosong, kasih foto siluet profil abu-abu bawaan
                urlAvatar = "https://w3schools.com";
            } else if (urlAvatar.startsWith("data:image") || urlAvatar.startsWith("http")) {
                // Sakti! Jika isinya FOTO GALERI (Base64) atau LINK INTERNET, gunakan langsung gambarnya!
                urlAvatar = member.avatarSeed;
            } else {
                // Jika isinya hanya ketikan teks biasa, buat jadi robot otomatis versi 9.x yang aktif
                urlAvatar = `https://dicebear.com{member.avatarSeed}`;
            }

            // 🧠 LOGIKA PINTAR PEMECAH KAPSUL GAME DISCORD:
            // Kita pecah teks game (misal: "Valorant, Roblox") berdasarkan tanda koma menjadi daftar terpisah
            const daftarGame = member.games ? member.games.split(",") : [];
            let htmlKapsulGame = `<div class="game-collection">`;

            if (daftarGame.length > 0 && member.games !== "") {
                daftarGame.forEach((namaGame) => {
                    const gameBersih = namaGame.trim(); // Bersihkan spasi sisa di depan/belakang teks
                    const gameKecil = gameBersih.toLowerCase();
                    
                    // Deteksi warna background kapsul otomatis berdasarkan nama gamenya
                    let kelasWarna = "bg-gamelainnya";
                    if (gameKecil.includes("valorant")) kelasWarna = "bg-valorant";
                    else if (gameKecil.includes("roblox")) kelasWarna = "bg-roblox";
                    else if (gameKecil.includes("minecraft")) kelasWarna = "bg-minecraft";
                    else if (gameKecil.includes("mobile legend")) kelasWarna = "bg-mobilelegends";

                    // Gabungkan menjadi tag badge bergaya Discord
                    htmlKapsulGame += `<span class="badge-game ${kelasWarna}">${gameBersih}</span>`;
                });
            } else {
                htmlKapsulGame += `<span class="badge-game bg-gamelainnya">-</span>`;
            }
            htmlKapsulGame += `</div>`;

            // Cetak struktur kartu baru ke halaman utama
            kartu.innerHTML = `
                <img src="${urlAvatar}" alt="Avatar" class="avatar">
                <h4>${member.nama}</h4>
                <p class="role">${member.role || "Member"}</p>
                
                <!-- 🔽 KAPSUL GAME DISCORD AUTOMATIC GENERATOR 🔽 -->
                ${htmlKapsulGame}
                
                <button class="btn-detail">Lihat Profil</button>
            `;
            
            gridContainer.appendChild(kartu);
        });
        // ============================================================

    } catch (error) {
        console.error("Gagal koneksi ke database:", error);
        gridContainer.innerHTML = "<p style='color: #fa5252; font-weight: bold;'>Gagal menyambungkan ke database asli!</p>";
    }
}

// 🌟 TIMPA FUNGSI POP-UP DETAIL PROFIL YANG LAMA DENGAN INI:
function bukaProfil(member) {
    const modal = document.getElementById("modal-profil");
    
    // 1. Logika penentuan foto (Sama persis seperti logika di kartu depan)
    let urlAvatar = member.avatarSeed;
    if (!urlAvatar) {
        urlAvatar = "https://w3schools.com";
    } else if (urlAvatar.startsWith("data:image") || urlAvatar.startsWith("http")) {
        urlAvatar = member.avatarSeed;
    } else {
        urlAvatar = `https://dicebear.com{member.avatarSeed}`;
    }

    // 2. Tembakkan link foto ke elemen gambar di HTML modal yang baru kita buat
    document.getElementById("modal-avatar").src = urlAvatar;
    
    // 3. Masukkan data teks seperti biasa
    document.getElementById("modal-nama").innerText = member.nama || "-";
    document.getElementById("modal-role").innerText = member.role || "-";
    document.getElementById("modal-games").innerText = member.games || "-";
    document.getElementById("modal-bio").innerText = member.bio || "-";
    document.getElementById("modal-join").innerText = member.joinDate || "-";
    
    modal.style.display = "block";
}


function tutupProfil() {
    document.getElementById("modal-profil").style.display = "none";
}

// Jalankan fungsi penarikan data cloud saat website dibuka pertama kali
ambilDataDariDatabase();
