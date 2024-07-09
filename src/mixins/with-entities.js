
import { EventBus } from '~/utils/event-bus'
import { ENTITIES_UPDATED } from '~/utils/config'

export default {
	data() {
		return {
			entities: [],
		}
	},

	mounted() {
		EventBus.$on(ENTITIES_UPDATED, () => this.$fetch())
	},

	beforeDestroy() {
		EventBus.$off(ENTITIES_UPDATED)
	},

	computed: {
		hasEntities() {
			return this.entities.length > 0
		}
	},
}
