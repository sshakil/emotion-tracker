const path = require('path')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const { HotModuleReplacementPlugin, ProvidePlugin } = require('webpack')
const Dotenv = require('dotenv-webpack')

// Define production and test modes based on NODE_ENV
const isProduction = process.env.NODE_ENV === 'production'
// sort of a hack as webpack doesn't have a test profile
const isTest = process.env.NODE_ENV === 'test'

module.exports = {
    entry: {
        application: './app/javascript/packs/application.js',
    },
    output: {
        filename: 'application.js',
        path: path.resolve(__dirname, isTest ? 'public/packs-test' : 'public/packs'),
        publicPath: '/packs/', // Ensure assets are served correctly
        clean: isProduction, // Clean the output directory in production
    },
    mode: isProduction ? 'production' : 'development', // only these two supported by webpack
    devServer: {
        static: path.resolve(__dirname, 'public/packs'),
        compress: true,
        port: 8081,
        host: 'localhost',
        historyApiFallback: true,
        open: true,
        liveReload: true,
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
                        plugins: isProduction || isTest ? [] : ['react-refresh/babel'],
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
            '@emotion/react': path.resolve(__dirname, 'node_modules/@emotion/react'),
        },
    },
    plugins: [
        new ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser',
        }),

        // Include HMR for development only
        ...(isProduction || isTest ? [] : [new HotModuleReplacementPlugin(), new ReactRefreshWebpackPlugin()]),

        new NodePolyfillPlugin(),

        // Generate a manifest file for assets
        new WebpackManifestPlugin({
            fileName: 'manifest.json',
            publicPath: isTest ? '/packs-test/' : '/packs/', // Ensure this matches public_output_path in webpacker.yml,
            writeToFileEmit: true,
        }),

        // Load environment variables from .env files
        new Dotenv({
            // Select the appropriate .env file
            path: `.env.${process.env.NODE_ENV || 'development'}`,
        }),
    ],
    devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
}