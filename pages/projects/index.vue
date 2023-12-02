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
		<we-link-action to="/projects/create">Create Project</we-link-action>
	</section>
</template>
<script>

export default {
	name: 'Projects',
	layout: 'site',

	async fetch() {
		this.projects = await this.$projects.all()
	},
	fetchOnServer: false,

	data() {
		return {
			projects: [],
		}
	},

	computed: {
		hasProjects() {
			return this.projects.length > 0
		},
	},
}

</script>