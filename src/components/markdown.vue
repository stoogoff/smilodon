<template>
	<div ref="content" class="prose" v-html="parsedContent" />
</template>
<script>
import Vue from 'vue'
import { markdown } from '~/utils/string'

export default Vue.component('Markdown', {
	props: {
		content: {
			type: String,
			required: true,
		},
	},

	mounted() {
		const anchors = Array.from(this.$refs.content.getElementsByTagName('a'))

		anchors.forEach(anch => {
			// recreate title attribute as a daisy-ui tooltip
			if(anch.hasAttribute('title')) {
				anch.classList.add('tooltip')
				anch.setAttribute('data-tip', anch.title)
				anch.removeAttribute('title')
			}

			// this is an internal link so use nuxt routing to redirect
			if(anch.getAttribute('href').startsWith('/')) {
				anch.onclick = () => {
					this.$nuxt.$router.push(anch.getAttribute('href'))

					return false
				}
			}
			// otherwise open it in a new window
			else {
				anch.setAttribute('target', '_blank')
			}
		})
	},

	computed: {
		parsedContent() {
			return markdown(this.content)
		},
	},
})
</script>