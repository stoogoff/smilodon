<template>
	<div class="fixed flex bg-base-100 shadow pr-4 py-1 top-0 left-0 right-0 z-10">
		<div class="flex-1">
			<nuxt-link to="/" class="btn btn-ghost text-sm btn-sm"><icon-view icon="logo" class="mr-2" /> reticula</nuxt-link>
		</div>
		<!-- div class="flex-none">
			<popup-button y="top" x="right">
				Theme: {{ selectedTheme }}
				<template #popup>
					<div class="h-56 overflow-y-auto">
						<ul>
							<li v-for="theme in themes" :key="theme" @click="chooseTheme(theme)">
								<span class="link">{{ theme }}</span>
							</li>
						</ul>
					</div>
				</template>
			</popup-button>
		</div -->
	</div>
</template>
<script>

import Vue from 'vue'
import Theme from '~/modules/theme'

export default Vue.component('AppNav', {
	data() {
		return {
			selectedTheme: Theme.currentTheme(),
		}
	},

	computed: {
		themes() {
			return Theme.allThemes()
		},
	},

	methods: {
		chooseTheme(theme) {
			Theme.setTheme(theme)
			this.selectedTheme = theme
		}
	},
})

</script>