import { meta, title, url, description } from './utils/meta'

export default {
	// Target: https://go.nuxtjs.dev/config-target
  target: 'static',
  ssr: false,

	env: {
		cdn: process.env.CDN_URL,
		database: process.env.POUCH_DATABASE,
	},

	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		title: title(),
		meta: [
			...meta(),
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: description() },
			{ name: 'format-detection', content: 'telephone=no' }
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
			{ hid: 'canonical', rel: 'canonical', href: url() },
		]
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: [
		'~/assets/styles.css',
	],

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
		//'~/plugins/state.js',
		{ src: '~/plugins/client.js', mode: 'client' },
		'~/plugins/filters.js',
	],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: [
		{
			path: '~/components', // will get any components nested in let's say /components/test too
			pathPrefix: false,
		},
	],

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// https://go.nuxtjs.dev/tailwindcss
		'@nuxtjs/tailwindcss',
		'vue-daisy-ui/nuxt',
	],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		//'@nuxtjs/axios',
		'@nuxt/content',
	],

	//serverMiddleware: [],

	// Axios module configuration: https://go.nuxtjs.dev/config-axios
	/*axios: {
		// Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
		baseURL: process.env.API_URL,
	},

	googleFonts: {
		families: {
			Montserrat: {
				wght: [400, 600, 700],
				ital: [400]
			},
		},
		prefetch: true,
		preconnect: true,
		useStylesheet: true,
	},

	image: {
		cloudinary: {
			baseURL: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUDNAME}/image/upload/`
		}
	},*/

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {
		cache: process.env.NODE_ENV !== 'production',
		extractCSS: process.env.NODE_ENV === 'production' ? { ignoreOrder: true } : false,
		optimizeCSS: process.env.NODE_ENV === 'production',
		transpile: ['vue-daisy-ui', 'vis-data', 'vis-network'],
		extend(config, isDev, isClient) {
			config.resolve.extensions.push('.mjs')
			config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
			})
		},
	},
}
