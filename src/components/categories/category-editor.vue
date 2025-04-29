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
				v-model="actualParent"
				:items="categories"
				id="_id"
				placeholder="(none)"
				bordered
			/>
		</d-form-control>
		<d-join class="grid grid-cols-2">
			<d-button class="join-item" :sm="sm" @click="$emit('cancel')">Cancel</d-button>
			<d-button class="join-item" :sm="sm" primary :disabled="!canSave" @click="save">Save</d-button>
		</d-join>
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
		parent: {
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
			this.actualParent = await this.$categories.byId(this.parentId)
		}
	},
	fetchOnServer: false,

	data() {
		return {
			title: '',
			actualParent: this.parent,
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
		async save() {
			let newCategory
			const { params } = this.$nuxt.context
			const project = await this.$projects.byId(params.projectId)

			if(this.category) {
				newCategory = await this.$categories.save({
					...this.category,
					title: this.title,
					parent: this.actualParent ? this.actualParent._id : '',
					project: project._id,
				})
			}
			else {
				newCategory = await this.$categories.create({
					title: this.title,
					parent: this.actualParent ? this.actualParent._id : '',
					project: project._id,
				})
			}

			this.$emit('save', newCategory)
		},
	},
})

</script>