module.exports = {
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/../src/$1',
		'^~/(.*)$': '<rootDir>/../src/$1',
	},
	moduleFileExtensions: ['js'],
	transform: {
		'^.+\\.js$': 'babel-jest',
	},
	collectCoverage: false,
	collectCoverageFrom: [],
	testEnvironment: 'jsdom',
}
