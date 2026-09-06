// inventory.js - Program Manajemen & Analisis Stok Sederhana
class InventoryManager {
  constructor() {
    this.items = [];
  }

  // Menambahkan produk ke dalam katalog
  addItem(id, name, category, stock, price) {
    this.items.push({ id, name, category, stock, price });
    console.log(`[+] Barang ditambahkan: ${name} (${category})`);
  }

  // Simulasi transaksi penjualan barang
  sellItem(id, quantity) {
    const item = this.items.find((i) => i.id === id);
    if (!item) {
      console.log(`[-] Error: Produk ID ${id} tidak ditemukan.`);
      return;
    }
    if (item.stock < quantity) {
      console.log(`[-] Peringatan: Stok ${item.name} tidak cukup (Tersedia: ${item.stock}).`);
      return;
    }
    item.stock -= quantity;
    console.log(`[✓] Berhasil menjual ${quantity} unit "${item.name}". Sisa stok: ${item.stock}`);
  }

  // Menghitung total valuasi nilai barang di gudang
  getTotalValuation() {
    return this.items.reduce((total, item) => total + item.stock * item.price, 0);
  }

  // Filter barang dengan stok menipis (di bawah batas minimum)
  getLowStockItems(threshold = 5) {
    return this.items.filter((item) => item.stock <= threshold);
  }

  // Agregasi jumlah total unit per kategori
  getCategorySummary() {
    return this.items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.stock;
      return acc;
    }, {});
  }

  // Menampilkan laporan ringkas dalam bentuk tabel konsol
  displayReport() {
    console.log("\n==================== LAPORAN INVENTARIS ====================");
    
    console.table(
      this.items.map((item) => ({
        ID: item.id,
        "Nama Produk": item.name,
        Kategori: item.category,
        Stok: item.stock,
        "Harga Satuan": `Rp ${item.price.toLocaleString("id-ID")}`,
        "Total Nilai": `Rp ${(item.stock * item.price).toLocaleString("id-ID")}`,
      }))
    );

    console.log(`Total Valuasi Aset : Rp ${this.getTotalValuation().toLocaleString("id-ID")}`);
    
    const lowStock = this.getLowStockItems();
    if (lowStock.length > 0) {
      console.log(`\n⚠️  Peringatan Stok Menipis (<= 5 unit):`);
      lowStock.forEach((i) => console.log(`   • ${i.name} (Sisa: ${i.stock})`));
    }

    console.log("\nRingkasan Unit per Kategori:", this.getCategorySummary());
    console.log("============================================================\n");
  }
}

// --- Simulasi Eksekusi ---
const store = new InventoryManager();

// 1. Input data barang
store.addItem("NET-01", "Router Dual-Band AC1200", "Networking", 15, 450000);
store.addItem("NET-02", "Managed PoE Switch 8-Port", "Networking", 4, 850000);
store.addItem("CAB-01", "Kabel UTP Cat6 Roll 305m", "Kabel", 8, 920000);
store.addItem("ELC-01", "Uninterruptible Power Supply 650VA", "Power", 3, 620000);

// 2. Transaksi keluar
store.sellItem("NET-01", 5);
store.sellItem("ELC-01", 2);

// 3. Cetak laporan
store.displayReport();