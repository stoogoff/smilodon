<template>
	<div>
		<div class="navbar bg-base-100 shadow px-4">
			<div class="flex-1">
				<nuxt-link to="/" class="btn btn-ghost"><icon-view icon="logo" lg /> reticula</nuxt-link>
			</div>
			<div class="flex-end">
				<nuxt-link to="/projects" class="btn btn-ghost">
					Dashboard
				</nuxt-link>
			</div>
		</div>
		<main class="mt-10">
			<Nuxt />
		</main>
		<footer class="pt-8 pb-12 bg-base-100 border-t border-base-300">
			<div class="site-container">
				<a href="https://we-evolve.co.uk/" target="_blank"><img src="/img/we-evolve.png" width="300" /></a>
				<div class="mt-1 ml-1 text-sm text-base-300">
					<p class="mb-2">reticula software &copy; 2025 we evolve</p>
					<p class="mb-2">All content is the property its respective author</p>
				</div>
			</div>
		</footer>
	</div>
</template>
<script>

export default {
	name: 'SiteLayout',
}

</script>