<template>
	<screen-slide>
		<nav-bar>
			<template #title>
				Publish
			</template>
			<template #buttons>
				<nav-button icon="close" @click="$emit('close')" />
			</template>
			<div class="hidden md:flex md:flex-row md:ml-auto relative">
				<nav-item icon="close" @click="$emit('close')">Close</nav-item>
			</div>
		</nav-bar>
		<div class="pt-16 px-2 pb-2">
			<validate-field :value="title" :rules="rules.title" v-slot="{ error, message }">
				<text-input label="Title" v-model="title" :error="error" :message="message" />
			</validate-field>
			<validate-field :value="summary" :rules="rules.summary" v-slot="{ error, message }">
				<text-area label="Summary" v-model="summary" :error="error" :message="message" />
			</validate-field>
			<div>
				<radio-group
					v-for="(cat, idx) in categories"
					v-model="category"
					:label="cat"
					:data="cat"
					:key="`category_${idx}`"
				/>
			</div>
		</div>
		<div class="fixed bottom-0 left-0 right-0 p-2">
			<button-action type="primary" block :disabled="!canContinue">Save</button-action>
		</div>
	</screen-slide>
</template>
<script>
import Vue from 'vue'
import { required, validateBatch } from '~/utils/validators'

export default Vue.component('PublishView', {
	data() {
		return {
			title: '',
			summary: '',
			category: null,
			categories: ['General', 'Gaming', 'Music', 'Writing'],
			error: false,
		}
	},

	computed: {
		rules() {
			return {
				title: [required()],
				summary: [required()],
				category: [required()],
			}
		},

		canContinue() {
			return validateBatch(this.rules, {
				title: this.title,
				summary: this.summary,
				category: this.category,
			})
		},
	},
})
</script>