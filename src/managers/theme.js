
import Vue from 'vue'
import { local } from 'vue-daisy-ui/utils/storage'
import { toTitleCase } from 'vue-daisy-ui/utils/string'
import { THEME } from '~/utils/config'

export default {
	allThemes() {
		return [
			'light',
			'dark',
			'cupcake',
			'bumblebee',
			'emerald',
			'corporate',
			'synthwave',
			'retro',
			'cyberpunk',
			'valentine',
			'halloween',
			'garden',
			'forest',
			'aqua',
			'lofi',
			'pastel',
			'fantasy',
			'wireframe',
			'black',
			'luxury',
			'dracula',
			'cmyk',
			'autumn',
			'business',
			'acid',
			'lemonade',
			'night',
			'coffee',
			'winter',
			'dim',
			'nord',
			'sunset',
		].map(s => toTitleCase(s)).sort()
	},

	loadTheme() {
		document.documentElement.setAttribute('data-theme', this.currentTheme().toLowerCase())
	},

	currentTheme() {
		return local.has(THEME) ? local.get(THEME) : 'Light'
	},

	setTheme(theme) {
		local.set(THEME, theme)
		this.loadTheme()
	},
}
