
import uniq from 'lodash/uniq'
import { local } from 'vue-daisy-ui/utils/storage'

export default {
	storeDiff(id, obj) {
		local.set(id, obj)
	},

	getDiff(id) {
		return local.get(id)
	},

	hasDiff(id) {
		return local.has(id)
	},

	removeDiff(id) {
		local.remove(id)
	},

	equal(left, right, ignore = []) {
		const objectSort = (a, b) => {
			a = JSON.stringify(a)
			b = JSON.stringify(b)

			return a === b ? 0 : a < b ? -1 : 1
		}

		// ignore _id
		// ignore _rev
		const equal = (a, b) => {
			if(a === b) return true
			if(typeof a !== 'object' || typeof b !== 'object') return false

			// get all properties of both objects and remove any properties starting with _
			// this gets rid of _id and _rev from the comparison
			const keys = uniq([ ...Object.keys(a), ...Object.keys(b)])
				.filter(key => !key.startsWith('_'))
				.filter(key => !ignore.includes(key))
			let matches = 0

			for(let i = 0, ilen = keys.length; i < ilen; ++i) {
				const key = keys[i]

				// if both values are arrays, loop & recurse
				if(Array.isArray(a[key]) && Array.isArray(b[key])) {
					// different lengths so can't match
					if(a[key].length !== b[key].length) return false

					// arrays with the same values in a different order count as matching
					const aArr = [ ...a[key] ].sort(objectSort)
					const bArr = [ ...b[key] ].sort(objectSort)

					let j = 0
					const jlen = aArr.length

					for(; j < jlen; ++j) {
						if(!equal(aArr[j], bArr[j])) break
					}

					// if the loop completes it's a match
					if(j === jlen) matches++
				}
				else if(equal(a[key], b[key])) matches++
			}

			return keys.length === matches
		}

		return equal(left, right)
	},
}