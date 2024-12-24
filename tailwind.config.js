/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,js}", "./index.html"],
	theme: {
		extend: {
			fontFamily: {
				bree: ["Bree Serif"],
				montserrat: ["Montserrat"],
			},
			colors: {
				grayMain: "#1E1E1E",
				graySecondary: "#3F3F3F",
				grayThrid: "#656565",
				whiteMain: "#F8F8F8",
				whiteSecondary: "#FAFAFA",
				redMain: "#DA4949",
				redHover: "#D43232",
				greenMain: "#49DA74",
				greenHover: "#31CD60",
			},
		},
	},
	plugins: [],
};
