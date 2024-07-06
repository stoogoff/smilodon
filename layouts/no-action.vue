<template>
	<div>
		<main-nav />
		<main class="main grid">
			<category-panel />
			<Nuxt />
		</main>
		<message-toast />
	</div>
</template>
<script>

export default {
	name: 'NoActionLayout',
}

</script>