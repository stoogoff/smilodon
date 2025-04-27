<template>
	<div class="grid grid-cols-4 gap-2 border-b pt-1 pb-2">
		<d-validator-control
			:label="showLabels ? 'Name' : ''"
			:value="name"
			:rules="rules.name"
			v-slot="{ error }"
		>
			<d-autocomplete v-model="name" :options="properties" bordered sm :error="error" @input="updateProperty" />
		</d-validator-control>
		<d-validator-control
			:label="showLabels ? 'Type' : ''"
			:value="type"
			:rules="rules.type"
			v-slot="{ error }"
		>
			<d-simple-select v-model="type" bordered sm :items="propertyTypes" @input="updateProperty" />
		</d-validator-control>
		<d-validator-control
			:label="showLabels ? 'Value' : ''"
			:value="value"
			:rules="rules.value"
			v-slot="{ error }"
		>
			<d-toggle
				v-if="inputType === 'toggle'"
				v-model="value"
				@input="updateProperty" />
			<d-autocomplete
				v-else-if="inputType === 'text'"
				v-model="value"
				bordered
				sm
				:error="error"
				:options="values"
				@input="updateProperty" />
			<d-input
				v-else
				:type="inputType"
				v-model="value"
				bordered
				sm
				:error="error"
				@input="updateProperty" />
		</d-validator-control>
		<span>
			<d-button @click="deleteProperty" sm ghost :class="showLabels ? 'mt-9' : 'mt-4'">
				<icon-view icon="trash" />
			</d-button>
		</span>
	</div>
</template>
<script>

import Vue from 'vue'
import { required, format } from 'vue-daisy-ui/utils/validators'
import { PROPERTY_TYPES } from '~/utils/config'

export default Vue.component('PropertyEditor', {
	props: {
		property: {
			type: Object,
			required: true,
		},
		showLabels: {
			type: Boolean,
			default: true,
		},
		properties: {
			type: Array,
			default: [],
		},
		// TODO this would be better as an object with the key being the
		// property name and the value being an array of options
		// this would mean recommendations would be correct for the property
		// and not just a random grab bag of everything
		values: {
			type: Array,
			default: [],
		},
	},

	data() {
		return {
			name: '',
			type: '',
			value: '',
		}
	},

	mounted() {
		this.name = this.property.name
		this.type = this.property.type
		this.value = this.property.value
	},

	computed: {
		propertyTypes() {
			return PROPERTY_TYPES
		},

		inputType() {
			switch(this.type) {
				case 'True/False':
					return 'toggle'
				case 'DateTime':
					return 'datetime-local'
				default:
					return this.type.toLowerCase()
			}
		},

		rules() {
			let value = []

			switch(this.type) {
				case 'Number':
					value = [required(), format(/^\d+(\.\d+)?$/, 'Numeric value')]
					break
				case 'Image URL':
					value = [required(), format(/^http[s]?:\/\//, 'URL')]
					break
				case 'True/False':
					value = []
					break
				default:
					value = [required()]
			}

			return {
				name: [required()],
				type: [required()],
				value,
			}
		},
	},

	methods: {
		deleteProperty() {
			this.$emit('delete', this.property.id)
		},

		updateProperty() {
			this.$emit('update', {
				...this.property,
				name: this.name,
				type: this.type,
				value: this.value,
			})
		},
	},
})

</script>