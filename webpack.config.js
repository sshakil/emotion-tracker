const path = require('path');
const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin'); // Import the plugin

module.exports = {
    entry:  {
        application: './app/javascript/packs/application.js'
    },
    output: {
        filename: 'application.js',
        path: path.resolve(__dirname, 'public/packs'),
        clean: true, // Clean the output directory before emitting
    },
    mode: 'development',
    devServer: {
        static: path.resolve(__dirname, 'public'),
        compress: true,
        port: 8080,
        historyApiFallback: true,
        open: true,
        hot: true,
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
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser',
        }),
        new webpack.HotModuleReplacementPlugin(),
        new ReactRefreshWebpackPlugin(),
        new NodePolyfillPlugin(),
        new WebpackManifestPlugin({ // Add the plugin here
            fileName: 'manifest.json',
            publicPath: '/packs/', // Ensure this matches your public_output_path in webpacker.yml
        }),
    ],
};