<template>
	<div>
		<we-tab-group>
			<we-tab-panel title="Entity">
				<we-validate-field :value="title" :rules="rules.title" v-slot="{ error, message }">
					<we-text-input label="Title" v-model="title" :error="error" :message="message" />
				</we-validate-field>
				<we-text-area label="Description" v-model="description" />
			</we-tab-panel>
			<we-tab-panel title="Properties">
				<p><em>Use the buttons below to add custom properties.</em></p>
				<property-editor
					v-for="(property, index) in properties"
					:key="property.id"
					:property="property"
					@update="updateProperty"
					@delete="deleteProperty" />
				<we-button-action @click="addProperty">Add Property</we-button-action>
			</we-tab-panel>
			<we-tab-panel title="Metadata">
				<select-input label="Icon" v-model="icon" :items="icons" />
				<select-input label="Category" v-model="category" :items="categories" display="title" />
				<div class="flex">
					<div class="flex-grow">
						<we-text-input label="Tag" v-model="currentTag" />
					</div>
					<div class="mt-12 ml-2">
						<we-button-action @click="addTag" small :disabled="!canAddTag">Add</we-button-action>
					</div>
				</div>
				<div>
					<tag-list :tags="tags" :editable="true" @delete="deleteTag" />
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
import { required, validate } from 'we-ui/utils/validators'
import { createId } from 'we-ui/utils/string'
import { EventBus } from '~/utils/event-bus'
import { toTitleCase } from '~/utils/string'
import { DEFAULT_PROPERTY } from '~/utils/config'

export default Vue.component('EntityEditor', {
	props: {
		entity: {
			type: Object,
			default: null,
		},
	},

	async fetch() {
		this.categories = await this.$categories.all()
	},
	fetchOnServer: false,

	data() {
		return {
			categories: [],
			title: '',
			description: '',
			category: null,
			currentTag: '',
			tags: [],
			icon: '',
			properties: [],
			error: false,
		}
	},

	async mounted() {
		if(this.entity) {
			const category = this.entity.category ? await this.$categories.byId(this.entity.category) : null

			this.title = this.entity.title || ''
			this.description = this.entity.description || ''
			this.category = category
			this.tags = this.entity.tags || []
			this.properties = this.entity.properties || []
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
			}
		},

		canAddTag() {
			return this.currentTag !== ''
		},

		canContinue() {
			return validate(this.rules.title, this.title)
		},
	},

	methods: {
		addProperty() {
			this.properties = [
				...this.properties,
				{ id: createId(), ...DEFAULT_PROPERTY },
			]
		},

		deleteProperty(id) {
			this.properties =
				this.properties.filter(prop => prop.id !== id)
		},

		updateProperty(property) {
			const prop = this.properties.find(
				({ id }) => property.id === id
			)
			if(!prop) return

			prop.name = property.name
			prop.type = property.type
			prop.value = property.value
		},

		addTag() {
			this.tags = [ ...this.tags, this.currentTag ]
			this.currentTag = ''
		},

		deleteTag(tag, index) {
			this.tags = this.tags.filter((tag, idx) => index !== idx)
		},

		async save() {
			// TODO loading spinner
			let newEntity
			const category = this.category ? this.category._id : ''

			// if the component has an entity save it
			// otherwise create new
			if(this.entity) {
				newEntity = await this.$entities.save({
					...this.entity,
					title: this.title,
					description: this.description,
					category,
					properties: this.properties,
					tags: this.tags,
					icon: this.icon.toLowerCase(),
				})
			}
			else {
				newEntity = await this.$entities.create({
					title: this.title,
					description: this.description,
					category,
					properties: this.properties,
					tags: this.tags,
					icon: this.icon.toLowerCase(),
				})
			}

			this.$emit('save', newEntity)
		},
	},
})
</script>