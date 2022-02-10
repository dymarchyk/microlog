const path = require('path')
module.exports = {
  reactStrictMode: true,
  i18n: require('./next-i18next.config').i18n,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles'), path.join(__dirname, 'pages/styles')],
  },
  devIndicators: {
    autoPrerender: false,
  },
  
}
