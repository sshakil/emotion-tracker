process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const environment = require('./environment')

const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const smp = new SpeedMeasurePlugin()
const config = environment.toWebpackConfig()
config.output.filename = "js/[name]-[hash].js"

module.exports = smp.wrap(config)
