module.exports = {
	content: [
		'./node_modules/vue-daisy-ui/**/*.vue',
	],
	plugins: [require('daisyui')],
	daisyui: {
		themes: [{
			storytella: {
				'primary': '#08889E',
				'primary-content': 'white',
				'secondary': '#C2C4C6',
				'secondary-content': '#3D3D3D',
				'accent': '#D02C0F',
				'accent-content': '#F9BDB2',
				'neutral': '#3D3D3D',
				'base-100': 'white',
				'base-200': '#EAEAEB',
				'base-300': '#D6D6D6',
				'base-content': '#424242',
				'info': '#ACD6E0',
				'info-content': '#065E6D',
				'success': '#D1E9B5',
				'success-content': '#6EA131',
				'warning': '#FFF8A4',
				'warning-content': '#CA8814',
				'error': '#F9BDB2',
				'error-content': '#D02C0F',
			}
		},
		'winter', 'dracula'],
		darkTheme: 'storytella',
	}
}