<template>
	<div class="p-4">
		<d-tabs bordered>
			<d-tab label="Element" group="element-editor" active />
			<d-tab-content>
				<d-validator-control
					label="Title"
					:value="title"
					:rules="rules.title"
					v-slot="{ error }">
					<d-input v-model="title" :error="error" bordered />
				</d-validator-control>
				<editor label="Description" v-model="description" :link-search="searchElements" />
				<!-- d-textarea class="w-full h-64" bordered v-model="description" / -->
			</d-tab-content>
			<d-tab label="Properties" group="element-editor" />
			<d-tab-content>
				<p><em>Use the buttons below to add custom properties.</em></p>
				<property-editor
					v-for="(property, index) in properties"
					:show-labels="index === 0"
					:key="property.id"
					:property="property"
					:properties="existingPropertyNames"
					:values="existingPropertyValues"
					@update="updateProperty"
					@delete="deleteProperty" />
				<d-button @click="addProperty" sm class="mt-2">Add Property</d-button>
			</d-tab-content>
			<d-tab label="Metadata" group="element-editor" />
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
							<d-autocomplete v-model="currentTag" bordered :options="existingTags" />
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
		<d-join
			:class="overlay ? 'fixed bottom-0 left-0 right-0 p-2' : ''"
			class="py-4 grid grid-cols-2">
			<d-button class="join-item" @click="$emit('cancel')">Cancel</d-button>
			<d-button class="join-item" primary :disabled="!canSave" @click="save">Save</d-button>
		</d-join>
	</div>
</template>
<script>

import Vue from 'vue'
import { required, validate } from 'vue-daisy-ui/utils/validators'
import { createId, toTitleCase, search } from 'vue-daisy-ui/utils/string'
import Diff from '~/modules/diff'
import WithStore from '~/mixins/with-store'
import {
	DEFAULT_PROPERTY,
	DEFAULT_ELEMENT_ID,
	SHOW_MESSAGE,
} from '~/utils/config'
import { EventBus } from '~/utils/event-bus'

export default Vue.component('ElementEditor', {
	mixins: [ WithStore ],

	props: {
		element: {
			type: Object,
			default: null,
		},
		overlay: {
			type: Boolean,
			default: false,
		},
	},

	async fetch() {
		const { params } = this.$nuxt.context

		this.categories = [
			{ _id: '', title: '(none)' },
			...(await this.$categories.allByProject(params.projectId)),
		]

		this.elements = await this.$elements.allByProject(params.projectId)
	},
	fetchOnServer: false,

	data() {
		return {
			categories: [],
			elements: [],
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
		const ID = this.element ? this.element._id : DEFAULT_ELEMENT_ID

		if(Diff.hasDiff(ID)) {
			const stored = Diff.getDiff(ID)
			await this.setStateFromElement({
				...stored,
				_id: ID,
				category: stored.category ? stored.category._id : ''
			})
		}
		else if(this.element) {
			await this.setStateFromElement(this.element)
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
		existingTags() {
			return Array.from(new Set(this.elements.flatMap(({ tags }) => tags)))
		},

		existingPropertyNames() {
			return Array.from(new Set(this.elements.flatMap(({ properties }) => 
				properties.map(({ name }) => name)
			).sort()))
		},

		existingPropertyValues() {
			return Array.from(new Set(this.elements
				.flatMap(({ properties }) => 
					properties
						.filter(({ type }) => type === 'Text')
						.map(({ value }) => value)
				).sort()))
		},

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
	},

	methods: {
		searchElements(searchText) {
			// TODO maybe want to include searching description, tags, etc.
			return this.elements
				.filter(link => search(link.title, searchText))
				.map(el => ({
					icon: el.icon,
					url: el.slug,
					text: el.title,
				}))
		},

		async setStateFromElement(element) {
			const category = element.category ? await this.$categories.byId(element.category) : null

			this.title = element.title || ''
			this.description = element.description || ''
			this.category = category
			this.tags = element.tags || []
			this.properties = element.properties || []
			this.icon = element.icon ? toTitleCase(element.icon) : ''
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
			const prop = this.properties.find(({ id }) => property.id === id)

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
			let newElement
			const category = this.category ? this.category._id : ''

			try {
				// if the component has an element save it
				// otherwise create new
				if(this.element) {
					newElement = await this.$elements.save({
						...this.element,
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

					newElement = await this.$elements.create({
						title: this.title,
						description: this.description,
						category,
						project: project._id,
						properties: this.properties,
						tags: this.tags,
						icon: this.icon.toLowerCase(),
					})
				}

				this.clearData(this.element ? this.element._id : DEFAULT_ELEMENT_ID)
				this.$emit('save', newElement)
			}
			catch(err) {
				console.log(err)
				EventBus.$emit(SHOW_MESSAGE, { type: 'error', text: 'Element couldn’t be saved.' })
			}
		},
	},
})
</script>