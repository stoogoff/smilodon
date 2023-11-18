<template>
	<aside>
		<h3 class="uppercase text-sm text-gray-400">Categories</h3>
		<ul>
			<li v-for="category in categories" :key="category._id">{{ category.title }}</li>
		</ul>
		<div v-if="showAddForm">
			<we-validate-field :value="categoryTitle" :rules="rules.categoryTitle" v-slot="{ error, message }">
				<we-text-input label="Title" v-model="categoryTitle" :error="error" :message="message" />
			</we-validate-field>
			<we-button-action type="primary" block :disabled="!canSave" @click="saveCategory">Save</we-button-action>
		</div>
		<we-button-action v-else small block @click="showForm">Add</we-button-action>
	</aside>
</template>
<script>

import Vue from 'vue'
import { required, validate } from 'we-ui/utils/validators'

export default Vue.component('CategoryTree', {
	async fetch() {
		this.categories = await this.$categories.all()
	},
	fetchOnServer: false,

	data() {
		return {
			categories: [],
			categoryTitle: '',
			showAddForm: false,
		}
	},

	computed: {
		rules() {
			return {
				categoryTitle: [required()],
			}
		},

		canSave() {
			return this.categoryTitle !== '' && validate(this.rules.categoryTitle, this.categoryTitle)
		},
	},

	methods: {
		showForm() {
			this.showAddForm = true
		},

		saveCategory() {
			this.$categories.create({
				title: this.categoryTitle
			})

			this.categoryTitle = ''
			this.showAddForm = false
			this.$fetch()
		},
	},
})

</script>
