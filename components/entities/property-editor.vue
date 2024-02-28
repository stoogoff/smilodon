<template>
	<div class="grid grid-cols-4 gap-1">
		<d-validator-control
			label="Name"
			:value="name"
			:rules="rules.name"
			v-slot="{ error }"
		>
			<d-input v-model="name" :error="error" @input="updateProperty" />
		</d-validator-control>
		<d-validator-control
			label="Type"
			:value="type"
			:rules="rules.type"
			v-slot="{ error }"
		>
			<d-simple-select v-model="type" :items="propertyTypes" @input="updateProperty" />
		</d-validator-control>
		<d-validator-control
			label="Value"
			:value="value"
			:rules="rules.value"
			v-slot="{ error }"
		>
			<d-input v-model="value" :error="error" @input="updateProperty" />
		</d-validator-control>
		<span>
			<d-button @click="deleteProperty">
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

		rules() {
			const value = [required()]

			switch(this.type) {
				case 'Number':
					value.push(format(/^\d+(\.\d+)?$/, 'number'))
					break
				case 'Date':
					value.push(format(/^\d{4}-\d{2}-\d{2}$/, 'yyyy-mm-dd'))
					break
				case 'DateTime':
					value.push(format(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/, 'yyyy-mm-dd hh:mm'))
					break
				case 'Time':
					value.push(format(/^\d{2}:\d{2}$/, 'hh:mm'))
					break
				case 'True/False':
					value.push(format(/^(true|false)$/, 'true OR false'))
					break
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