<template>
	<div>
		<h1>Smilodon</h1>

		<p>General purpose welcome page</p>
		<p>Could have some small dashboard links if the user has already been here</p>

		<div class="m-4">
			<d-validator-control
				label="Title"
				:value="title"
				:rules="rules"
				v-slot="{ error }"
				class="py-4"
			>
				<d-input bordered v-model="title" :error="error" />
			</d-validator-control>
		</div>

		<div class="m-4">
			<d-alert class="my-4" info>Info</d-alert>
			<d-alert class="my-4" success>Success</d-alert>
			<d-alert class="my-4" warning>Warning</d-alert>
			<d-alert class="my-4" error>Error</d-alert>
		</div>

		<div class="m-4">
			<d-button info>Info</d-button>
			<d-button success>Success</d-button>
			<d-button warning>Warning</d-button>
			<d-button error>Error</d-button>
			<d-button outline info>Info</d-button>
			<d-button outline success>Success</d-button>
			<d-button outline warning>Warning</d-button>
			<d-button outline error>Error</d-button>
		</div>

		<div class="m-4">
			<d-button primary>Primary</d-button>
			<d-button secondary>Secondary</d-button>
			<d-button accent>Accent</d-button>
			<d-button neutral>Neutral</d-button>
			<d-button outline primary>Primary</d-button>
			<d-button outline secondary>Secondary</d-button>
			<d-button outline accent>Accent</d-button>
			<d-button outline neutral>Neutral</d-button>
		</div>

		<div class="m-4">
			<d-badge primary>Primary</d-badge>
			<d-badge secondary>Secondary</d-badge>
			<d-badge accent>Accent</d-badge>
			<d-badge neutral>Neutral</d-badge>
			<d-badge ghost>Ghost</d-badge>
			<d-badge info>Info</d-badge>
			<d-badge success>Success</d-badge>
			<d-badge warning>Warning</d-badge>
			<d-badge error>Error</d-badge>
		</div>

		<div class="m-4 grid grid-cols-5">
			<div class="h-10 bg-st-grey-dark">grey</div>
			<div class="h-10 bg-st-grey"></div>
			<div class="h-10 bg-st-grey-light"></div>
			<div class="h-10 bg-st-grey-pastel"></div>
			<div class="h-10 bg-st-grey-pale"></div>

			<div class="h-10 bg-st-black-dark">black</div>
			<div class="h-10 bg-st-black"></div>
			<div class="h-10 bg-st-black-light"></div>
			<div class="h-10 bg-st-black-pastel"></div>
			<div class="h-10 bg-st-black-pale"></div>

			<div class="h-10 bg-st-blue-dark">blue</div>
			<div class="h-10 bg-st-blue"></div>
			<div class="h-10 bg-st-blue-light"></div>
			<div class="h-10 bg-st-blue-pastel"></div>
			<div class="h-10 bg-st-blue-pale"></div>

			<div class="h-10 bg-st-red-dark">red</div>
			<div class="h-10 bg-st-red"></div>
			<div class="h-10 bg-st-red-light"></div>
			<div class="h-10 bg-st-red-pastel"></div>
			<div class="h-10 bg-st-red-pale"></div>

			<div class="h-10 bg-st-yellow-dark">yellow</div>
			<div class="h-10 bg-st-yellow"></div>
			<div class="h-10 bg-st-yellow-light"></div>
			<div class="h-10 bg-st-yellow-pastel"></div>
			<div class="h-10 bg-st-yellow-pale"></div>

			<div class="h-10 bg-st-green-dark">green</div>
			<div class="h-10 bg-st-green"></div>
			<div class="h-10 bg-st-green-light"></div>
			<div class="h-10 bg-st-green-pastel"></div>
			<div class="h-10 bg-st-green-pale"></div>


		</div>

	</div>
</template>
<script>

import { required } from 'vue-daisy-ui/utils/validators'

export default {
	name: 'Index',
	layout: 'site',

	data() {
		return {
			title: '',
		}
	},

	computed: {
		rules() {
			return [required()]
		},
	},
}

</script>