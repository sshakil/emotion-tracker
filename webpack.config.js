const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './app/javascript/packs/application.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/packs'), // Ensure it outputs to the public/packs directory
    },
    mode: 'development',
    devServer: {
        static: path.resolve(__dirname, 'public'),
        compress: true,
        port: 8080,
        historyApiFallback: true, // This will help in routing if you are using React Router
        open: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
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
        },
        fallback: {
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify'),
            assert: require.resolve('assert'),
            buffer: require.resolve('buffer'),
            fs: false,
            net: false,
            tls: false,
            child_process: false,
        },
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser',
        }),
    ],
};