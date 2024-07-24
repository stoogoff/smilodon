
import { isElement, isCategory, isProject } from '~/utils/assert'
import { ELEMENT_ID_PREFIX, CATEGORY_ID_PREFIX, PROJECT_ID_PREFIX } from '~/utils/config'

describe('utils/assert', () => {
	const tests = (title, func, prefix) => {
		describe(title, () => {
			it('returns true if the object has the correct prefix', () => {
				const testObj = { _id: prefix + 'hello' }
				const result = func(testObj)

				expect(result).toEqual(true)
			})

			it('returns false if the object has an incorrect prefix', () => {
				const testObj = { _id: 'prefix:hello' }
				const result = func(testObj)

				expect(result).toEqual(false)
			})

			it('returns false if the object has no _id property', () => {
				const testObj = { id: 'prefix:hello' }
				const result = func(testObj)

				expect(result).toEqual(false)
			})
		})
	}

	tests('isElement', isElement, ELEMENT_ID_PREFIX)
	tests('isCategory', isCategory, CATEGORY_ID_PREFIX)
	tests('isProject', isProject, PROJECT_ID_PREFIX)
})