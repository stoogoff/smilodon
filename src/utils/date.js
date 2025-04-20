
export const localeDate = value => {
	if(!value) return ''

	const date = new Date(Date.parse(value))

	return new Intl.DateTimeFormat().format(date)
}

export const localeDatetime = value => {
	if(!value) return ''

	const date = new Date(Date.parse(value))

	return new Intl.DateTimeFormat(undefined, { dateStyle: 'short', timeStyle: 'short' }).format(date)
}
