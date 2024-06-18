
// wrapper around localStorage and sessionStorage
// which automatically converts data to and from JSON
export class Storage {
	constructor(storage) {
		this.storage = storage
	}

	set(key, value) {
		this.storage.setItem(key, JSON.stringify(value))
	}

	get(key) {
		return JSON.parse(this.storage.getItem(key))
	}

	has(key) {
		return this.storage.getItem(key) != null
	}

	keys() {
		let keys = []

		for(let i = 0, len = this.storage.length; i < len; ++i) {
			keys.push(this.storage.key(i))
		}

		return keys
	}

	remove(...keys) {
		keys.forEach(key => this.storage.removeItem(key))
	}

	clear() {
		this.storage.clear()
	}
}

const noop = () => {}
const empty = {
	setItem: noop,
	getItem: noop,
	length: noop,
	key: noop,
	removeItem: noop,
	clear: noop,
}

export const local = new Storage(process.server ? empty : window.localStorage)
export const session = new Storage(process.server ? empty : window.sessionStorage)
