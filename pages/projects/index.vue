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
					{{ project.title }}
				</li>
			</ul>
		</div>
		<we-button-action @click="createProject">Create Project</we-button-action>
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

	methods: {
		createProject() {
			this.$nuxt.context.redirect('/projects/create')
		},
	},
}

</script>