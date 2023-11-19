
export default {
	async fetch() {
		const { params } = this.$nuxt.context

		this.entity = await this.$entities.byId(params.entityId)
	},
	fetchOnServer: false,

	data() {
		return {
			entities: null,
		}
	},
}
