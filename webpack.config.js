const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    entry: {
      main: "./src/app.js",
    },
    output: {
        filename: "[name].[chunkhash].js",
        path: path.resolve(__dirname, "public"),
        assetModuleFilename: 'src/assets/images/[name].[ext]',
    },
    devServer: {
        port: 2000
    },
    plugins: [
        new HTMLPlugin({
            inject: true,
            template: './src/index.html',
            filename: 'index.html'
        }),
        new HTMLPlugin({
          inject: true,
          template: './src/single-standard.html',
          filename: 'single-standard.html'
        }),
        new HTMLPlugin({
          inject: true,
          template: './src/legendarydropone.html',
          filename: 'legendarydropone.html'
        }),
        new HTMLPlugin({
          inject: true,
          template: './src/category.html',
          filename: 'category.html'
        }),
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [
          {
            test: /\.html$/,
            loader: 'html-loader'
          },
          {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
          },
          {
            //IMAGE LOADER
            test: /\.jpe?g|\.png|\.gif$|\.svg$|\.mp3$/,
            type: 'asset/resource',
          },
          {
            test: /\.(ico|otf|eot|ttf|woff2?)(\?v=\d+\.\d+\.\d+)?$/i,
            type: 'asset/resource',
          },
        ],
      },
}