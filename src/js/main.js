const allBtnMenu = document.querySelectorAll("#box-btn button");
for (const btnMenu of allBtnMenu) {
	btnMenu.addEventListener("click", () => {
		const check = btnMenu.querySelector("input");
		if (!check.checked) check.checked = !check.checked;
		localStorage.setItem("count", btnMenu.dataset.count);
	});
}

let pengirim = [];
let tujuan = [];
let kapasitas = [];
let permintaan = [];
let harga = [];

import { VAM, leastCostMethod, NWC } from "./algo.js";

const formPengiriman = document.querySelector("#form-pengiriman");
const addFormPengiriman = formPengiriman.querySelector("#add-form-pengiriman");
addFormPengiriman.addEventListener("click", () => {
	const index = formPengiriman.childElementCount - 1;
	const elAppend = `
    <section class="flex w-full items-center justify-between gap-4">
      <input
        type="text"
        name="pengiriman-${index}"
        placeholder="From"
        class="capitalize h-12 w-full bg-transparent pl-4 mr-2 placeholder:text-graySecondary text-graySecondary font-bold focus:outline-none border-grayThrid border-2 rounded-lg font-montserrat selection:bg-graySecondary selection:text-white"
      />
      <div
        class="flex h-12 w-max border-2 border-grayThrid rounded-lg items-center justify-end px-3 pr-4 font-montserrat"
      >
        <input
          type="text"
          name="unit-pengiriman-${index}"
          inputmode="numeric"
          placeholder="0"
          class="h-full w-10 bg-transparent text-right mr-2 placeholder:text-graySecondary text-graySecondary font-bold focus:outline-none selection:bg-graySecondary selection:text-white"
          maxlength="4"
        />
        <span
          class="inline-block uppercase w-max font-bold text-grayThrid"
          >unit</span
        >
      </div>
    </section>`;
	const newSection = document.createElement("section");
	newSection.classList.add("flex", "flex-col", "gap-4", "mt-4");
	newSection.innerHTML += elAppend;
	formPengiriman.insertBefore(newSection, addFormPengiriman);
});

const formPermintaan = document.querySelector("#form-permintaan");
const addFormPermintaan = formPermintaan.querySelector("#add-form-permintaan");
addFormPermintaan.addEventListener("click", () => {
	const index = formPermintaan.childElementCount - 1;
	const elAppend = `
    <section class="flex w-full items-center justify-between gap-4">
      <input
        type="text"
        name="permintaan-${index}"
        placeholder="To"
        class="capitalize h-12 w-full bg-transparent pl-4 mr-2 placeholder:text-graySecondary text-graySecondary font-bold focus:outline-none border-grayThrid border-2 rounded-lg font-montserrat selection:bg-graySecondary selection:text-white"
      />
      <div
        class="flex h-12 w-max border-2 border-grayThrid rounded-lg items-center justify-end px-3 pr-4 font-montserrat"
      >
        <input
          type="text"
          name="unit-permintaan-${index}"
          inputmode="numeric"
          placeholder="0"
          class="h-full w-10 bg-transparent text-right mr-2 placeholder:text-graySecondary text-graySecondary font-bold focus:outline-none selection:bg-graySecondary selection:text-white"
          maxlength="4"
        />
        <span
          class="inline-block uppercase w-max font-bold text-grayThrid"
          >unit</span
        >
      </div>
    </section>`;
	const newSection = document.createElement("section");
	newSection.classList.add("flex", "flex-col", "gap-4", "mt-4");
	newSection.innerHTML += elAppend;
	formPermintaan.insertBefore(newSection, addFormPermintaan);
});

