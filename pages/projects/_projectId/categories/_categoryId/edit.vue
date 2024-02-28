<template>
	<section>
		<loading-spinner v-if="category === null" />
		<d-card v-else>
			<d-card-title>
				Editing: {{ category.title }}
			</d-card-title>
			<category-editor :category="category" @save="save" @cancel="cancel" />
		</d-card>
	</section>
</template>
<script>

export default {
	layout: 'no-action',
	name: 'CategoryEdit',

	async fetch() {
		const { params } = this.$nuxt.context

		this.category = await this.$categories.byId(params.categoryId)
	},
	fetchOnServer: false,

	data() {
		return {
			category: null,
		}
	},

	methods: {
		save(category) {
			this.$nuxt.$router.push(category.slug)
		},

		cancel() {
			this.$nuxt.$router.push(this.category.slug)
		},
	},
}

</script>