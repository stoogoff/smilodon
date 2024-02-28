<template>
	<section>
		<loading-spinner v-if="$fetchState.pending" />
		<d-alert v-else-if="project === null" warning>
			Unable to load project.
		</d-alert>
		<d-card v-else class="bg-base-100 shadow">
			<d-card-title class="border-b border-st-grey pb-2 mb-4 -mt-8">Edit: {{ project.title }}</d-card-title>
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