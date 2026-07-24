// 1. DATABASE PALSU (Cukup tambah/kurang data di dalam kotak kurung ini)
const databaseMember = [
    {
        nama: "Andi_Gamer",
        role: "Server Owner / Carry",
        games: "Valorant, Mobile Legends",
        bio: "Tidur itu untuk orang lemah, mabar nomor satu!",
        joinDate: "12 April 2024",
        avatarSeed: "Andi"
    },
    {
        nama: "Siti_Bot",
        role: "Admin / DJ Server",
        games: "Genshin Impact, Minecraft",
        bio: "Yang rusuh di Voice Channel langsung ku-mute.",
        joinDate: "15 Januari 2025",
        avatarSeed: "Siti"
    },
    {
        nama: "Budi_Rambo",
        role: "Rusher Beban",
        games: "Free Fire, PUBG",
        bio: "Maju paling depan, mati paling awal.",
        joinDate: "01 Maret 2025",
        avatarSeed: "Budi"
    }
    // 💡 KALAU MAU TAMBAH TEMAN BARU, CUKUP COPY-PASTE DARI TANDA { SAMPAI } DI ATAS LALU TARUH DI SINI
];

// 2. FUNGSI UNTUK MEMBUAT KARTU MEMBER OTOMATIS KE HTML
function cetakKartuMember() {
    const gridContainer = document.getElementById("grid-member");
    
    // Looping (mengulang) untuk membaca isi database satu per satu
    databaseMember.forEach((member, index) => {
        // Bikin kotak kartu baru
        const kartu = document.createElement("div");
        kartu.className = "card-member";
        
        // Atur agar ketika kartu diklik, dia membuka pop-up dengan data miliknya
        kartu.onclick = () => bukaProfil(index);
        
        // Isi konten di dalam kartu
        kartu.innerHTML = `
            <img src="https://dicebear.com{member.avatarSeed}" alt="Avatar" class="avatar">
            <h4>${member.nama}</h4>
            <p class="role">${member.role}</p>
            <button class="btn-detail">Lihat Profil</button>
        `;
        
        // Masukkan kartu yang sudah jadi ke dalam grid di HTML
        gridContainer.appendChild(kartu);
    });
}
s
// 3. FUNGSI POP-UP DETAIL
function bukaProfil(index) {
    const modal = document.getElementById("modal-profil");
    const data = databaseMember[index]; // Ambil data berdasarkan kartu yang diklik
    
    // Masukkan data ke kotak pop-up
    document.getElementById("modal-nama").innerText = data.nama;
    document.getElementById("modal-role").innerText = data.role;
    document.getElementById("modal-games").innerText = data.games;
    document.getElementById("modal-bio").innerText = data.bio;
    document.getElementById("modal-join").innerText = data.joinDate;
    
    modal.style.display = "block";
}

function tutupProfil() {
    document.getElementById("modal-profil").style.display = "none";
}

// Jalankan pencetakan kartu saat halaman web pertama kali dibuka
cetakKartuMember();
