const path = require('path')
const webpack = require('webpack')
const BrotliPlugin = require('brotli-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

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
		new webpack.HotModuleReplacementPlugin(),
		
		 new CompressionPlugin({
		  filename: '[path].br[query]',
		  algorithm: 'brotliCompress',
		  test: /\.(js|css|html|svg)$/,
		  compressionOptions: {
			// zlib’s `level` option matches Brotli’s `BROTLI_PARAM_QUALITY` option.
			level: 11,
		  },
		  threshold: 10240,
		  minRatio: 0.8,
		  deleteOriginalAssets: false,
		 }),
		 
		 new BrotliPlugin({
		 asset: '[path].br[query]',
		 test: /\.js$|\.css$|\.html$/,
		 threshold: 10240,
		 minRatio: 0.7
		 })
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
