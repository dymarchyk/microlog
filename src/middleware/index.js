import database    from '@/middleware/database'
import nc          from 'next-connect'
import auth        from '@/middleware/auth'
import validation  from '@/middleware/validation'
import withProject from './withProject'
import onlyOwner   from './onlyOwner'
import logger from './logger'

const all = nc({
	onError: ( err, req, res, next ) => {
		console.log('Application error', err, req.url, req.port)
		res.status(500)
			.json({ message: err.message || err.toString() })
	}
})
	.use(database)
	.use(auth)
	.use(logger)


export {
	all,
	database,
	validation,
	withProject,
	onlyOwner
}