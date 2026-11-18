// presale.js - Skrip Universal Web3 untuk VOIN Technology
document.addEventListener("DOMContentLoaded", () => {
    const btnConnect = document.getElementById("btnConnectWallet");

    if (btnConnect) {
        btnConnect.addEventListener("click", async () => {
            try {
                // Cek apakah ada provider injection (MetaMask, Trust Wallet extension/dApp browser)
                if (typeof window.ethereum !== 'undefined') {
                    btnConnect.innerText = "Menghubungkan...";

                    // Meminta izin akun langsung ke provider yang tersedia di browser
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const userAddress = accounts[0];

                    // Cek Chain ID (BNB Smart Chain Mainnet = 56 atau 0x38)
                    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                    if (chainId !== "0x38" && chainId !== 56) {
                        try {
                            // Coba minta pindah jaringan otomatis ke BSC
                            await window.ethereum.request({
                                method: 'wallet_switchEthereumChain',
                                params: [{ chainId: '0x38' }],
                            });
                        } catch (switchError) {
                            alert("Harap ubah jaringan dompet Anda secara manual ke BNB Smart Chain (Chain ID: 56).");
                        }
                    }

                    // Tampilkan alamat yang terhubung di tombol
                    const shortAddr = userAddress.substring(0, 6) + "..." + userAddress.substring(userAddress.length - 4);
                    btnConnect.innerText = shortAddr;
                    btnConnect.style.backgroundColor = "#047857";
                    console.log("Berhasil terhubung:", userAddress);

                } else {
                    // Jika dibuka di Chrome biasa tanpa ekstensi, berikan opsi pengalihan atau informasi yang jelas
                    alert("Tidak ada ekstensi dompet terdeteksi di browser ini. Jika Anda menggunakan HP, silakan buka melalui dApp browser di dalam aplikasi MetaMask/TrustWallet, atau gunakan komputer dengan ekstensi dompet aktif.");
                }
            } catch (error) {
                console.error("Koneksi ditolak:", error);
                btnConnect.innerText = "Connect Wallet";
            }
        });
    }
});