const boxFormHarga = document.querySelector("#box-form-harga");
const main = document.querySelector("main");
main.addEventListener("change", (el) => {
	if (
		el.target.tagName == "INPUT" &&
		el.target.getAttribute("type") == "text"
	) {
		const cond = el.target.getAttribute("name").split("-");
		cond[0] == "pengiriman"
			? (pengirim[cond[1] - 1] = el.target.value)
			: (tujuan[cond[1] - 1] = el.target.value);

		cond[1] == "pengiriman"
			? (kapasitas[cond[2] - 1] = parseInt(el.target.value))
			: (permintaan[cond[2] - 1] = parseInt(el.target.value));

		if (formPengiriman.childElementCount - 2 == 1) {
			const labelInput = document.querySelector(
				`#label-${el.target.getAttribute("name")}`
			);
			if (labelInput != null) {
				labelInput.innerHTML = el.target.value;
			}
		}

		if (tujuan.length > 0 && pengirim.length > 0) {
			// Bersihkan elemen sebelumnya jika perlu
			boxFormHarga.innerHTML = "";

			for (let i = 0; i < pengirim.length; i++) {
				// Loop berdasarkan panjang pengirim
				for (let j = 0; j < tujuan.length; j++) {
					// Loop berdasarkan panjang tujuan
					const newFormHarga = document.createElement("section");
					newFormHarga.classList.add(
						"flex",
						"w-full",
						"items-center",
						"justify-between",
						"lg:justify-between",
						"gap-4"
					);
					const hargaValue =
						harga[i] && harga[i][j] !== undefined ? harga[i][j] : "";
					const elAppend = `
            <p class="font-montserrat font-bold text-grayThrid text-lg">
              <span id="label-pengiriman-${i}" class="capitalize">${pengirim[i]}</span>
              <i class="fa-solid fa-arrow-right"></i>
              <span id="label-permintaan-${j}" class="capitalize">${tujuan[j]}</span>
            </p>
            <div
              class="flex h-12 w-max border-2 border-grayThrid rounded-lg items-center justify-end px-3 pl-4 font-montserrat"
            >
              <span
                class="inline-block uppercase w-max font-bold text-grayThrid"
              >
                Rp
              </span>
              <input
                type="number"
                name="unit-harga-${i}-${j}"
                min="0"
                value="${hargaValue}"
                inputmode="numeric"
                class="h-full w-20 bg-transparent ml-2 placeholder:text-graySecondary text-graySecondary font-bold focus:outline-none selection:bg-graySecondary selection:text-white appearance-none"
              />
            </div>
          `;
					newFormHarga.innerHTML = elAppend;
					boxFormHarga.append(newFormHarga);
				}
			}
		}
	}

	if (
		el.target.tagName == "INPUT" &&
		el.target.getAttribute("type") == "number"
	) {
		const attr = el.target.getAttribute("name").split("-");
		const [indexPengirim, indexTujuan] = attr.slice(-2).map(Number);

		// Pastikan subarray `harga[indexPengirim]` sudah ada
		if (!harga[indexPengirim]) {
			harga[indexPengirim] = []; // Inisialisasi array kosong
		}

		// Masukkan nilai ke dalam array, konversi ke integer jika diperlukan
		const value = parseInt(el.target.value, 10);
		harga[indexPengirim][indexTujuan] = !isNaN(value) ? value : 0;
	}
});

const btnHitung = document.querySelector("#btn-hitung");
btnHitung.addEventListener("click", () => {
	console.log({ pengirim, kapasitas, tujuan, permintaan, harga });
	const rumus = localStorage.getItem("count");
	let result;
	switch (rumus) {
		case "2":
			result = NWC(pengirim, kapasitas, tujuan, permintaan, harga);
			console.log("NWC");
			break;
		case "3":
			result = VAM(pengirim, kapasitas, tujuan, permintaan, harga);
			console.log("VAM");
			break;

		default:
			result = leastCostMethod(pengirim, kapasitas, tujuan, permintaan, harga);
			console.log("LCM");

			break;
	}
	console.log(result);
	const tableHasil = document.querySelector("main table");
	tableHasil.innerHTML = `
    <thead>
			<tr>
					<th
							rowspan="2"
							class="border-b-2 border-r-2 border-grayMain p-2 w-32 text-grayMain"
					>
							PENGIRIMAN
					</th>
					<th
							colspan="3"
							class="border-b-2 border-grayMain p-2 text-center text-grayMain"
					>
							PENERIMA
					</th>
			</tr>
			<tr>
					${tujuan
						.map(
							(to, ind) => `
							<td
									class="border-b-2 ${
										ind + 1 != tujuan.length ? "border-r-2" : ""
									} border-grayMain p-2 w-24 text-center text-grayThrid font-bold"
							>
									${to}
							</td>
					`
						)
						.join("")}
			</tr>
    </thead>

    <tbody>
        ${pengirim
					.map(
						(from) => `
            <tr>
                <td class="border-b-2 border-r-2 border-grayMain p-2 text-grayThrid font-bold">
                    ${from}
                </td>
                ${tujuan
									.map(
										(to, ind) => `
                    <td class="border-b-2 ${
											ind + 1 != tujuan.length ? "border-r-2" : ""
										} border-grayMain p-2 text-grayThrid font-bold">
                        ${result.hasilMatrix[from][to] || "-"}
                    </td>
                `
									)
									.join("")}
            </tr>
        `
					)
					.join("")}
        <tr>
            <td class="border-b-2 border-r-2 border-grayMain p-2 font-bold">
                TOTAL
            </td>
            <td colspan="3" class="border-b-2 border-grayMain p-2 text-right text-red-600 font-bold">
                ${result.totalBiaya.toLocaleString("ID")},-
            </td>
        </tr>
    </tbody>
`;
});
