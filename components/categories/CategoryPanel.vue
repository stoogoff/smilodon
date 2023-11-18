<template>
	<aside>
		<h3 class="uppercase text-sm text-gray-400">Categories</h3>
		<category-tree />
		<category-editor v-if="showAddForm" @save="hideForm" @cancel="hideForm" />
		<we-button-action v-else block @click="showForm">Add</we-button-action>
	</aside>
</template>
<script>

import Vue from 'vue'
import { required, validate } from 'we-ui/utils/validators'

export default Vue.component('CategoryPanel', {
	data() {
		return {
			showAddForm: false,
		}
	},

	methods: {
		showForm() {
			this.showAddForm = true
		},

		hideForm() {
			this.showAddForm = false
		},
	},
})

</script>
