// 1. URL DATABASE FIREBASE KAMU (Sama seperti di script.js)
const URL_DATABASE = "https://valo-discord-db-default-rtdb.asia-southeast1.firebasedatabase.app/members.json";

// 2. TANGKAP TOMBOL SUBMIT FORMULIR
document.getElementById("form-member").addEventListener("submit", async function(event) {
    event.preventDefault(); // Mencegah halaman refresh otomatis saat tombol diklik

    // Ambil data yang diketik user di form
    const namaBaru = document.getElementById("input-nama").value;
    const roleBaru = document.getElementById("input-role").value;
    const gamesBaru = document.getElementById("input-games").value;
    const bioBaru = document.getElementById("input-bio").value;
    const avatarBaru = document.getElementById("input-avatar").value;

    // Dapatkan tanggal hari ini otomatis
    const tanggalHariIni = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    // Bungkus data menjadi format JSON
    const dataMemberBaru = {
        nama: namaBaru,
        role: roleBaru,
        games: gamesBaru,
        bio: bioBaru,
        avatarSeed: avatarBaru,
        joinDate: tanggalHariIni
    };

    try {
        // Kirim data secara LIVE ke Firebase menggunakan metode POST
        const respon = await fetch(URL_DATABASE, {
            method: "POST", // Metode POST artinya "menambah/menulis data baru" ke database
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataMemberBaru)
        });

        if (respon.ok) {
            // Tampilkan pesan sukses di layar
            document.getElementById("pesan-sukses").style.display = "block";
            // Bersihkan isi formulir agar bisa diisi orang lain lagi
            document.getElementById("form-member").reset();
            
            // Sembunyikan kembali pesan sukses setelah 3 detik
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
