// presale.js - Skrip Koneksi Wallet Universal & Alamat Admin untuk VOIN Technology
// Ganti teks di dalam tanda kutip di bawah ini dengan alamat dompet (wallet) pribadi Anda
const ADMIN_WALLET = "// presale.js - Skrip Koneksi Wallet Universal & Alamat Admin untuk VOIN Technology
// Ganti teks di dalam tanda kutip di bawah ini dengan alamat dompet (wallet) pribadi Anda
const ADMIN_WALLET = "0xAEb22359588A50e6F746004E66418Eb2c978dAA2";

document.addEventListener("DOMContentLoaded", () => {
    const btnConnect = document.getElementById("btnConnectWallet");

    if (btnConnect) {
        btnConnect.addEventListener("click", async () => {
            try {
                // Cek apakah browser memiliki penyedia Web3 (MetaMask, Trust Wallet, dll)
                if (typeof window.ethereum !== 'undefined') {
                    btnConnect.innerText = "Menghubungkan...";

                    // Menggunakan Ethers.js v6 BrowserProvider
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    await provider.send("eth_requestAccounts", []);
                    const signer = await provider.getSigner();
                    const userAddress = await signer.getAddress();

                    // Cek jaringan apakah di BNB Smart Chain (Chain ID: 56 / 0x38)
                    const network = await provider.getNetwork();
                    if (Number(network.chainId) !== 56) {
                        alert("Peringatan: Harap ubah jaringan dompet Anda ke BNB Smart Chain (Chain ID: 56)!");
                    }

                    // Potong alamat dompet agar rapi di tombol
                    const shortAddr = userAddress.substring(0, 6) + "..." + userAddress.substring(userAddress.length - 4);
                    btnConnect.innerText = shortAddr;
                    btnConnect.style.backgroundColor = "#047857";

                    console.log("Berhasil terhubung ke:", userAddress);
                    console.log("Wallet Admin Penerima Dana:", ADMIN_WALLET);
                } else {
                    alert("Dompet kripto tidak terdeteksi! Pastikan Anda membuka website ini di dalam browser aplikasi MetaMask atau Trust Wallet.");
                    btnConnect.innerText = "Connect Wallet";
                }
            } catch (error) {
                console.error("Koneksi gagal:", error);
                alert("Koneksi dompet dibatalkan atau gagal.");
                btnConnect.innerText = "Connect Wallet";
            }
        });
    }
});";

document.addEventListener("DOMContentLoaded", () => {
    const btnConnect = document.getElementById("btnConnectWallet");

    if (btnConnect) {
        btnConnect.addEventListener("click", async () => {
            try {
                // Cek apakah browser memiliki penyedia Web3 (MetaMask, Trust Wallet, dll)
                if (typeof window.ethereum !== 'undefined') {
                    btnConnect.innerText = "Menghubungkan...";

                    // Menggunakan Ethers.js v6 BrowserProvider
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    await provider.send("eth_requestAccounts", []);
                    const signer = await provider.getSigner();
                    const userAddress = await signer.getAddress();

                    // Cek jaringan apakah di BNB Smart Chain (Chain ID: 56 / 0x38)
                    const network = await provider.getNetwork();
                    if (Number(network.chainId) !== 56) {
                        alert("Peringatan: Harap ubah jaringan dompet Anda ke BNB Smart Chain (Chain ID: 56)!");
                    }

                    // Potong alamat dompet agar rapi di tombol
                    const shortAddr = userAddress.substring(0, 6) + "..." + userAddress.substring(userAddress.length - 4);
                    btnConnect.innerText = shortAddr;
                    btnConnect.style.backgroundColor = "#047857";

                    console.log("Berhasil terhubung ke:", userAddress);
                    console.log("Wallet Admin Penerima Dana:", ADMIN_WALLET);
                } else {
                    alert("Dompet kripto tidak terdeteksi! Pastikan Anda membuka website ini di dalam browser aplikasi MetaMask atau Trust Wallet.");
                    btnConnect.innerText = "Connect Wallet";
                }
            } catch (error) {
                console.error("Koneksi gagal:", error);
                alert("Koneksi dompet dibatalkan atau gagal.");
                btnConnect.innerText = "Connect Wallet";
            }
        });
    }
});
