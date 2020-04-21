import webpack from 'webpack';
import path from 'path';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import WebpackMd5Hash from 'webpack-md5-hash';

export default {
	debug: true,
  devtool: 'source-map', //Slower, recommended for production, highest quality sourcemap experience
  noInfo: false,
  entry: {
		main: path.resolve(__dirname, 'src/index'),
		vendor: path.resolve(__dirname, 'src/vendor')
	},
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].[chunkhash].js'
  },
  plugins: [
		//Has the files using MD5 so that their names change when the content changes
		new WebpackMd5Hash(),

		//Use CommonsChunkPlugin to create a separate bundle
		//of vendor libraries so that they're cached separately.
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor'
		}),

		//Create HTML file that includes reference to bundled JS.
		new HTMLWebpackPlugin({
			template: 'src/index.html',
			//minify html
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true
			},
			inject: true
		}),

		//Eliminate duplicate packages when generating bundle
		new webpack.optimize.DedupePlugin(),

		//Minify JS
		new webpack.optimize.UglifyJsPlugin()
	],
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loaders: ['babel']},
      {test: /\.css$/, loaders: ['style','css']}
    ]
  }
}
