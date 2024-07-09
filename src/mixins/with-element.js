
export default {
	async fetch() {
		const { params } = this.$nuxt.context

		this.element = await this.$elements.byId(params.elementId)
	},
	fetchOnServer: false,

	data() {
		return {
			element: null,
		}
	},
}
