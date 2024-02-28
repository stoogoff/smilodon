<template>
	<div>
		<main-nav />
		<main class="main grid">
			<category-panel />
			<Nuxt />
		</main>
		<entity-overlay
			v-if="showPublish"
			@close="showPublish = false"
		/>
		<d-button
			class="fixed right-4 bottom-4"
			primary
			circle
			@click="showPublish = true"
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
			showPublish: false,
		}
	},
}

</script>