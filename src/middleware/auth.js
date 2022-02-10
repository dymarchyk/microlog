import { User }                  from '@/entities'
import  { parseCookies } from 'nookies'

export default async function auth( req, res, next ) {
	const cookies = parseCookies({req,res})
	if ( cookies.user || req.query.apiKey) {
		let u = await User.findById( cookies.user  || req.query.apiKey.substr(0, 24))
		
		if ( !u ) {
			return res.status(403)
				.json({ message: 'User not registered or key is wrong' })
		}
		req.user = u
		next()
	} else {
		return res.status(403)
			.json({ message: 'User not authorized' })
	}
}