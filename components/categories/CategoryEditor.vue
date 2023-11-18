<template>
	<div>
		<we-validate-field :value="title" :rules="rules.title" v-slot="{ error, message }">
			<we-text-input label="Title" v-model="title" :error="error" :message="message" />
		</we-validate-field>
		<select-input label="Parent" v-model="parent" :items="categories" display="title" />
		<we-button-group>
			<we-button-action type="primary" block :disabled="!canSave" @click="save">Save</we-button-action>
			<we-button-action block @click="cancel">Cancel</we-button-action>
		</we-button-group>
	</div>
</template>
<script>

import Vue from 'vue'
import { sortByProperty } from 'we-ui/utils/list'
import { required, validate } from 'we-ui/utils/validators'
import { EventBus } from '~/utils/event-bus'
import { CATEGORIES_UPDATED } from '~/utils/config'

export default Vue.component('CategoryEditor', {
	async fetch() {
		const categories = await this.$categories.all()

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

			newCategory = await this.$categories.create({
				title: this.title,
				parent: this.parent ? this.parent._id : '',
			})

			EventBus.$emit(CATEGORIES_UPDATED, newCategory)
			this.$emit('save', newCategory)

			await this.$fetch()
		},
	},
})

</script>