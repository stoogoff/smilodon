<template>
	<div class="grid grid-cols-4 gap-2 border-b pt-1 pb-2">
		<d-validator-control
			label="Name"
			:value="name"
			:rules="rules.name"
			v-slot="{ error }"
		>
			<d-input v-model="name" bordered sm :error="error" @input="updateProperty" />
		</d-validator-control>
		<d-validator-control
			label="Type"
			:value="type"
			:rules="rules.type"
			v-slot="{ error }"
		>
			<d-simple-select v-model="type" bordered sm :items="propertyTypes" @input="updateProperty" />
		</d-validator-control>
		<d-validator-control
			label="Value"
			:value="value"
			:rules="rules.value"
			v-slot="{ error }"
		>
			<d-toggle
				v-if="inputType === 'toggle'"
				v-model="value"
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
			<d-button @click="deleteProperty" sm ghost class="mt-9">
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
				/*case 'Date':
					value = [required(), format(/^\d{4}-\d{2}-\d{2}$/, 'yyyy-mm-dd')]
					break
				case 'DateTime':
					value = [required(), format(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/, 'yyyy-mm-dd hh:mm')]
					break
				case 'Time':
					value = [required(), format(/^\d{2}:\d{2}$/, 'hh:mm')]
					break*/
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