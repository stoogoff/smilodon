<template>
	<section>
		<loading-spinner v-if="element === null" />
		<d-card v-else>
			<d-card-title>
				Editing: {{ element.title }}
			</d-card-title>
			<element-editor :element="element" @save="redirect" @cancel="redirect" />
		</d-card>
	</section>
</template>
<script>

import WithElement from '~/mixins/with-element'

export default {
	layout: 'no-action',
	name: 'ElementEdit',
	mixins: [ WithElement ],

	methods: {
		redirect(element) {
			this.$nuxt.$router.push(this.element.slug)
		},
	},
}

</script>