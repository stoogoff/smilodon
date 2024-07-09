<template>
	<div class="flex flex-col items-center justify-center pt-8">
		<d-loading spinner lg class="text-blue" />
		<div class="text-xl text-black-light mt-4">
			<slot>Loading...</slot>
		</div>
	</div>
</template>
<script>

import Vue from 'vue'

export default Vue.component('LoadingSpinner', {})

</script>