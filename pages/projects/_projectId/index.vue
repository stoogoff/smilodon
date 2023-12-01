<template>
	<section>
		<we-loading-spinner v-if="project === null" />
		<div v-else>
			<h1>{{ project.title }}</h1>
			<div v-html="project.description" />
		</div>
	</section>
</template>
<script>

export default {
	name: 'ProjectView',

	async fetch() {
		const { params } = this.$nuxt.context

		this.project = await this.$projects.byId(params.projectId)
	},
	fetchOnServer: false,

	data() {
		return {
			project: null,
		}
	},
}

</script>