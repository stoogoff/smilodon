<template>
	<div>
		<img v-if="isImage" :src="value" />
		<span v-else>{{ value }}</span>
	</div>
</template>
<script>

import Vue from 'vue'
import { localeDate, localeDatetime } from '~/utils/date'

export default Vue.component('PropertyView', {
	props: {
		property: {
			type: Object,
			required: true,
		},
	},

	computed: {
		isImage() {
			return this.property.type === 'Image URL'
		},

		value() {
			switch(this.property.type) {
				case 'Date':
					return localeDate(this.property.value)
				case 'DateTime':
					return localeDatetime(this.property.value)
				default:
					return this.property.value
			}
		}
	},
})

</script>