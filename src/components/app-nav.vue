<template>
	<div class="fixed flex bg-base-100 shadow px-4 py-1 top-0 left-0 right-0 z-10">
		<div class="flex-1">
			<nuxt-link to="/" class="btn btn-ghost text-sm btn-sm"><icon-view icon="logo" /> Primordium</nuxt-link>
		</div>
		<div class="flex-none">
			<popup-button y="top" x="right">
				{{ selectedTheme }}
				<template #popup>
					<ul>
						<li v-for="theme in themes" :key="theme" @click="chooseTheme(theme)">
							<span class="link">{{ theme }}</span>
						</li>
					</ul>
				</template>
			</popup-button>
		</div>
	</div>
</template>
<script>

import Vue from 'vue'
import ThemeManager from '~/managers/theme'

export default Vue.component('AppNav', {
	data() {
		return {
			selectedTheme: ThemeManager.currentTheme(),
		}
	},

	computed: {
		themes() {
			return ThemeManager.allThemes()
		},
	},

	methods: {
		chooseTheme(theme) {
			ThemeManager.setTheme(theme)
			this.selectedTheme = theme
		}
	},
})

</script>