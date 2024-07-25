
import YAML from 'yaml'
import { isEmptyString, notEmptyString } from 'vue-daisy-ui/utils/assert'

// remove and parse the YAML header and return as an object
export const parseFile = content => {
	if(content.indexOf('---') === -1)
		return { description: content }

	const [empty, header, description] = content.split('---')
	const properties = YAML.parse(header)

	return { ...properties, description: description.replace(`\n\n# ${ properties.title }\n\n`, '').trimStart() }
}

// create a Markdown file with a YAML header
//  the header is delimited by ---
export const createFile = (obj, ignore) => {
	const copy = { ...obj }

	ignore = ignore || ['slug', 'project', 'category', 'description']

	Object.keys(copy).filter(key => ignore.includes(key)).forEach(key => delete copy[key])

	const header = YAML.stringify(copy)
	const buffer = []

	if(notEmptyString(header)) {
		buffer.push('---')
		buffer.push(header + '---\n')
	}

	if(obj.title)
		buffer.push(`# ${obj.title}\n`)

	if(obj.description)
		buffer.push(`${obj.description}\n`)

	return buffer.join('\n')
}

export const fileExtension = path => {
	if(isEmptyString(path)) return null
	if(path.indexOf('.') === -1) return null

	return path.substring(path.lastIndexOf('.'))
}
