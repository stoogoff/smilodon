<template>
	<slide-up v-if="showMessage">
		<d-toast center bottom>
			<d-alert :info="isInfo" :warning="isWarning" :error="isError" :success="isSuccess">
				<icon-view :icon="icon" />
				<p>{{ message }}</p>
			</d-alert>
		</d-toast>
	</slide-up>
</template>
<script>

import Vue from 'vue'
import { SHOW_MESSAGE } from '~/utils/config'
import { EventBus } from '~/utils/event-bus'

export default Vue.component('MessageToast', {
	data() {
		return {
			type: 'info',
			message: 'Hello',
			showMessage: false,
		}
	},

	mounted() {
		EventBus.$on(SHOW_MESSAGE, ({ type, text }) => {
			this.type = type
			this.message = text
			this.showMessage = true

			window.setTimeout(() => {
				this.showMessage = false
			}, 5000)
		})
	},

	beforeDestroy() {
		EventBus.$off(SHOW_MESSAGE)
	},

	computed: {
		icon() {
			return this.isError || this.isWarning ? 'alert' : 'info'
		},

		isInfo() {
			return this.type === 'info'
		},

		isSuccess() {
			return this.type === 'success'
		},

		isError() {
			return this.type === 'error'
		},

		isWarning() {
			return this.type === 'warning'
		},
	},
})

</script>