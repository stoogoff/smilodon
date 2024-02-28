<template>
	<section>
		<loading-spinner v-if="entity === null" />
		<d-card v-else>
			<d-card-title>
				Editing: {{ entity.title }}
			</d-card-title>
			<entity-editor :entity="entity" @save="save" />
		</d-card>
	</section>
</template>
<script>

import WithEntity from '~/mixins/with-entity'

export default {
	layout: 'no-action',
	name: 'EntityEdit',
	mixins: [ WithEntity ],

	methods: {
		save(entity) {
			this.$nuxt.$router.push(this.entity.slug)
		},
	},
}

</script>