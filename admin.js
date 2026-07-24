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

    const namaBaru = document.getElementById("input-nama").value.trim(); // Bersihkan spasi depan belakang
    const roleBaru = document.getElementById("input-role").value;
    
    // Ambil teks bio, bersihkan spasi, dan cek jika kosong pilih acak!
    let bioBaru = document.getElementById("input-bio").value.trim();
    if (bioBaru === "") {
        const kumpulanBioKocak = [
            "Turu nomor 2, Mabar nomor 1! 🎮",
            "Maju paling depan, mati paling awal. Awokwkaok. 💀",
            "Cuma anak Discord biasa yang hobi nginep di Voice Channel. 🍿",
            "Sorry klo noob, pingnya ga ngotak anying. 📶",
            "Ayo main, having fun ajahhh. 😊✨",
            "Banggg, pungut ak bangg... 🥺👉👈"
        ];
        const angkaAcak = Math.floor(Math.random() * kumpulanBioKocak.length);
        bioBaru = kumpulanBioKocak[angkaAcak];
    }

    // Menangkap nilai input PIN rahasia yang diketik saat daftar
    const pinBaru = document.getElementById("input-pin").value;

    // Menangkap file gambar asli dari File Explorer
    const fileGambar = document.getElementById("input-avatar-file").files[0];

    // Logika menentukan isi game favorit
    const gameDropdown = document.getElementById("select-games").value;
    let gamesFinal = gameDropdown;
    if (gameDropdown === "lainnya") {
        gamesFinal = document.getElementById("input-game-manual").value;
    }

    const tanggalHariIni = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    // Jaga-jaga jika user lupa memilih foto di galeri
    if (!fileGambar) {
        alert("Silakan pilih foto profil terlebih dahulu!");
        return;
    }

    // Struktur dasar data awal
    const dataMemberBaru = {
        nama: namaBaru,
        role: roleBaru,
        games: gamesFinal,
        bio: bioBaru, 
        avatarSeed: "", 
        pin: pinBaru, 
        joinDate: tanggalHariIni
    };

    try {
        // 🌟 KODE BARU: 1. Ambil data dari Firebase untuk dicek duplikatnya
        const cekRespon = await fetch(URL_DATABASE);
        const dataJson = await cekRespon.json();

        let namaSudahAda = false;

        // Sisir nama satu per satu (Gunakan .toLowerCase() agar huruf besar-kecil dideteksi sama)
        if (dataJson) {
            Object.keys(dataJson).forEach((key) => {
                if (dataJson[key].nama.toLowerCase() === namaBaru.toLowerCase()) {
                    namaSudahAda = true;
                }
            });
        }

        // 🌟 KODE BARU: 2. Jika nama kembar ditemukan, langsung batalkan registrasi!
        if (namaSudahAda) {
            alert(`❌ Nama "${namaBaru}" sudah terdaftar di website! Silakan gunakan nama Discord lain.`);
            return; // Hentikan script di sini
        }

        // 3. Jika nama murni unik, jalankan FileReader untuk memproses gambar
        const reader = new FileReader();
        reader.readAsDataURL(fileGambar);
        
        reader.onloadend = async function() {
            const fotoDalamBentukTeks = reader.result;
            dataMemberBaru.avatarSeed = fotoDalamBentukTeks;

            // Kirim data ke Firebase cloud
            const respon = await fetch(URL_DATABASE, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataMemberBaru)
            });

            if (respon.ok) {
                document.getElementById("pesan-sukses").style.display = "block";
                document.getElementById("form-member").reset();
                
                document.getElementById("input-role").disabled = true;
                document.getElementById("input-role").value = "Member";
                document.getElementById("box-game-lainnya").style.display = "none";

                setTimeout(() => {
                    document.getElementById("pesan-sukses").style.display = "none";
                }, 3000);
            } else {
                alert("Gagal menyimpan ke database cloud!");
            }
        }; 

    } catch (error) {
        console.error("Error:", error);
        alert("Terjadi kesalahan koneksi saat memeriksa nama!");
    }
});