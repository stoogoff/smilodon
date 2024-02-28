<template>
	<section>
		<loading-spinner v-if="$fetchState.pending" />
		<d-alert v-else-if="project === null" warning>
			Unable to load project.
		</d-alert>
		<d-card v-else>
			<d-card-title>Edit: {{ project.title }}</d-card-title>
			<project-editor :project="project" @save="save" @cancel="cancel" />
		</d-card>
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