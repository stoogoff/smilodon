<template>
	<div>
		<main-nav />
		<main class="main grid">
			<category-panel />
			<Nuxt />
		</main>
		<entity-overlay
			v-if="addEntity"
			@close="saveEntity"
		/>
		<d-button
			class="fixed right-4 bottom-4"
			primary
			circle
			@click="addEntity = true"
		>
			<icon-view icon="plus" />
		</d-button>
	</div>
</template>
<script>

export default {
	name: 'DefaultLayout',

	data() {
		return {
			addEntity: false,
		}
	},

	methods: {
		saveEntity(entity) {
			this.addEntity = false

			if(entity)
				this.$router.push(entity.slug)
		},
	},
}

</script>