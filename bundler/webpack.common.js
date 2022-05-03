const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const { getExamplesPages, generateIndexExamplePage } = require('./helpers')

const { examplesEntries, examplesPages } = getExamplesPages()
const indexExamplePage = generateIndexExamplePage()

module.exports = {
    entry: {
        ...examplesEntries
    },
    output:
    {
        hashFunction: 'xxhash64',
        filename: 'bundle.[contenthash].js',
        path: path.resolve(__dirname, '../dist')
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins:
        [
            new CopyWebpackPlugin({
                patterns: [
                    { from: path.resolve(__dirname, '../static') }
                ]
            }),
            new MiniCSSExtractPlugin(),
            indexExamplePage,
            ...examplesPages
        ],
    module:
    {
        rules:
            [
                // TYPESCRIPT
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                // HTML
                {
                    test: /\.(html)$/,
                    use:
                        [
                            'html-loader'
                        ]
                },

                // JS
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use:
                        [
                            'babel-loader'
                        ]
                },

                // CSS
                {
                    test: /\.css$/,
                    use:
                        [
                            MiniCSSExtractPlugin.loader,
                            'css-loader'
                        ]
                },

                // Images
                {
                    test: /\.(jpg|png|gif|svg)$/,
                    type: 'asset/resource',
                    generator:
                    {
                        filename: 'assets/images/[hash][ext]'
                    }
                },

                // Fonts
                {
                    test: /\.(ttf|eot|woff|woff2)$/,
                    type: 'asset/resource',
                    generator:
                    {
                        filename: 'assets/fonts/[hash][ext]'
                    }
                }
            ]
    }
}
