function findPenalty(
	matrix,
	rowPenalties,
	colPenalties,
	remainingRows,
	remainingCols
) {
	// Calculate row penalties
	for (let i of remainingRows) {
		let row = matrix[i].filter((_, j) => remainingCols.includes(j));
		if (row.length >= 2) {
			row.sort((a, b) => a - b);
			rowPenalties[i] = row[1] - row[0];
		} else if (row.length === 1) {
			rowPenalties[i] = row[0];
		} else {
			rowPenalties[i] = 0;
		}
	}

	// Calculate column penalties
	for (let j of remainingCols) {
		let col = remainingRows.map((i) => matrix[i][j]);
		if (col.length >= 2) {
			col.sort((a, b) => a - b);
			colPenalties[j] = col[1] - col[0];
		} else if (col.length === 1) {
			colPenalties[j] = col[0];
		} else {
			colPenalties[j] = 0;
		}
	}
}

function findMinCostCell(matrix, remainingRows, remainingCols) {
	let minCost = Infinity;
	let minRow = -1;
	let minCol = -1;

	for (let i of remainingRows) {
		for (let j of remainingCols) {
			if (matrix[i][j] < minCost) {
				minCost = matrix[i][j];
				minRow = i;
				minCol = j;
			}
		}
	}

	return [minRow, minCol];
}

const VAM = (pengirim, kapasitas, tujuan, permintaan, harga) => {
	let hasil = [];
	let totalBiaya = 0;
	let hasilMatrix = {};

	// Initialize hasilMatrix
	pengirim.forEach((p) => {
		hasilMatrix[p] = {};
		tujuan.forEach((t) => {
			hasilMatrix[p][t] = 0;
		});
	});

	// Create working copies
	let remainingKapasitas = [...kapasitas];
	let remainingPermintaan = [...permintaan];
	let remainingRows = Array.from(Array(pengirim.length).keys());
	let remainingCols = Array.from(Array(tujuan.length).keys());

	while (remainingRows.length > 0 && remainingCols.length > 0) {
		let rowPenalties = new Array(pengirim.length).fill(0);
		let colPenalties = new Array(tujuan.length).fill(0);

		// Calculate penalties
		findPenalty(
			harga,
			rowPenalties,
			colPenalties,
			remainingRows,
			remainingCols
		);

		// Find maximum penalty
		let maxPenalty = -1;
		let maxPenaltyRow = -1;
		let maxPenaltyCol = -1;
		let isRowPenalty = true;

		remainingRows.forEach((i) => {
			if (rowPenalties[i] > maxPenalty) {
				maxPenalty = rowPenalties[i];
				maxPenaltyRow = i;
				isRowPenalty = true;
			}
		});

		remainingCols.forEach((j) => {
			if (colPenalties[j] > maxPenalty) {
				maxPenalty = colPenalties[j];
				maxPenaltyCol = j;
				isRowPenalty = false;
			}
		});

		// Find minimum cost cell in the selected row/column
		let selectedRow, selectedCol;
		if (isRowPenalty) {
			let minCost = Infinity;
			remainingCols.forEach((j) => {
				if (harga[maxPenaltyRow][j] < minCost) {
					minCost = harga[maxPenaltyRow][j];
					selectedCol = j;
				}
			});
			selectedRow = maxPenaltyRow;
		} else {
			let minCost = Infinity;
			remainingRows.forEach((i) => {
				if (harga[i][maxPenaltyCol] < minCost) {
					minCost = harga[i][maxPenaltyCol];
					selectedRow = i;
				}
			});
			selectedCol = maxPenaltyCol;
		}

		// Allocate maximum possible quantity
		let quantity = Math.min(
			remainingKapasitas[selectedRow],
			remainingPermintaan[selectedCol]
		);

		// Update hasilMatrix
		hasilMatrix[pengirim[selectedRow]][tujuan[selectedCol]] = quantity;

		// Add to hasil array
		hasil.push({
			dari: pengirim[selectedRow],
			ke: tujuan[selectedCol],
			jumlah: quantity,
			biaya: quantity * harga[selectedRow][selectedCol],
		});

		// Update remaining capacities and demands
		totalBiaya += quantity * harga[selectedRow][selectedCol];
		remainingKapasitas[selectedRow] -= quantity;
		remainingPermintaan[selectedCol] -= quantity;

		// Remove satisfied rows/columns
		if (remainingKapasitas[selectedRow] === 0) {
			remainingRows = remainingRows.filter((i) => i !== selectedRow);
		}
		if (remainingPermintaan[selectedCol] === 0) {
			remainingCols = remainingCols.filter((j) => j !== selectedCol);
		}
	}

	// Check if all demands are met
	if (remainingPermintaan.some((p) => p > 0)) {
		console.error(
			"Tidak semua permintaan dapat terpenuhi dengan kapasitas yang ada."
		);
	}

	return {
		hasil,
		hasilMatrix,
		totalBiaya,
	};
};

