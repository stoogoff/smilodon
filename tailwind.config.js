
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

COLOURS.forEach(({ name, ...rest }) => {
	COLOUR_MAP['st-' + name] = rest
})

module.exports = {
	content: [
		'./node_modules/vue-daisy-ui/**/*.vue',
	],
	theme: {
		extend: {
			colors: COLOUR_MAP,
		},
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: [{
			storytella: {
				'primary': BLUE.DEFAULT,
				'primary-content': WHITE,
				'secondary': GREY.DEFAULT,
				'secondary-content': BLACK.DEFAULT,
				'accent': RED.pale,
				'accent-content': RED.DEFAULT,
				'neutral': BLACK.DEFAULT,
				'base-100': WHITE,
				'base-200': GREY.light,
				'base-300': BLACK.DEFAULT,
				'base-content': BLACK.light,
				'info': '#ACD6E0',
				'info-content': BLUE.DEFAULT,
				'success': GREEN.pale,
				'success-content': GREEN.dark,
				'warning': YELLOW.pale,
				'warning-content': YELLOW.dark,
				'error': RED.DEFAULT,
				'error-content': WHITE,
			}
		},
		'winter', 'dracula'],
		darkTheme: 'storytella',
	}
}