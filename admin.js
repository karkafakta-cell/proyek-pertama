// 1. URL DATABASE FIREBASE KAMU
const URL_DATABASE = "https://valo-discord-db-default-rtdb.asia-southeast1.firebasedatabase.app/members.json";

// ============================================================
// 🌟 FITUR 1: LOGIKA DROPDOWN GAME DINAMIS
// ============================================================
function cekPilihanGame() {
    const pilihan = document.getElementById("select-games").value;
    const kotakInputManual = document.getElementById("box-game-lainnya");
    const inputManual = document.getElementById("input-game-manual");

    if (pilihan === "lainnya") {
        kotakInputManual.style.display = "block";
        inputManual.required = true;
    } else {
        kotakInputManual.style.display = "none";
        inputManual.required = false;
        inputManual.value = "";
    }
}

// ============================================================
// 🌟 FITUR 2: BUKA KUNCI ROLE JIKA NAMA ADALAH OWNER / DEV RAHASIA
// ============================================================
function cekNama() {
    const nama = document.getElementById("input-nama").value.toLowerCase();
    const inputRole = document.getElementById("input-role");

    if (nama === "fia_owner" || nama === "dev_imut") {
        inputRole.disabled = false;
        inputRole.style.borderColor = "#228be6";
        if (inputRole.value === "Member") {
            inputRole.value = "";
        }
    }
}

// ============================================================
// 📥 PROSES SUBMIT & PENGIRIMAN DATA FORMULIR KE FIREBASE
// ============================================================
document.getElementById("form-member").addEventListener("submit", async function(event) {
    event.preventDefault(); // Mencegah halaman refresh otomatis

    const namaBaru = document.getElementById("input-nama").value;
    const roleBaru = document.getElementById("input-role").value;
    const bioBaru = document.getElementById("input-bio").value;
    
    // 🌟 PERBAIKAN 1: Menangkap file gambar asli dari File Explorer
    const fileGambar = document.getElementById("input-avatar-file").files[0];

    // Logika menentukan isi game favorit
    const gameDropdown = document.getElementById("select-games").value;
    let gamesFinal = gameDropdown;
    if (gameDropdown === "lainnya") {
        gamesFinal = document.getElementById("input-game-manual").value;
    }

    const tanggalHariIni = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    // Struktur dasar data awal
    const dataMemberBaru = {
        nama: namaBaru,
        role: roleBaru,
        games: gamesFinal,
        bio: bioBaru,
        avatarSeed: "", // Sengaja dikosongkan dulu, nanti diisi oleh pembaca file di bawah
        joinDate: tanggalHariIni
    };

    // Jaga-jaga jika user lupa memilih foto di galeri
    if (!fileGambar) {
        alert("Silakan pilih foto profil terlebih dahulu!");
        return;
    }

    // 🌟 PERBAIKAN 2: Proses konversi file gambar galeri menjadi kode teks (Base64) secara otomatis
    const reader = new FileReader();
    reader.readAsDataURL(fileGambar);
    
    reader.onloadend = async function() {
        const fotoDalamBentukTeks = reader.result;
        dataMemberBaru.avatarSeed = fotoDalamBentukTeks; // Masukkan teks gambar ke objek data

        try {
            const respon = await fetch(URL_DATABASE, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataMemberBaru)
            });

            if (respon.ok) {
                // Tampilkan pesan sukses di layar
                document.getElementById("pesan-sukses").style.display = "block";
                document.getElementById("form-member").reset();
                
                // Kembalikan form ke kondisi terkunci normal (default) setelah beres submit
                document.getElementById("input-role").disabled = true;
                document.getElementById("input-role").value = "Member";
                document.getElementById("box-game-lainnya").style.display = "none";

                setTimeout(() => {
                    document.getElementById("pesan-sukses").style.display = "none";
                }, 3000);
            } else {
                alert("Gagal menyimpan ke database cloud!");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan koneksi!");
        }
    }; // 🌟 PERBAIKAN 3: Penutup fungsi FileReader
});
