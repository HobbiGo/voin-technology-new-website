// ==========================================
// VOIN PRESALE - MAINNET WEB3 INTEGRATION (WITH METAMASK DEEP LINK)
// ==========================================

const MAINNET_CHAIN_ID = 56; // BNB Smart Chain Mainnet
const CONTRACT_ADDRESS = "0xAEb22359588A50e6F746004E66418Eb2c978dAA2";

const CONTRACT_ABI = [
  "function buyTokens() payable",
  "function allocations(address) view returns (uint256)",
  "function currentBatch() view returns (uint256)",
  "function saleOpen() view returns (bool)"
];

let userAccount = null;

async function connectWallet() {
  // Cek apakah dibuka di dApp browser (MetaMask / TrustWallet / dll)
  if (typeof window.ethereum !== 'undefined') {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      userAccount = await signer.getAddress();
      
      const network = await provider.getNetwork();
      if (Number(network.chainId) !== MAINNET_CHAIN_ID) {
        alert("Peringatan: Harap ubah jaringan dompet Anda ke BNB Smart Chain Mainnet (Chain ID 56)!");
        return;
      }

      const shortAddr = userAccount.slice(0, 6) + "..." + userAccount.slice(-4);
      document.querySelectorAll("#btnConnectWallet, #btnConnectDashboard").forEach(btn => {
        if (btn) btn.textContent = shortAddr;
      });

      loadUserAllocation(userAccount, provider);
      
    } catch (err) {
      console.error(err);
      alert("Koneksi dompet dibatalkan atau gagal.");
    }
  } else {
    // JIKA DIBUKA DI BROWSER BIASA (CHROME/SAFARI DI TABLET/HP)
    // Otomatis buat link untuk buka langsung di aplikasi MetaMask
    const currentUrl = window.location.href.replace(/^https?:\/\//, '');
    const metamaskDeepLink = `https://metamask.app.link/dapp/${currentUrl}`;
    
    if (confirm("Dompet Web3 tidak terdeteksi di browser ini. Buka halaman ini secara otomatis di aplikasi MetaMask?")) {
      window.location.href = metamaskDeepLink;
    }
  }
}

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

    const isOpen = await contract.saleOpen();
    if (!isOpen) {
      alert("Maaf, sesi presale kontrak saat ini sedang ditutup.");
      return;
    }

    const valueInWei = ethers.parseEther(amountInput);
    const tx = await contract.buyTokens({ value: valueInWei });
    alert("Transaksi dikirim! Hash: " + tx.hash);

    await tx.wait();
    alert("✅ Pembelian Berhasil! Alokasi token Anda tercatat di blockchain.");
    loadUserAllocation(userAccount, provider);

  } catch (err) {
    console.error(err);
    alert("Transaksi Gagal: " + (err.reason || err.message));
  }
}

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
    console.error("Gagal memuat alokasi:", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#btnConnectWallet, #btnConnectDashboard").forEach(btn => {
    if (btn) btn.addEventListener("click", connectWallet);
  });

  const buyBtn = btnBuyReal = document.getElementById("btnBuyReal");
  if (buyBtn) {
    buyBtn.addEventListener("click", executeRealPurchase);
  }
});
