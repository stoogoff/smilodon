<template>
	<section>
		<h1>Categories</h1>
		<p>This will allow for creating, editing, moving and deleting categories</p>
		<p>Deleting is the important one as deleting a category requires knowing what to do with any Entities within it. Do they get hoisted to the parent category? Given no category? Deleted as well? Does the system stop the deletion if the category has items within it?</p>
	</section>
</template>
<script>

export default {
	name: 'Categories'
}

</script>