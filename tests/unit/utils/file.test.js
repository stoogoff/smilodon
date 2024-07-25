
import { fileExtension } from '~/utils/file'

describe('utils/file', () => {
	describe('fileExtension', () => {
		it('returns the extension part of a file path', () => {
			const result = fileExtension('path/file.ext')

			expect(result).toEqual('.ext')
		})

		it('returns the extension path of a file with multiple . characters', () => {
			const result = fileExtension('path/file.bak.ext')

			expect(result).toEqual('.ext')
		})

		it('returns null for an empty path', () => {
			const result = fileExtension('')

			expect(result).toBe(null)
		})

		it('returns null for a null path', () => {
			const result = fileExtension(null)

			expect(result).toBe(null)
		})

		it('returns null for a path with no extension separator', () => {
			const result = fileExtension('path/file')

			expect(result).toBe(null)
		})
	})
})
