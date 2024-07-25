
import { parseFile, fileExtension } from '~/utils/file'

describe('utils/file', () => {
	describe('parseFile', () => {
		it('returns an object with a title and description', () => {
			const input = `---
title: Lorem ipsum
---

Dolor sic amet
`
			const output = parseFile(input)

			expect(output.title).toEqual('Lorem ipsum')
			expect(output.description).toEqual('Dolor sic amet\n')
		})

		it('returns removes the title from the description', () => {
			const input = `---
title: Lorem ipsum
---

# Lorem ipsum

Dolor sic amet
`
			const output = parseFile(input)

			expect(output.title).toEqual('Lorem ipsum')
			expect(output.description).toEqual('Dolor sic amet\n')
		})

		it('leaves the title in the description if it does not match the property', () => {
			const input = `---
title: Lorem ipsum
---

# Tempes Motus

Dolor sic amet
`
			const output = parseFile(input)

			expect(output.title).toEqual('Lorem ipsum')
			expect(output.description).toEqual('# Tempes Motus\n\nDolor sic amet\n')
		})

		it('leaves the title in the description if it is not an h1', () => {
			const input = `---
title: Lorem ipsum
---

## Lorem ipsum

Dolor sic amet
`
			const output = parseFile(input)

			expect(output.title).toEqual('Lorem ipsum')
			expect(output.description).toEqual('## Lorem ipsum\n\nDolor sic amet\n')
		})

		it('returns an object with a description if no header is present', () => {
			const input = 'Lorem ipsum'
			const output = parseFile(input)

			expect(output.description).toEqual(input)
		})

		it('returns an object with other properties', () => {
			const input = `---
title: Lorem ipsum
planet: Earth
numbers: [1, 2, 3]
---

# Lorem ipsum

Dolor sic amet
`
			const output = parseFile(input)

			expect(output.planet).toEqual('Earth')
			expect(output.numbers).toEqual([1, 2, 3])
		})
	})

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
