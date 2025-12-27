import { defineConfig } from 'vitepress';

export default defineConfig({
	title: 'Speed Highlight',
	description: 'Light, fast, and easy to use, dependency-free JavaScript syntax highlighter',
	
	base: '/core/',
	
	head: [
		['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
		['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
		['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
		['link', { href: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap', rel: 'stylesheet' }],
	],

	themeConfig: {
		logo: '/logo.svg',
		
		nav: [
			{ text: 'Guide', link: '/web' },
			{ text: 'API', link: '/api' },
			{ text: 'Demo', link: '/demo' },
		],

		sidebar: [
			{
				text: 'Getting Started',
				items: [
					{ text: 'Quickstart', link: '/' },
					{ text: 'Web Usage', link: '/web' },
					{ text: 'Terminal Usage', link: '/terminal' },
					{ text: 'API Reference', link: '/api' },
				]
			},
			{
				text: 'Reference',
				items: [
					{ text: 'Themes', link: '/themes' },
					{ text: 'Languages', link: '/languages' },
				]
			},
			{
				text: 'Customization',
				items: [
					{ text: 'Styling Guide', link: '/styling' },
					{ text: 'Creating Languages', link: '/creating-languages' },
					{ text: 'Tokens Reference', link: '/tokens' },
				]
			},
			{
				text: 'Migration',
				items: [
					{ text: 'vs Prism', link: '/vs-prism' },
					{ text: 'vs highlight.js', link: '/vs-highlightjs' },
				]
			},
			{
				text: 'Demo',
				link: '/demo'
			}
		],

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/speed-highlight/core' },
			{ icon: 'npm', link: 'https://www.npmjs.com/package/@speed-highlight/core' },
		],

		footer: {
			message: 'Released under the CC0 1.0 Universal license.',
			copyright: 'Speed Highlight'
		},

		search: {
			provider: 'local'
		}
	}
});
