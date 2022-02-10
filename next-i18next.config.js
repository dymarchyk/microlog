const path = require('path')
module.exports = {
	i18n: {
		locales: ['ru'],
		defaultLocale: 'ru',
		localePath: path.resolve(__dirname, './public/locales'),
		nsSeparator: false,
		keySeparator: false,
		localeDetection: false,
	}
}
