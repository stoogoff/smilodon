<template>
	<div>
		<we-main-nav :menu-items="[]">Smilodon</we-main-nav>
		<main class="main pt-16 px-2 pb-2">
			<Nuxt />
		</main>
		<entity-editor
			v-if="showPublish"
			@close="showPublish = false"
		/>
		<we-icon-action
			type="primary"
			:icon="plusIcon"
			class="fixed right-4 bottom-4"
			@click="showPublish = true"
		/>
	</div>
</template>
<script>

import { plus } from '~/utils/icons'

export default {
	name: 'DefaultLayout',

	data() {
		return {
			showPublish: false,
		}
	},

	computed: {
		plusIcon() {
			return plus
		},
	},
}

</script>