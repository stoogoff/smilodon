<template>
	<table class="w-full">
		<thead>
			<tr>
				<th></th>
				<th class="text-left">Title</th>
				<th class="text-left">Category</th>
				<th class="text-left">Tags</th>
				<th>&nbsp;</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="entity in entities" :key="entity._id">
				<td class="max-w-5">
					<entity-icon v-if="entity.icon" :entity="entity" />
				</td>
				<td>
					<nuxt-link class="link" :to="`/entities/${ entity.slug }`">{{ entity.title }}</nuxt-link></td>
				<td>{{ entity.category }}</td>
				<td>
					<tag-list :tags="entity.tags" />
				</td>
				<td>
					<we-button-action small @click="deleteEntity(entity)" type="warning">
						<we-icon-view icon="delete" />
					</we-button-action>
				</td>
			</tr>
		</tbody>
	</table>
</template>
<script>
import Vue from 'vue'
import { EventBus } from '~/utils/event-bus'
import { ENTITIES_UPDATED } from '~/utils/config'

export default Vue.component('EntityTable', {
	props: {
		entities: {
			type: Array,
			required: true,
		},
	},

	methods: {
		deleteEntity(entity) {
			this.$entities.delete(entity)
			EventBus.$emit(ENTITIES_UPDATED)
		},
	},
})

</script>