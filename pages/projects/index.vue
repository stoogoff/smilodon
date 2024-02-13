<template>
	<section>
		<h1>Projects</h1>
		<p>This will allow for CRUD actions for projects</p>

		<div v-if="hasProjects">
			<ul>
				<li
					v-for="project in projects"
					:key="project._id"
				>
					<nuxt-link :to="project.slug">{{ project.title }}</nuxt-link>
				</li>
			</ul>
		</div>
		<nuxt-link class="d-button" to="/projects/create">Create Project</nuxt-link>
	</section>
</template>
<script>

import WithProjects from '~/mixins/with-projects'

export default {
	name: 'Projects',
	layout: 'site',
	mixins: [ WithProjects ],

	async fetch() {
		this.projects = await this.$projects.all()
	},
	fetchOnServer: false,
}

</script>