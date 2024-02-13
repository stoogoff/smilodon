<template>
	<div>
		<we-validate-field :value="title" :rules="rules.title" v-slot="{ error, message }">
			<we-text-input label="Title" v-model="title" :error="error" :message="message" />
		</we-validate-field>
		<select-input label="Parent" v-model="parent" :items="categories" display="title" />
		<d-join horizontal>
			<d-button class="join-item" primary sm block :disabled="!canSave" @click="save">Save</d-button>
			<d-button class="join-item" block sm @click="cancel">Cancel</d-button>
		</d-join>
	</div>
</template>
<script>

import Vue from 'vue'
import { sortByProperty } from 'we-ui/utils/list'
import { required, validate } from 'we-ui/utils/validators'

export default Vue.component('CategoryEditor', {
	async fetch() {
		const { params } = this.$nuxt.context
		const categories = await this.$categories.allByProject(params.projectId)

		this.categories = categories.sort(sortByProperty('title'))
	},
	fetchOnServer: false,

	data() {
		return {
			title: '',
			parent: '',
			categories: [],
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
		cancel() {
			this.$emit('cancel')
		},

		async save() {
			let newCategory
			const { params } = this.$nuxt.context
			const project = await this.$projects.byId(params.projectId)

			newCategory = await this.$categories.create({
				title: this.title,
				parent: this.parent ? this.parent._id : '',
				project: project._id,
			})

			this.$emit('save', newCategory)

			await this.$fetch()
		},
	},
})

</script>