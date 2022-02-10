const {path} = require('path')
module.exports = {
	i18n: {
		locales: ['ru'],
		defaultLocale: 'ru',
		localePath: path.resolve('./public/locales'),
		nsSeparator: false,
		keySeparator: false,
		localeDetection: false,
	}
}
