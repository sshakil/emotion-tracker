import postcssImport from 'postcss-import'
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes'
import autoprefixer from 'autoprefixer'
import postcssPresetEnv from 'postcss-preset-env'

export default {
  plugins: [
    postcssImport, // Allows @import in CSS
    postcssFlexbugsFixes, // Fixes known flexbox issues
    autoprefixer({
      overrideBrowserslist: ['>1%', 'last 2 versions', 'Firefox ESR', 'not dead'],
      flexbox: 'no-2009' // Ensures better support for modern browsers
    }),
    postcssPresetEnv({
      stage: 3, // Enables modern CSS features with fallbacks
      features: {
        'nesting-rules': true // Enables CSS nesting (like SCSS)
      }
    })
  ]
}