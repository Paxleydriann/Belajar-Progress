// index.js - Simulator Monitoring Status Server & Jaringan (Async/Promise)

class ServerMonitor {
  constructor(networkName) {
    this.networkName = networkName;
    this.nodes = [];
  }

  // Mendaftarkan endpoint / host server
  registerNode(id, host, service, maxThresholdMs = 120) {
    this.nodes.push({ id, host, service, maxThresholdMs });
  }

  // Simulasi ping asinkron menggunakan Promise dan setTimeout
  async pingNode(node) {
    return new Promise((resolve) => {
      const latency = Math.floor(Math.random() * 200) + 15; // 15ms - 215ms
      const isOnline = Math.random() > 0.15; // Peluang online 85%

      setTimeout(() => {
        let status = "HEALTHY";
        if (!isOnline) {
          status = "DOWN";
        } else if (latency > node.maxThresholdMs) {
          status = "HIGH_LATENCY";
        }

        resolve({
          id: node.id,
          host: node.host,
          service: node.service,
          latency: isOnline ? `${latency} ms` : "N/A",
          rawLatency: isOnline ? latency : null,
          status: status,
        });
      }, Math.floor(Math.random() * 400) + 100);
    });
  }

  // Memindai semua target secara paralel dengan Promise.all
  async scanAll() {
    console.log(`\n[>>] Memulai pemindaian: "${this.networkName}"...`);
    console.log(`[..] Memeriksa ${this.nodes.length} node target secara simultan...\n`);

    const results = await Promise.all(this.nodes.map((n) => this.pingNode(n)));
    this.renderDashboard(results);
  }

  // Menampilkan ringkasan metrik performa
  renderDashboard(results) {
    console.log("================= DASHBOARD KESEHATAN SERVER =================");
    
    console.table(
      results.map((r) => ({
        ID: r.id,
        "Alamat Host": r.host,
        Layanan: r.service,
        Latensi: r.latency,
        Status: r.status,
      }))
    );

    const healthy = results.filter((r) => r.status === "HEALTHY").length;
    const warning = results.filter((r) => r.status === "HIGH_LATENCY").length;
    const down = results.filter((r) => r.status === "DOWN").length;

    const validLatencies = results.filter((r) => r.rawLatency !== null).map((r) => r.rawLatency);
    const avgLatency =
      validLatencies.length > 0
        ? (validLatencies.reduce((a, b) => a + b, 0) / validLatencies.length).toFixed(1)
        : 0;

    console.log("Ringkasan Metrik:");
    console.log(` • Normal (Healthy)    : ${healthy} server`);
    console.log(` • Peringatan (Lambat) : ${warning} server`);
    console.log(` • Gangguan (Down)     : ${down} server`);
    console.log(` • Rata-rata Latensi   : ${avgLatency} ms`);

    if (down > 0 || warning > 0) {
      console.log(`\n⚠️  Perhatian: Terdeteksi ${down + warning} node membutuhkan pengecekan rute/layanan.`);
    } else {
      console.log("\n✅ Semua node jaringan beroperasi normal tanpa kendala.");
    }
    console.log("==============================================================\n");
  }
}

// --- Inisialisasi & Eksekusi ---
const monitor = new ServerMonitor("Infrastructure Local & Cloud Nodes");

monitor.registerNode("SRV-01", "192.168.1.1", "Gateway Router", 40);
monitor.registerNode("SRV-02", "192.168.1.10", "Database MariaDB", 90);
monitor.registerNode("SRV-03", "192.168.1.25", "Web Server (Nginx)", 100);
monitor.registerNode("SRV-04", "10.10.0.1", "RADIUS / Hotspot Server", 60);
monitor.registerNode("SRV-05", "1.1.1.1", "Cloudflare DNS Resolver", 80);

monitor.scanAll();