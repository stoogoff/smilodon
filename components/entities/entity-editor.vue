<template>
	<div class="p-4">
		<d-tabs bordered>
			<d-tab label="Entity" group="entity-editor" active />
			<d-tab-content>
				<d-validator-control
					label="Title"
					:value="title"
					:rules="rules.title"
					v-slot="{ error }">
					<d-input v-model="title" :error="error" bordered />
				</d-validator-control>
				<editor label="Description" v-model="description" />
			</d-tab-content>
			<d-tab label="Properties" group="entity-editor" />
			<d-tab-content>
				<p><em>Use the buttons below to add custom properties.</em></p>
				<property-editor
					v-for="(property, index) in properties"
					:key="property.id"
					:property="property"
					@update="updateProperty"
					@delete="deleteProperty" />
				<d-button @click="addProperty">Add Property</d-button>
			</d-tab-content>
			<d-tab label="Metadata" group="entity-editor" />
			<d-tab-content>
				<d-form-control label="Icon">
					<d-simple-select
						bordered
						v-model="icon"
						:items="icons"
						placeholder="(none)" />
				</d-form-control>
				<d-form-control label="Category">
					<d-select
						bordered
						v-model="category"
						:items="categories"
						id="_id" />
				</d-form-control>
				<div class="flex">
					<div class="flex-grow">
						<d-form-control label="Tag">
							<d-input v-model="currentTag" bordered />
						</d-form-control>
					</div>
					<div class="mt-12 ml-2">
						<d-button @click="addTag" sm :disabled="!canAddTag">Add</d-button>
					</div>
				</div>
				<div>
					<tag-editor :tags="tags" @delete="deleteTag" />
				</div>
			</d-tab-content>
		</d-tabs>
		<div class="fixed bottom-0 left-0 right-0 p-2">
			<d-button primary block :disabled="!canSave" @click="save">Save</d-button>
		</div>
	</div>
</template>
<script>

import Vue from 'vue'
import { required, validate } from 'vue-daisy-ui/utils/validators'
import { createId } from 'vue-daisy-ui/utils/string'
import { toTitleCase } from '~/utils/string'
import { DEFAULT_PROPERTY, EDITOR_TOOLBAR } from '~/utils/config'

export default Vue.component('EntityEditor', {
	props: {
		entity: {
			type: Object,
			default: null,
		},
	},

	async fetch() {
		const { params } = this.$nuxt.context

		this.categories = await this.$categories.allByProject(params.projectId)
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

		canSave() {
			return this.title !== '' && validate(this.rules.title, this.title)
		},

		toolbar() {
			return EDITOR_TOOLBAR
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
				const { params } = this.$nuxt.context
				const project = await this.$projects.byId(params.projectId)

				newEntity = await this.$entities.create({
					title: this.title,
					description: this.description,
					category,
					project: project._id,
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