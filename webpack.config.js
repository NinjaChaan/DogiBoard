const path = require('path')
const webpack = require('webpack')

module.exports = {
	devtool: 'cheap-module-eval-source-map',
	mode: 'development',
	entry: [
		'webpack-hot-middleware/client',
		'./src/index'
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/static/'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	],
	module: {
		rules: [{
			test: /\.js$/,
			loaders: ['react-hot-loader/webpack', 'babel-loader'],
			include: path.join(__dirname, 'src')
		},
		{
			test: /\.html$/,
			loader: 'file?name=[name].[ext]'
		},
		{
			test: /\.css$/i,
			use: ['style-loader', 'css-loader'],
		}
		]
	}
}
