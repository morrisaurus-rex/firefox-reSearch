const path = require('node:path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

const HtmlGenOptions = {
	title: 'Addon Popup',
	filename: './popup/index.html',
	template: './src/popup/index.html',
	scriptLoading: 'blocking',
	excludeChunks: ['content_script']
}

module.exports = {
	entry: {
		popup_page: {
			import: "./src/popup/popup.svelte",
			filename: "./popup/popup.js" 
		},
		content_script: "./src/re_search.js"

	},
	resolve: {
		alias: {
			svelte: path.resolve('node_modules', 'svelte/src/runtime')
		},
		extensions: ['.mjs', '.js', '.svelte'],
		mainFields: ['svelte', 'browser', 'module', 'main'],
		conditionNames: ['svelte', 'browser']
	},
	output: {
		path: path.join(__dirname, '/build'),
		filename: '[name].js',
		chunkFilename: '[name].[id].js',
        clean: true
	},
	module: {
		rules: [
			{
				test: /\.svelte$/,
				use: {
					loader: 'svelte-loader',
					options: {
						compilerOptions: {
							dev: !prod,
							customElement: true,
							css: 'injected'
						},
						emitCss: prod,
						hotReload: !prod
					}
				}
			}
		]
	},
	mode,
	devtool: prod ? false : 'source-map',
	devServer: {
		hot: true,
		static: {
			directory: path.join(__dirname, 'public'),
		}
	},
	plugins: [new HtmlWebpackPlugin(HtmlGenOptions)]
};