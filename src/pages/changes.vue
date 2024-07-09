<template>
	<div>
		<h1>Changes</h1>
		<ul>
			<li v-for="change in changes.results" :key="change.id">
				{{ change.doc.title }} ({{ change.id }}) <span v-if="change.deleted">DELETED</span>
			</li>
		</ul>
	</div>	
</template>
<script>

export default {
	layout: 'site',
	
	async fetch() {
		this.changes = await this.$db.changes({
			since: 0,
			include_docs: true,
		})
		console.log({ ...this.changes.results })
	},
	fetchOnServer: false,

	data() {
		return {
			changes: [],
		}
	},
}

</script>