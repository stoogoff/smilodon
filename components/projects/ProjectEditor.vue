<template>
	<div>
		<we-validate-field :value="title" :rules="rules.title" v-slot="{ error, message }">
			<we-text-input label="Title" v-model="title" :error="error" :message="message" />
		</we-validate-field>
		<html-editor label="Description" v-model="description" />
		<we-button-group>
			<we-button-action type="primary" block :disabled="!canSave" @click="save">Save</we-button-action>
			<we-button-action block @click="cancel">Cancel</we-button-action>
		</we-button-group>
	</div>
</template>
<script>

import Vue from 'vue'
import { required, validate } from 'we-ui/utils/validators'

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

		cancel() {
			this.$emit('cancel')
		},
	},
})

</script>