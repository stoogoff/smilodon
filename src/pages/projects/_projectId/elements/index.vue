<template>
	<section>
		<h1>Elements</h1>
		<element-table v-if="hasElements" :elements="elements" />
		<p v-else><em>No elements</em></p>
	</section>
</template>
<script>

import WithElements from '~/mixins/with-elements'

export default {
	name: 'ElementsIndex',
	mixins: [ WithElements ],

	async fetch() {
		const { params } = this.$nuxt.context

		this.elements = await this.$elements.allByProject(params.projectId)
	},
	fetchOnServer: false,
}

</script>