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
import { createId, toTitleCase } from 'vue-daisy-ui/utils/string'
import WithStore from '~/mixins/with-store'
import { DEFAULT_PROPERTY, EDITOR_TOOLBAR, DEFAULT_ENTITY_ID } from '~/utils/config'
import { local } from '~/utils/storage'

export default Vue.component('EntityEditor', {
	mixins: [ WithStore ],

	props: {
		entity: {
			type: Object,
			default: null,
		},
	},

	async fetch() {
		const { params } = this.$nuxt.context

		this.categories = [
			{ _id: '', title: '(none)' },
			...(await this.$categories.allByProject(params.projectId)),
		]
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
		const ID = this.entity ? this.entity._id : DEFAULT_ENTITY_ID

		if(local.has(ID)) {
			const stored = local.get(ID)
			await this.setStateFromEntity({
				...stored,
				_id: ID,
				category: stored.category ? stored.category._id : ''
			})
		}
		else if(this.entity) {
			await this.setStateFromEntity(this.entity)
		}

		this.startSave(ID, [
			'title',
			'description',
			'category',
			'tags',
			'properties',
			'icon',
		])
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
		async setStateFromEntity(entity) {
			const category = entity.category ? await this.$categories.byId(entity.category) : null

			this.title = entity.title || ''
			this.description = entity.description || ''
			this.category = category
			this.tags = entity.tags || []
			this.properties = entity.properties || []
			this.icon = entity.icon ? toTitleCase(entity.icon)  : ''
		},

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

			this.clearData(this.entity ? this.entity._id : DEFAULT_ENTITY_ID)
			this.$emit('save', newEntity)
		},
	},
})
</script>