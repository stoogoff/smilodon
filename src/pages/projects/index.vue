<template>
	<section>
		<h1>Projects</h1>
		<p>This will allow for CRUD actions for projects</p>
		<nuxt-link class="btn" to="/projects/create">Create Project</nuxt-link>

		<d-card
			v-for="project in projects"
			:key="project._id"
			class="mb-4"
		>
			<d-card-title>{{ project.title }}</d-card-title>
			<markdown :content="project.description" />
			<d-card-actions>
				<nuxt-link class="btn btn-primary" :to="project.slug">View</nuxt-link>
			</d-card-actions>
		</d-card>
	</section>
</template>
<script>

import WithProjects from '~/mixins/with-projects'

export default {
	name: 'Projects',
	layout: 'no-project',
	mixins: [ WithProjects ],

	async fetch() {
		this.projects = await this.$projects.all()
	},
	fetchOnServer: false,
}

</script>