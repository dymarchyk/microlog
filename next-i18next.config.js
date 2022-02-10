const path = require('path')
module.exports = {
	i18n: {
		locales: ['ru'],
		defaultLocale: 'ru',
		localePath: path.resolve('./public/static/locales'),
		nsSeparator: false,
		keySeparator: false,
		localeDetection: false,
	}
}
