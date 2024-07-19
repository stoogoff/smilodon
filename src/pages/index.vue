<template>
	<div>
		<h1>Primordium</h1>

		<p>Primordium is the perfect incubator for your next project. All the elements are here, you just need to link together to create your universe.You just have to provide the spark of inspiration needed to bring your project to life.</p>
	</div>
</template>
<script>

import DiffManager from '~/managers/diff'

export default {
	name: 'Index',
	layout: 'site',

	mounted() {
		// reuse these as test cases
		const a = { name: 'John', age: 23, _id: 1, data: { hello: 'earth' }, arr: [1, 2, 3], props: [ { value: 'hello', type: 'string' }, { type: 'number', value: 1 } ] }
		// array order doesn't matter, including for objects
		const b = { name: 'John', age: 23, _id: 2, data: { hello: 'earth' }, arr: [3, 1, 2], props: [ { type: 'number', value: 1 }, { type: 'string', value: 'hello' } ] }
		// has property which base doesn't
		const c = { name: 'John', surname: 'Smith' }
		// has different sub-object property
		const d = { name: 'John', age: 23, _id: 1, data: { hello: 'mars' }}
		// has different array length
		const e = { name: 'John', age: 23, _id: 1, data: { hello: 'world' }, arr: [1, 2]}
		// has different array values
		const f = { name: 'John', age: 23, _id: 1, data: { hello: 'world' }, arr: [1, 2, 4]}
		// has different array of objects
		const g = { name: 'John', age: 23, _id: 1, data: { hello: 'world' }, arr: [1, 2, 3], props: [ { type: 'number' }, { type: 'number' } ]}

		console.log('a === b', DiffManager.equal(a, b))
		console.log('a === c', DiffManager.equal(a, c))
		console.log('a === d', DiffManager.equal(a, d))
		console.log('a === e', DiffManager.equal(a, e))
		console.log('a === f', DiffManager.equal(a, f))
		console.log('a === g', DiffManager.equal(a, g))
	}
}

</script>