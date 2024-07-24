
import Diff from '~/modules/diff'

describe('modules/diff', () => {
	describe('equal', () => {
		describe('matches two similar objects', () => {
			it('objects with the same properties are equal', () => {
				const left = { name: 'John', age: 30 }
				const right = { name: 'John', age: 30 }

				expect(Diff.equal(left, right)).toBe(true)
			})

			it('objects ignore properties beginning with underscore', () => {
				const left = { name: 'John', age: 30, _id: 1 }
				const right = { name: 'John', age: 30, _id: 2 }

				expect(Diff.equal(left, right)).toBe(true)
			})

			it('objects ignore specified properties', () => {
				const left = { name: 'John', surname: 'Smith', age: 30, path: '/path/1' }
				const right = { name: 'John', surname: 'Smythe', age: 30, path: '/path/2' }

				expect(Diff.equal(left, right, ['path', 'surname'])).toBe(true)
			})

			it('objects with matching simple array properties are equal', () => {
				const left = { name: 'John', list: [1, 2, 3] }
				const right = { name: 'John', list: [1, 2, 3] }

				expect(Diff.equal(left, right)).toBe(true)
			})

			it('objects with matching simple array properties and ignore order are equal', () => {
				const left = { name: 'John', list: [1, 2, 3] }
				const right = { name: 'John', list: [3, 1, 2] }

				expect(Diff.equal(left, right)).toBe(true)
			})

			it('objects with matching properties with nested objects are equal', () => {
				const left = { name: 'John', home: { planet: 'Earth' } }
				const right = { name: 'John', home: { planet: 'Earth' } }

				expect(Diff.equal(left, right)).toBe(true)
			})

			it('objects with matching properties with arrays of nested objects are equal', () => {
				const left = { name: 'John', properties: [ { name: 'Height' }, { name: 'Weight' } ] }
				const right = { name: 'John', properties: [ { name: 'Height' }, { name: 'Weight' } ] }

				expect(Diff.equal(left, right)).toBe(true)
			})

			it('objects with matching properties with arrays of nested objects in any order are equal', () => {
				const left = { name: 'John', properties: [ { name: 'Height' }, { name: 'Weight' } ] }
				const right = { name: 'John', properties: [ { name: 'Weight' }, { name: 'Height' } ] }

				expect(Diff.equal(left, right)).toBe(true)
			})
		})

		describe('fails to match two different objects', () => {
			it('objects with different property values are not equal', () => {
				const left = { name: 'John', age: 30 }
				const right = { name: 'John', age: 31 }

				expect(Diff.equal(left, right)).toBe(false)
			})

			it('objects with different properties are not equal', () => {
				const left = { name: 'John', age: 30 }
				const right = { name: 'John' }

				expect(Diff.equal(left, right)).toBe(false)
			})

			it('objects with different simple array properties are not equal', () => {
				const left = { name: 'John', list: [1, 2, 3] }
				const right = { name: 'John', list: [1, 2, 4] }

				expect(Diff.equal(left, right)).toBe(false)
			})

			it('objects with different array lengths are not equal', () => {
				const left = { name: 'John', list: [1, 2, 3] }
				const right = { name: 'John', list: [1, 2] }

				expect(Diff.equal(left, right)).toBe(false)
			})

			it('objects with different nested object properties are not equal', () => {
				const left = { name: 'John', home: { planet: 'Earth' } }
				const right = { name: 'John', home: { planet: 'Mars' } }

				expect(Diff.equal(left, right)).toBe(false)
			})

			it('objects with different nested objects are not equal', () => {
				const left = { name: 'John', home: { planet: 'Earth' } }
				const right = { name: 'John', home: { moon: 'Deimos' } }

				expect(Diff.equal(left, right)).toBe(false)
			})

			it('objects with different properties with arrays of nested objects are not equal', () => {
				const left = { name: 'John', properties: [ { name: 'Height' }, { name: 'Weight' } ] }
				const right = { name: 'John', properties: [ { name: 'Height' } ] }

				expect(Diff.equal(left, right)).toBe(false)
			})
		})
	})
})
