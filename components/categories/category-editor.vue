<template>
	<div>
		<d-validator-control
			label="Title"
			:value="title"
			:rules="rules.title"
			v-slot="{ error }">
			<d-input v-model="title" bordered :error="error" />
		</d-validator-control>
		<d-form-control label="Parent">
			<d-select
				v-model="parent"
				:items="categories"
				id="_id"
				placeholder="(none)"
				bordered
			/>
		</d-form-control>
		<div class="py-4 flex space-x-2 justify-end">
			<d-button :sm="sm" secondary @click="cancel">Cancel</d-button>
			<d-button :sm="sm" primary :disabled="!canSave" @click="save">Save</d-button>
		</div>
	</div>
</template>
<script>

import Vue from 'vue'
import { sortByProperty } from 'vue-daisy-ui/utils/list'
import { required, validate } from 'vue-daisy-ui/utils/validators'

export default Vue.component('CategoryEditor', {
	props: {
		category: {
			type: Object,
			default: null,
		},
		sm: {
			type: Boolean,
			default: false,
		},
	},

	async fetch() {
		const { params } = this.$nuxt.context
		const categories = await this.$categories.allByProject(params.projectId)

		this.categories = categories.sort(sortByProperty('title'))

		if(this.parentId) {
			this.parent = await this.$categories.byId(this.parentId)
		}
	},
	fetchOnServer: false,

	data() {
		return {
			title: '',
			parent: null,
			parentId: null,
			categories: [],
		}
	},

	async mounted() {
		if(this.category) {
			this.title = this.category.title
			this.parentId = this.category.parent
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

			if(this.category) {
				newCategory = await this.$categories.save({
					...this.category,
					title: this.title,
					parent: this.parent ? this.parent._id : '',
					project: project._id,
				})
			}
			else {
				newCategory = await this.$categories.create({
					title: this.title,
					parent: this.parent ? this.parent._id : '',
					project: project._id,
				})
			}

			this.$emit('save', newCategory)
		},
	},
})

</script>