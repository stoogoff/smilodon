<template>
	<div>
		<section>
			<div class="mx-auto w-1/2">
				<header>
					<h1 class="text-5xl md:inline-block md:mr-3">reticulate</h1>
					<span class="text-lg" aria-hidden="true">rɪˈtɪkjʊleɪt</span>
				</header>
				<dl class="mt-8 text-lg">
					<dt>verb <em>(rare)</em></dt>
					<dd>
						<p>divide or mark (something) in such a way as to resemble a net or network.</p>
						<p>the numerous canals and branches of the river reticulate the flat alluvial plain</p>
					</dd>
					<dt>adjective</dt>
					<dd><p>arranged or marked like a net or network; reticulated.</p></dd>
				</dl>
			</div>
		</section>
		<section class="site-container text-xl">
			<d-card>
				<div class="grid grid-cols-2 gap-8">
					<div class="m-4">
						<p><em>reticula</em> is the perfect incubator for your next project.</p>
						<p>All the elements are here, you just have to provide the spark of inspiration needed to bring your project to life.</p>
					</div>
					<carousel :items="images" />
				</div>
			</d-card>
		</section>
		<section class="site-container grid grid-cols-2 gap-4">
			<d-card>
				<d-card-title>Elements</d-card-title>
				<figure class="border border-base-300">
					<img src="/img/screenshots/element.png" />
				</figure>
				<p>Elements are the backbone of reticula. Use them to write notes, tag them, add detailed properties to them of your own creation. Organising them through categories in whatever structure suits your project.</p>
			</d-card>
			<d-card>
				<d-card-title>Properties</d-card-title>
				<figure class="border border-base-300">
					<img src="/img/screenshots/properties.png" />
				</figure>
				<p>Elements can have any number of properties which you define. These can provide additional information beyond the main text and can be restrict the type of data they contain.</p>
			</d-card>
			<d-card>
				<d-card-title>Network</d-card-title>
				<figure class="border border-base-300">
					<img src="/img/screenshots/network.png" />
				</figure>
				<p>Create elements and network them together, through links, tags, categories and automatically through related properties and by mentioning them. View the network they form together.</p>
			</d-card>
			<d-card>
				<d-card-title>Other Features</d-card-title>
				<p><strong>Local First:</strong> reticula stores all of its data locally within your browser so there's no need to create an account.</p>
				<p><strong>Backups:</strong> browser storage safe but if you change browser or device you can backup your projects to a zip file and reimport them.</p>
			</d-card>
		</section>
	</div>
</template>
<script>

export default {
	name: 'Index',
	layout: 'site',

	computed: {
		images() {
			return [
				'/img/screenshots/category.png',
				'/img/screenshots/editor-fullscreen.png',
				'/img/screenshots/network.png',
				'/img/screenshots/element.png',
				'/img/screenshots/properties.png',
				'/img/screenshots/project.png',
				'/img/screenshots/tags-edit.png',
				'/img/screenshots/editor.png',
			]
		},
	},
}

</script>
<style scoped>

section {
	@apply mb-16;
}

dt {
	@apply font-bold text-xl;
}

dt em {
	@apply font-normal italic;
}

dd {
	@apply ml-8;
}

p {
	@apply mb-4;
}


</style>