import { Project } from '@/entities'


export default async function withProject( req, res, next ) {
	if ( req.query.apiKey ) {
		const id = req.query.apiKey.substr(24, 24)
		if ( !id ) {
			return res.status(404)
				.json({ message: 'Project not found' })
		}
		const p = await Project.findById(id)
		if ( !p ) {
			return res.status(404)
				.json({ message: 'Project not found' })
		}
		
		if ( p.owner.toString() === req.user._id.toString() || p.sharedWith.includes(req.user._id.toString()) ) {
			req.project = p
			return next()
			
		}
		return res.status(403)
			.json({ message: 'User is not owner' })
	}
	else {
		res.status(422)
			.json({ message: 'Project not specified' })
	}
}