
function Colour(name, dark, DEFAULT, light, pastel, pale) {
	this.name = name
	this.dark = dark
	this.DEFAULT = DEFAULT
	this.light = light
	this.pastel = pastel
	this.pale = pale
}

const WHITE = '#fff'
const GREY = new Colour('grey', '#A8AAAD', '#C2C4C6', '#EAEAEB', '#F7F7F7', WHITE)
const BLACK = new Colour('black', '#232323', '#3D3D3D', '#565656', '#707070', '#898989')
const BLUE = new Colour('blue', '#065E6D', '#08889E', '#62B2C4', '#95CAD8', '#ACD6E0')
const RED = new Colour('red', '#D02C0F', '#EF4223', '#F47F6A', '#F69482', '#F9BDB2')
const YELLOW = new Colour('yellow', '#C98814', '#EAA326', '#F1C16C', '#F3CA83', '#FFF8A4')
const GREEN = new Colour('green', '#6EA131', '#88C540', '#ADD77B', '#B9DD8E', '#D1E9B5')
const COLOURS = [GREY, BLACK, BLUE, RED, YELLOW, GREEN]
const COLOUR_MAP = {}

module.exports = {
	content: [
		'./node_modules/vue-daisy-ui/**/*.vue',
	],
	plugins: [require('daisyui')],
	daisyui: {
		themes: [{
			storytella: {
				// colours
				'primary': '#08889E',
				'primary-content': '#FFFFFF',
				'secondary': '#EAA326',
				'secondary-content': '#3D3D3D',
				'accent': '#F9BDB2',
				'accent-content': '#EF4223',
				'neutral': '#232323',
				'neutral-content': '#EAEAEB',
				'base-100': '#FFFFFF',
				'base-200': '#EAEAEB',
				'base-300': '#898989',
				'base-content': '#232323',
				'info': '#ACD6E0',
				'info-content': '#065E6D',
				'success': '#D1E9B5',
				'success-content': '#6EA131',
				'warning': '#FFF8A4',
				'warning-content': '#C98814',
				'error': '#EF4223',
				'error-content': '#FFFFFF',

				// border radius
				'--rounded-box': '1rem',
				'--rounded-btn': '0.5rem',
			}
		}],
		darkTheme: 'storytella',
	}
}
