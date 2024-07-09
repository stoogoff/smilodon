
import { EventBus } from '~/utils/event-bus'
import { PROJECTS_UPDATED } from '~/utils/config'

export default {
	data() {
		return {
			projects: [],
		}
	},

	mounted() {
		EventBus.$on(PROJECTS_UPDATED, () => this.$fetch())
	},

	beforeDestroy() {
		EventBus.$off(PROJECTS_UPDATED)
	},

	computed: {
		hasProjects() {
			return this.projects.length > 0
		}
	},
}
