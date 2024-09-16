<template>
	<div>
		<d-validator-control
			label="Title"
			:value="title"
			:rules="rules.title"
			v-slot="{ error }"
			class="py-4"
		>
			<d-input bordered v-model="title" :error="error" />
		</d-validator-control>
		<editor label="Description" v-model="description" v-slot="{ editor }" />
		<div class="py-4 grid grid-cols-2 space-x-2">
			<d-button neutral @click="$emit('cancel')">Cancel</d-button>
			<d-button primary :disabled="!canSave" @click="save">Save</d-button>
		</div>
	</div>
</template>
<script>

import Vue from 'vue'
import { required, validate } from 'vue-daisy-ui/utils/validators'

export default Vue.component('ProjectEditor', {
	props: {
		project: {
			type: Object,
			default: null,
		}
	},

	data() {
		return {
			title: '',
			description: '',
		}
	},

	mounted() {
		if(this.project) {
			this.title = this.project.title
			this.description = this.project.description
		}
	},

	computed: {
		rules() {
			return {
				title: [required()],
			}
		},

		canSave() {
			return this.title !== '' && validate(this.rules.title, this.title)
		},
	},

	methods: {
		async save() {
			let newProject

			if(this.project) {
				newProject = await this.$projects.save({
					...this.project,
					title: this.title,
					description: this.description,
				})
			}
			else {
				newProject = await this.$projects.create({
					title: this.title,
					description: this.description,
				})
			}

			this.$emit('save', newProject)
		},
	},
})

</script>