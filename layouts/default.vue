<template>
	<div>
		<main-nav />
		<main class="main pt-16 px-2 pb-2">
			<Nuxt />
		</main>
		<publish-view
			v-if="showPublish"
			@close="showPublish = false"
		/>
		<icon-action
			type="primary"
			icon="plus"
			class="fixed right-4 bottom-4"
			@click="showPublish = true"
		/>
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