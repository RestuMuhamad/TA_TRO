const prompt = require("prompt-sync")({ sigint: true });

let pengirim = [];
let tujuan = [];
let kapasitas = [];
let permintaan = [];
let harga = [];

console.log("=============== | Selamat Datang | ===============");
console.log("| Input pengirim |");
let loopPengirim = true;
while (loopPengirim) {
	let namaPengirim = prompt("Asal Pengirim : ");
	pengirim.push(namaPengirim);
	let confirm = prompt("Lanjut [Y/N] : ");

	if (confirm.toUpperCase() == "N") {
		loopPengirim = false;
		break;
	}
}

console.log("\n| Input Kapasitas Pengirim |");
pengirim.forEach((data) => {
	let kapasitasPengirim = prompt(`Kapasitas ${data} : `);
	kapasitas.push(parseInt(kapasitasPengirim));
});

console.log("\n| Input Tujuan |");
let loopTujuan = true;
while (loopTujuan) {
	let namaPengirim = prompt("Tujuan Pengiriman : ");
	tujuan.push(namaPengirim);
	let confirm = prompt("Lanjut [Y/N] : ");

	if (confirm.toUpperCase() == "N") {
		loopTujuan = false;
		break;
	}
}

console.log("\n| Input Permintaan Pengirim |");
tujuan.forEach((data) => {
	let kapasitasPengirim = prompt(`Permintaan ${data} : `);
	permintaan.push(parseInt(kapasitasPengirim));
});

console.log("\n| Input Harga Pengiriman |");
let indexPengirim = 0;
pengirim.forEach((p) => {
	console.log(`\nHarga dari ${p}`);
	harga.push(new Array());
	tujuan.forEach((data) => {
		let hargaPengiriman = prompt(`Harga ke ${data} : `);
		harga[indexPengirim].push(parseInt(hargaPengiriman));
	});
	indexPengirim++;
});

console.log("\n\nTunggu....");

export function leastCostMethod(
	pengirim,
	kapasitas,
	tujuan,
	permintaan,
	harga
) {
	let hasil = []; // Menyimpan hasil alokasi
	let totalBiaya = 0;

	// Loop sampai semua permintaan terpenuhi atau kapasitas habis
	while (permintaan.some((p) => p > 0) && kapasitas.some((k) => k > 0)) {
		// Cari indeks biaya terkecil di matriks harga
		let minHarga = Infinity;
		let row = -1,
			col = -1;

		for (let i = 0; i < harga.length; i++) {
			for (let j = 0; j < harga[i].length; j++) {
				if (kapasitas[i] > 0 && permintaan[j] > 0 && harga[i][j] < minHarga) {
					minHarga = harga[i][j];
					row = i;
					col = j;
				}
			}
		}

		// Tentukan jumlah barang yang dikirim berdasarkan kapasitas dan permintaan
		let jumlah = Math.min(kapasitas[row], permintaan[col]);
		hasil.push({
			dari: pengirim[row],
			ke: tujuan[col],
			jumlah: jumlah,
			biaya: jumlah * minHarga,
		});

		// Kurangi kapasitas pengirim dan permintaan tujuan
		kapasitas[row] -= jumlah;
		permintaan[col] -= jumlah;

		// Tambahkan ke total biaya
		totalBiaya += jumlah * minHarga;
	}

	// Periksa apakah semua permintaan terpenuhi
	if (permintaan.some((p) => p > 0)) {
		console.error(
			"Tidak semua permintaan dapat terpenuhi dengan kapasitas yang ada."
		);
	}

	return { hasil, totalBiaya };
}

// Jalankan algoritma
let solusi = leastCostMethod(pengirim, kapasitas, tujuan, permintaan, harga);

// Tampilkan hasil
console.log("\nHasil Alokasi:");
solusi.hasil.forEach((entry) => {
	console.log(
		`${entry.dari} -> ${entry.ke}: ${entry.jumlah} unit (Biaya: ${entry.biaya})`
	);
});
console.log("Total Biaya:", solusi.totalBiaya);
