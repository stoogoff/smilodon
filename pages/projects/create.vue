<template>
	<section>
		<h1>Create Project</h1>

		<we-validate-field :value="title" :rules="rules.title" v-slot="{ error, message }">
			<we-text-input label="Title" v-model="title" :error="error" :message="message" />
		</we-validate-field>
		<client-only>
			<div class="font-sans font-semibold text-xs uppercase inline-block mb-2">Description</div>
			<vue-editor v-model="description" :editor-toolbar="toolbar" />
		</client-only>
		<we-button-group>
			<we-button-action type="primary" block :disabled="!canSave" @click="save">Save</we-button-action>
			<we-button-action block @click="cancel">Cancel</we-button-action>
		</we-button-group>
	</section>
</template>
<script>

import { required, validate } from 'we-ui/utils/validators'
import { EDITOR_TOOLBAR } from '~/utils/config'

export default {
	name: 'CreateProject',

	data() {
		return {
			title: '',
			description: '',
		}
	},

	computed: {
		rules() {
			return {
				title: [required()],
			}
		},

		toolbar() {
			return EDITOR_TOOLBAR
		},

		canSave() {
			return validate(this.rules.title, this.title)
		},
	},

	methods: {
		async save() {
			const project = await this.$projects.create({
				title: this.title,
				description: this.description,
			})

			this.$nuxt.context.redirect(project.slug)
		},

		cancel() {
			this.$nuxt.context.redirect('/projects')
		},
	},
}

</script>