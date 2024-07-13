<template>
	<div>
		<div class="navbar bg-base-100 shadow px-4">
			<div class="flex-1">
				<nuxt-link to="/" class="btn btn-ghost"><icon-view icon="logo" lg /> Primordium</nuxt-link>
			</div>
			<div class="flex-end">
				<nuxt-link to="/projects" class="btn btn-ghost">
					Dashboard
				</nuxt-link>
			</div>
		</div>
		<main class="max-w-screen-lg mx-auto mt-10">
			<Nuxt />
		</main>
	</div>
</template>
<script>

export default {
	name: 'SiteLayout',
}

</script>