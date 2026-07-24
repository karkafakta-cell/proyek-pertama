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
        kotakInputManual.style.display = "block"; // Munculkan kotak teks tambahan
        inputManual.required = true; // Wajib diisi jika pilih lainnya
    } else {
        kotakInputManual.style.display = "none";  // Sembunyikan jika milih game biasa
        inputManual.required = false;
        inputManual.value = ""; // Bersihkan ketikan sisa
    }
}

// ============================================================
// 🌟 FITUR 2: BUKA KUNCI ROLE JIKA NAMA ADALAH OWNER / DEV RAHASIA
// ============================================================
function cekNama() {
    const nama = document.getElementById("input-nama").value.toLowerCase();
    const inputRole = document.getElementById("input-role");

    // Kamu bisa ganti kata "hazfi_owner" atau "dev_ganteng" di bawah ini dengan password rahasia buatanmu!
    if (nama === "hazfi_owner" || nama === "dev_ganteng") {
        inputRole.disabled = false; // Buka gembok kolom role
        inputRole.style.borderColor = "#228be6"; // Ubah border jadi biru tanda aktif
        if (inputRole.value === "Member") {
            inputRole.value = ""; // Kosongkan tulisan "Member" biar kamu bisa ketik Owner/Dev
        }
    } else {
        inputRole.disabled = true; // Kunci kembali jadi member jika nama dihapus/diganti
        inputRole.value = "Member";
        inputRole.style.borderColor = "";
    }
}

// ============================================================
// 📥 PROSES SUBMIT & PENGIRIMAN DATA FORMULIR KE FIREBASE
// ============================================================
document.getElementById("form-member").addEventListener("submit", async function(event) {
    event.preventDefault(); // Mencegah halaman refresh otomatis

    const namaBaru = document.getElementById("input-nama").value;
    const roleBaru = document.getElementById("input-role").value; // Mengambil teks role (bisa Member/Owner/Dev)
    const bioBaru = document.getElementById("input-bio").value;
    const avatarBaru = document.getElementById("input-avatar").value;

    // Logika menentukan isi game favorit (apakah dari dropdown atau dari input manual)
    const gameDropdown = document.getElementById("select-games").value;
    let gamesFinal = gameDropdown;
    
    if (gameDropdown === "lainnya") {
        gamesFinal = document.getElementById("input-game-manual").value; // Ambil isi dari ketikan manual
    }

    const tanggalHariIni = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const dataMemberBaru = {
        nama: namaBaru,
        role: roleBaru,
        games: gamesFinal, // Memakai game final yang sudah diseleksi di atas
        bio: bioBaru,
        avatarSeed: avatarBaru,
        joinDate: tanggalHariIni
    };

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
});
