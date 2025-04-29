<template>
	<div v-if="linked.length > 0">
		<div class="grid grid-cols-2">
			<h3 class="my-2">Connections</h3>
			<popup-button y="top" x="right" class="justify-self-end">
				Filter
				<template #popup>
					<ul>
						<li v-for="filter in connectionFilters" :key="filter.label">
							<label>
								<d-checkbox sm
									:value="filter.value"
									@input="filter.toggle()" />
								{{ filter.label }}
							</label>
						</li>
					</ul>
				</template>
			</popup-button>
		</div>
		<table class="table">
			<tbody>
				<tr
					v-for="link in filteredLinks"
					:key="`connections_${ link._id }`"
					class="hover:bg-base-200">
					<td>
						<nuxt-link
							class="link-primary hover:underline"
							:to="link.slug">
							{{ link.title }}
							<small v-if="link.hasMatchingProperty">({{ link.matchingProperties[0].name }}: {{ link.matchingProperties[0].value }})</small>
						</nuxt-link>
					</td>
					<td align="right">
						<icon-view v-if="link.isCategory" icon="folder" data-tip="Category" class="tooltip" :class="{ 'text-neutral': showCategories, 'opacity-30': !showCategories }" />
						<icon-view v-if="link.isMention" icon="chat" data-tip="Mention" class="tooltip" :class="{ 'text-neutral': showMentions, 'opacity-30': !showMentions }" />
						<icon-view v-if="link.isLink" icon="link" data-tip="Link" class="tooltip" :class="{ 'text-neutral': showLinks, 'opacity-30': !showLinks }" />
						<icon-view v-if="link.isTag" icon="tag" data-tip="Tag" class="tooltip" :class="{ 'text-neutral': showTags, 'opacity-30': !showTags }" />
						<icon-view v-if="link.hasMatchingProperty" icon="property" data-tip="Property" class="tooltip" :class="{ 'text-neutral': showProperties, 'opacity-30': !showProperties }" />
					</td>
				</tr>
			</tbody>
		</table>
	</div>
	
</template>
<script>

import Vue from 'vue'

export default Vue.component('ConnectionFilter', {
	props: {
		linked: {
			type: Array,
			default: [],
		},
	},

	data() {
		return {
			showCategories: true,
			showLinks: true,
			showMentions: true,
			showTags: true,
			showProperties: true,
		}
	},

	computed: {
		filteredLinks() {
			return this.linked.filter(link =>
				link.isCategory && this.showCategories ||
				link.isLink && this.showLinks ||
				link.isMention && this.showMentions ||
				link.hasMatchingProperty && this.showProperties ||
				link.isTag && this.showTags)
		},

		connectionFilters() {
			return [
				{
					label: 'Categories',
					value: this.showCategories,
					toggle: () => this.showCategories = !this.showCategories,
				},
				{
					label: 'Links',
					value: this.showLinks,
					toggle: () => this.showLinks = !this.showLinks,
				},
				{
					label: 'Mentions',
					value: this.showMentions,
					toggle: () => this.showMentions = !this.showMentions,
				},
				{
					label: 'Properties',
					value: this.showProperties,
					toggle: () => this.showProperties = !this.showProperties,
				},
				{
					label: 'Tags',
					value: this.showTags,
					toggle: () => this.showTags = !this.showTags,
				},
			]
		},
	},
})

</script>