<template>
	<d-card>
		<h1>Create Project</h1>

		<project-editor @save="save" @cancel="cancel" />
	</d-card>
</template>
<script>

import { required, validate } from 'vue-daisy-ui/utils/validators'
import { EDITOR_TOOLBAR } from '~/utils/config'

export default {
	name: 'CreateProject',
	layout: 'no-project',

	methods: {
		save(project) {
			this.$nuxt.$router.push(project.slug)
		},

		cancel() {
			this.$nuxt.$router.push('/projects')
		},
	},
}

</script>