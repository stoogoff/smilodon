<template>
	<div>
		<d-validator-control
			label="Title"
			:value="title"
			:rules="rules.title"
			v-slot="{ error }">
			<d-input v-model="title" :error="error" />
		</d-validator-control>
		<d-form-control label="Parent">
			<d-select
				v-model="parent"
				:items="categories"
				id="_id"
				placeholder="(none)"
			/>
		</d-form-control>
		<div class="py-4 flex space-x-2 justify-end">
			<d-button secondary sm @click="cancel">Cancel</d-button>
			<d-button primary sm :disabled="!canSave" @click="save">Save</d-button>
		</div>
	</div>
</template>
<script>

import Vue from 'vue'
import { sortByProperty } from 'vue-daisy-ui/utils/list'
import { required, validate } from 'vue-daisy-ui/utils/validators'

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
			parent: null,
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