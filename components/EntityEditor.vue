<template>
	<we-screen-slide>
		<we-navbar>
			<template #title>
				Publish
			</template>
			<template #buttons>
				<we-nav-button icon="close" @click="$emit('close')" />
			</template>
			<div class="hidden md:flex md:flex-row md:ml-auto relative">
				<nav-item :icon="closeIcon" @click="$emit('close')">Close</nav-item>
			</div>
		</we-navbar>
		<we-tab-group>
			<we-tab-panel title="Entity">
				<we-validate-field :value="title" :rules="rules.title" v-slot="{ error, message }">
					<we-text-input label="Title" v-model="title" :error="error" :message="message" />
				</we-validate-field>
				<we-validate-field :value="description" :rules="rules.description" v-slot="{ error, message }">
					<we-text-area label="Description" v-model="description" :error="error" :message="message" />
				</we-validate-field>
			</we-tab-panel>
			<we-tab-panel title="Properties">
				<p>Properties</p>
			</we-tab-panel>
			<we-tab-panel title="Metadata">
				<we-validate-field :value="title" :rules="rules.title" v-slot="{ error, message }">
					<select-input label="Category" v-model="category" :items="['One', 'Two', 'Three']" :error="error" :message="message" />
				</we-validate-field>
			</we-tab-panel>
		</we-tab-group>
		<div class="fixed bottom-0 left-0 right-0 p-2">
			<we-button-action type="primary" block :disabled="!canContinue" @click="save">Save</we-button-action>
		</div>
	</we-screen-slide>
</template>
<script>
import Vue from 'vue'
import { required, validateBatch } from 'we-ui/utils/validators'
import { close } from '~/utils/icons'
import { EventBus } from '~/utils/event-bus'
import { ENTITIES_UPDATED } from '~/utils/config'

export default Vue.component('PublishView', {
	data() {
		return {
			title: '',
			description: '',
			category: '',
			error: false,
		}
	},

	computed: {
		rules() {
			return {
				title: [required()],
				description: [required()],
				category: [required()],
			}
		},

		canContinue() {
			return validateBatch(this.rules, {
				title: this.title,
				description: this.description,
				category: this.category,
			})
		},

		closeIcon() {
			return close
		},
	},

	methods: {
		async save() {
			// TODO loading spinner
			// save data
			const entity = await this.$entities.create({
				title: this.title,
				description: this.description,
				category: this.category,
			})

			EventBus.$emit(ENTITIES_UPDATED, entity)
			this.$emit('close')
		},
	},
})
</script>