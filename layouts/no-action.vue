<template>
	<div>
		<we-main-nav :menu-items="[]">Smilodon</we-main-nav>
		<main class="main pt-16 px-2 pb-2 grid">
			<div>sidebar</div>
			<Nuxt />
		</main>
	</div>
</template>
<script>

export default {
	name: 'NoActionLayout',
}

</script>