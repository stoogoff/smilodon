
export const slugify = text => text.toLowerCase().trim().replace(/\s+/g, '-')

export const toTitleCase = text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