const leastCostMethod = (pengirim, kapasitas, tujuan, permintaan, harga) => {
	let rawHasil = []; // Menyimpan hasil alokasi dalam format awal
	let totalBiaya = 0;
	const newKapasitas = [...kapasitas];
	const newPermintaan = [...permintaan];

	// Matrix untuk menyimpan hasil dalam format table
	let hasilMatrix = {};

	// Inisialisasi matrix hasil
	pengirim.forEach((p) => {
		hasilMatrix[p] = {};
		tujuan.forEach((t) => {
			hasilMatrix[p][t] = 0;
		});
	});

	// Loop sampai semua permintaan terpenuhi atau kapasitas habis
	while (newPermintaan.some((p) => p > 0) && newKapasitas.some((k) => k > 0)) {
		// Cari indeks biaya terkecil di matriks harga
		let minHarga = Infinity;
		let row = -1,
			col = -1;

		for (let i = 0; i < harga.length; i++) {
			for (let j = 0; j < harga[i].length; j++) {
				if (
					newKapasitas[i] > 0 &&
					newPermintaan[j] > 0 &&
					harga[i][j] < minHarga
				) {
					minHarga = harga[i][j];
					row = i;
					col = j;
				}
			}
		}

		// Tentukan jumlah barang yang dikirim
		let jumlah = Math.min(newKapasitas[row], newPermintaan[col]);

		// Simpan ke format awal
		rawHasil.push({
			dari: pengirim[row],
			ke: tujuan[col],
			jumlah: jumlah,
			biaya: jumlah * minHarga,
		});

		// Simpan ke matrix hasil
		hasilMatrix[pengirim[row]][tujuan[col]] = jumlah;

		// Kurangi kapasitas dan permintaan
		newKapasitas[row] -= jumlah;
		newPermintaan[col] -= jumlah;

		// Update total biaya
		totalBiaya += jumlah * minHarga;
	}

	// Periksa permintaan tidak terpenuhi
	if (newKapasitas.some((p) => p > 0)) {
		console.error(
			"Tidak semua permintaan dapat terpenuhi dengan kapasitas yang ada."
		);
	}

	return {
		hasil: rawHasil, // Format awal untuk kompatibilitas
		hasilMatrix: hasilMatrix, // Format baru untuk table
		totalBiaya: totalBiaya,
	};
};

const NWC = (pengirim, kapasitas, tujuan, permintaan, harga) => {
	let hasil = [];
	let totalBiaya = 0;
	let hasilMatrix = {};

	// Initialize hasilMatrix
	pengirim.forEach((p) => {
		hasilMatrix[p] = {};
		tujuan.forEach((t) => {
			hasilMatrix[p][t] = 0;
		});
	});

	// Create working copies
	let remainingKapasitas = [...kapasitas];
	let remainingPermintaan = [...permintaan];

	// Start from northwest corner (top-left)
	let i = 0; // current row
	let j = 0; // current column

	while (i < pengirim.length && j < tujuan.length) {
		// Calculate quantity to allocate
		let quantity = Math.min(remainingKapasitas[i], remainingPermintaan[j]);

		if (quantity > 0) {
			// Update hasilMatrix
			hasilMatrix[pengirim[i]][tujuan[j]] = quantity;

			// Add to hasil array
			hasil.push({
				dari: pengirim[i],
				ke: tujuan[j],
				jumlah: quantity,
				biaya: quantity * harga[i][j],
			});

			// Update total cost
			totalBiaya += quantity * harga[i][j];

			// Update remaining capacities and demands
			remainingKapasitas[i] -= quantity;
			remainingPermintaan[j] -= quantity;
		}

		// Move to next cell
		if (remainingKapasitas[i] === 0) {
			i++; // Move to next row if supply exhausted
		} else if (remainingPermintaan[j] === 0) {
			j++; // Move to next column if demand satisfied
		}
	}

	// Check if all demands are met
	if (remainingPermintaan.some((p) => p > 0)) {
		console.error(
			"Tidak semua permintaan dapat terpenuhi dengan kapasitas yang ada."
		);
	}

	return {
		hasil,
		hasilMatrix,
		totalBiaya,
	};
};

export { VAM, leastCostMethod, NWC };
