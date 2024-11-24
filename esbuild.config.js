const esbuild = require('esbuild')
const dotenv = require('dotenv')
const path = require('path')
const postCssPlugin = require('esbuild-plugin-postcss2')

// Load environment variables
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` })

// Prepare environment variables for the frontend
const defineEnv = Object.entries(process.env).reduce((acc, [key, value]) => {
  acc[`process.env.${key}`] = JSON.stringify(value)
  return acc
}, {
  'process.env': JSON.stringify({}),
  'process': JSON.stringify({})
})

const isDev = process.env.NODE_ENV === 'development'
const isTest = process.env.NODE_ENV === 'test'

;(async () => {
  // Define build options
  const options = {
    entryPoints: ['app/javascript/application.js'],
    bundle: true,
    outdir: path.join(process.cwd(), 'public/assets'),
    sourcemap: isDev || isTest,
    format: 'esm',
    platform: 'browser',
    loader: {
      '.js': 'jsx',
      '.css': 'css',
      '.png': 'file',
      '.jpg': 'file',
      '.svg': 'file',
    },
    plugins: [postCssPlugin.default()],
    define: defineEnv,
    logLevel: 'info',
    publicPath: '/assets',
    external: [],
  }

  // Handle different environments
  if (isDev) {
    const context = await esbuild.context(options)
    console.log('Watching for changes...')
    await context.watch()
  } else {
    console.log(`Building for ${isTest ? 'test' : 'production'}...`)
    await esbuild.build(options) // Use build directly for test and prod
  }
})()