const URL_DATABASE = "https://firebasedatabase.app";

document.getElementById("form-edit").addEventListener("submit", async function(event) {
    event.preventDefault(); // Mencegah halaman refresh otomatis

    const namaLama = document.getElementById("edit-nama-lama").value.trim();
    const pinInput = document.getElementById("edit-pin").value;
    const namaBaruInput = document.getElementById("edit-nama-baru").value.trim();
    const gameBaru = document.getElementById("edit-games").value;
    const bioBaru = document.getElementById("edit-bio").value.trim();

    try {
        // 1. Tarik semua data dari Firebase untuk divalidasi keamanannya
        const respon = await fetch(URL_DATABASE);
        const dataJson = await respon.json();

        let idDataDitemukan = null;
        let dataMemberLama = null;

        // 2. Cari data member di Firebase berdasarkan nama lama yang diinput
        if (dataJson) {
            Object.keys(dataJson).forEach((key) => {
                if (dataJson[key].nama === namaLama) {
                    idDataDitemukan = key; // Ambil kunci ID unik Firebase-nya
                    dataMemberLama = dataJson[key];
                }
            });
        }

        // Jika nama lama tidak terdaftar di website kalian
        if (!idDataDitemukan) {
            alert("❌ Nama Discord lama tidak ditemukan! Pastikan huruf besar-kecilnya sama persis dengan yang nampang di web.");
            return;
        }

        // 3. VALIDASI PIN KEAMANAN: Cek apakah PIN-mu cocok dengan data saat mendaftar
        if (dataMemberLama.pin !== pinInput) {
            alert("❌ PIN Salah! Kamu dilarang keras mengedit profil milik orang lain.");
            return;
        }

        // Tentukan nama akhir: jika kolom nama baru diisi, pakai nama baru. Jika kosong, pertahankan nama lama.
        let namaFinal = dataMemberLama.nama;
        if (namaBaruInput !== "") {
            namaFinal = namaBaruInput;
        }

        // 4. Jika lolos keamanan PIN, rakit data update terbaru
        const dataUpdate = {
            ...dataMemberLama,       // Pertahankan data permanen (seperti file foto dan tanggal join)
            nama: namaFinal,         // Terapkan nama baru/lama
            games: gameBaru,         // Terapkan game favorit baru
            bio: bioBaru             // Terapkan bio baru
        };

        // Kirim update khusus langsung ke URL ID member tersebut di Firebase (Menggunakan metode PUT)
        const URL_UPDATE_MEMBER = `https://firebasedatabase.app{idDataDitemukan}.json`;
        
        const responUpdate = await fetch(URL_UPDATE_MEMBER, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataUpdate)
        });

        if (responUpdate.ok) {
            // Tampilkan tulisan sukses berwarna hijau di layar
            document.getElementById("pesan-sukses").style.display = "block";
            document.getElementById("form-edit").reset();
            
            // Sembunyikan kembali pesan sukses setelah 3 detik
            setTimeout(() => {
                document.getElementById("pesan-sukses").style.display = "none";
            }, 3000);
        } else {
            alert("Gagal memperbarui data ke server cloud!");
        }

    } catch (error) {
        console.error("Detail Error:", error);
        alert("Terjadi kesalahan koneksi database!");
    }
});
