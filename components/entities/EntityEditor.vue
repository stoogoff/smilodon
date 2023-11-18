<template>
	<div>
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
				<select-input label="Icon" v-model="icon" :items="icons" />
				<we-validate-field :value="category" :rules="rules.category" v-slot="{ error, message }">
					<select-input label="Category" v-model="category" :items="categories" display="title" :error="error" :message="message" />
				</we-validate-field>
				<div class="flex">
					<div class="flex-grow">
						<we-text-input label="Tag" v-model="currentTag" />
					</div>
					<div class="mt-12 ml-2">
						<we-button-action @click="addTag" small :disabled="!canAddTag">Add</we-button-action>
					</div>
				</div>
				<div>
					<tag-view v-for="tag in tags" :key="tag" :tag="tag" />
				</div>
			</we-tab-panel>
		</we-tab-group>
		<div class="fixed bottom-0 left-0 right-0 p-2">
			<we-button-action type="primary" block :disabled="!canContinue" @click="save">Save</we-button-action>
		</div>
	</div>
</template>
<script>

import Vue from 'vue'
import { required, validateBatch } from 'we-ui/utils/validators'
import { sortByProperty } from 'we-ui/utils/list'
import { EventBus } from '~/utils/event-bus'
import { ENTITIES_UPDATED } from '~/utils/config'
import { toTitleCase } from '~/utils/string'

export default Vue.component('EntityEditor', {
	props: {
		entity: {
			type: Object,
			default: null,
		},
	},

	async fetch() {
		const categories = await this.$categories.all()

		this.categories = categories.sort(sortByProperty('title'))
	},
	fetchOnServer: false,

	data() {
		return {
			categories: [],
			title: '',
			description: '',
			category: '',
			currentTag: '',
			tags: [],
			icon: '',
			error: false,
		}
	},

	mounted() {
		if(this.entity) {
			this.title = this.entity.title || ''
			this.description = this.entity.description || ''
			this.category = this.entity.category || ''
			this.tags = this.entity.tags || []
			this.icon = this.entity.icon ? toTitleCase(this.entity.icon)  : ''
		}
	},

	computed: {
		icons() {
			return ['Account', 'Brush', 'Folder', 'Music', 'Shield', 'Ufo']
		},

		rules() {
			return {
				title: [required()],
				description: [required()],
				category: [required()],
			}
		},

		canAddTag() {
			return this.currentTag !== ''
		},

		canContinue() {
			return validateBatch(this.rules, {
				title: this.title,
				description: this.description,
				category: this.category,
			})
		},
	},

	methods: {
		addTag() {
			this.tags = [ ...this.tags, this.currentTag ]
			this.currentTag = ''
		},

		async save() {
			// TODO loading spinner
			let newEntity

			// if the component has an entity save it
			// otherwise create new
			if(this.entity) {
				newEntity = await this.$entities.save({
					...this.entity,
					title: this.title,
					description: this.description,
					category: this.category._id,
					tags: this.tags,
					icon: this.icon.toLowerCase(),
				})
			}
			else {
				newEntity = await this.$entities.create({
					title: this.title,
					description: this.description,
					category: this.category._id,
					tags: this.tags,
					icon: this.icon.toLowerCase(),
				})
			}

			EventBus.$emit(ENTITIES_UPDATED, newEntity)
			this.$emit('save', newEntity)
		},
	},
})
</script>