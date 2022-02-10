import seed from '@/seeds'
import {
	Event,
	Log,
	Project,
	User
}           from '@/entities'


export default async function seedController ( req, res ) {
	try {
		if ( !!req.query.user ) await User.deleteMany({})
		await Project.deleteMany({})
		await Log.deleteMany({})
		await Event.deleteMany({})
		await seed({ createUser: !!req.query.user })
		res.json({
			data: {
				users   : await User.count(),
				projects: await Project.count(),
				logs    : await Log.count(),
				events    : await Event.count()
			}
		})
	} catch ( err ) {
		return res.status(500)
			.json({ message: err.toString() })
	}
}