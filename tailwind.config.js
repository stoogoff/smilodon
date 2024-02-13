module.exports = {
	content: [
		'./node_modules/we-ui/components/**/*.vue',
		'./node_modules/vue-daisy-ui/components/**/*.vue',
	],
	plugins: [require('daisyui')],
	daisyui: {
		themes: ['winter', 'dracula'],
		darkTheme: 'winter',
	}
}