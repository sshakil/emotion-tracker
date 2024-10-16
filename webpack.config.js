const path = require('path')
const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin') // Import the plugin
const { HotModuleReplacementPlugin, ProvidePlugin } = require('webpack')
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    entry:  {
        application: './app/javascript/packs/application.js'
    },
    output: {
        filename: 'application.js',
        path: path.resolve(__dirname, 'public/packs'),
        publicPath: '/packs/',
        // clean: true, // Clean the output directory before emitting
        clean: isProduction
        // clean: false
    },
    mode: 'development',
    devServer: {
        static: path.resolve(__dirname, 'public/packs'),
        compress: true,
        port: 8081,
        host: 'localhost',
        historyApiFallback: true,
        open: true,
        liveReload: true,
        hot: true,
        proxy: [
          {
            context: () => true, // Proxy all requests
            target: 'http://localhost:3000', // Proxy requests to the backend server
            changeOrigin: true,
            secure: false,
          }
        ]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: ['react-refresh/babel'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ],
    },
    resolve: {
        alias: {
            components: path.resolve(__dirname, 'app/javascript/components'),
            '@emotion/react': path.resolve(__dirname, 'node_modules/@emotion/react')
        },
    },
    plugins: [
        new ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser',
        }),
        new HotModuleReplacementPlugin(),
        new ReactRefreshWebpackPlugin(),
        new NodePolyfillPlugin(),
        new WebpackManifestPlugin({ // Add the plugin here
            fileName: 'manifest.json',
            publicPath: '/packs/', // Ensure this matches public_output_path in webpacker.yml
        }),
        new webpack.DefinePlugin({
            // Default to true for RoR backend which has OAuth
            'process.env.ENABLE_OAUTH': JSON.stringify(process.env.ENABLE_OAUTH || 'true')
        })

    ],
    devtool: 'cheap-module-source-map',
}