
import icons, { getIcon } from '~/utils/icons'

describe('utils/icons', () => {
	describe('getIcon', () => {
		it('returns an icon if it is available', () => {
			const result = getIcon('logo')

			expect(result).toEqual(icons.logo)
		})

		it('returns the default icon if the is not found', () => {
			const result = getIcon('__rubbish__')

			expect(result).toEqual(icons.DEFAULT)
		})
	})
})
