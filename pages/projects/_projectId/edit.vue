<template>
	<section>
		<we-loading-spinner v-if="$fetchState.pending" />
		<we-alert-view v-else-if="project === null" type="warning">
			Unable to load project.
		</we-alert-view>
		<div v-else>
			<h1>Edit: {{ project.title }}</h1>

			<project-editor :project="project" @save="save" @cancel="cancel" />
		</div>
	</section>
</template>
<script>

export default {
	name: 'ProjectEdit',

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

	methods: {
		save(project) {
			this.$nuxt.$router.push(project.slug)
		},

		cancel() {
			this.$nuxt.$router.push(this.project.slug)
		},
	}
}

</script>