// ==========================================
// VOIN PRESALE - MAINNET WEB3 INTEGRATION
// ==========================================

// Pustaka Ethers.js dimuat secara dinamis atau melalui CDN di HTML utama jika diperlukan, 
// pastikan menggunakan Ethers v6.

const MAINNET_CHAIN_ID = 56; // 56 untuk BSC Mainnet (atau 1 untuk Ethereum)
const CONTRACT_ADDRESS = "0xAEb22359588A50e6F746004E66418Eb2c978dAA2";

// ABI Minimum yang diperlukan untuk membaca dan mengeksekusi pembelian di Smart Contract
const CONTRACT_ABI = [
  "function buyTokens() payable",
  "function allocations(address) view returns (uint256)",
  "function currentBatch() view returns (uint256)",
  "function saleOpen() view returns (bool)"
];

let userAccount = null;

// Fungsi Koneksi Wallet (MetaMask / Trust Wallet / Web3 Browser)
async function connectWallet() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      userAccount = await signer.getAddress();
      
      // Validasi Jaringan Mainnet
      const network = await provider.getNetwork();
      if (Number(network.chainId) !== MAINNET_CHAIN_ID) {
        alert("Peringatan: Harap ubah jaringan dompet Anda ke BNB Smart Chain Mainnet (Chain ID 56)!");
        return;
      }

      // Update Tampilan Tombol Wallet
      const shortAddr = userAccount.slice(0, 6) + "..." + userAccount.slice(-4);
      const btn1 = document.getElementById("btnConnectWallet");
      const btn2 = document.getElementById("btnConnectDashboard");
      if (btn1) btn1.textContent = shortAddr;
      if (btn2) btn2.textContent = shortAddr;

      // Ambil data on-chain pengguna
      loadUserAllocation(userAccount, provider);
      
    } catch (err) {
      console.error(err);
      alert("Koneksi dompet dibatalkan atau gagal.");
    }
  } else {
    alert("Silakan gunakan browser yang mendukung Web3 atau buka melalui dApp browser di MetaMask/Trust Wallet.");
  }
}

// Fungsi Eksekusi Pembelian Real dengan Dana Asli
async function executeRealPurchase() {
  if (!userAccount) {
    alert("Silakan hubungkan dompet Anda terlebih dahulu!");
    return;
  }

  const amountInput = document.getElementById("amount").value;
  if (!amountInput || Number(amountInput) <= 0) {
    alert("Masukkan jumlah pembelian yang valid!");
    return;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    // Cek apakah penjualan dibuka di smart contract
    const isOpen = await contract.saleOpen();
    if (!isOpen) {
      alert("Maaf, sesi presale kontrak saat ini sedang ditutup atau dijeda.");
      return;
    }

    // Konversi nilai input ke Wei (untuk Native Coin seperti BNB/ETH)
    const valueInWei = ethers.parseEther(amountInput);

    // Kirim Transaksi Real ke Blockchain Mainnet
    const tx = await contract.buyTokens({ value: valueInWei });
    alert("Transaksi dikirim! Silakan tunggu konfirmasi blok. Hash: " + tx.hash);

    // Tunggu hingga transaksi dikonfirmasi oleh jaringan
    await tx.wait();
    alert("✅ Pembelian Berhasil! Alokasi token Anda telah tercatat di blockchain.");
    
    // Refresh data alokasi
    loadUserAllocation(userAccount, provider);

  } catch (err) {
    console.error(err);
    alert("Transaksi Gagal: " + (err.reason || err.message));
  }
}

// Fungsi Membaca Data Alokasi Akun dari Smart Contract
async function loadUserAllocation(address, provider) {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    const allocationWei = await contract.allocations(address);
    const allocationVOIN = ethers.formatUnits(allocationWei, 18);

    const statElement = document.getElementById("valTotalAllocation");
    if (statElement) {
      statElement.textContent = Number(allocationVOIN).toLocaleString() + " VOIN";
    }
  } catch (err) {
    console.error("Gagal memuat data alokasi on-chain:", err);
  }
}

// Inisialisasi Event Listener saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  // Tombol Connect Wallet
  const connectBtns = document.querySelectorAll("#btnConnectWallet, #btnConnectDashboard");
  connectBtns.forEach(btn => {
    if (btn) btn.addEventListener("click", connectWallet);
  });

  // Tombol Beli Real
  const buyBtn = document.getElementById("btnBuyReal");
  if (buyBtn) {
    buyBtn.addEventListener("click", executeRealPurchase);
  }
});
