
import { EventBus } from '~/utils/event-bus'
import { ELEMENTS_UPDATED } from '~/utils/config'

export default {
	data() {
		return {
			elements: [],
		}
	},

	mounted() {
		EventBus.$on(ELEMENTS_UPDATED, () => this.$fetch())
	},

	beforeDestroy() {
		EventBus.$off(ELEMENTS_UPDATED)
	},

	computed: {
		hasElements() {
			return this.elements.length > 0
		}
	},
}
