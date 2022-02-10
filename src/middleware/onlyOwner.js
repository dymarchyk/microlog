import { Project } from '@/entities'


export default async function onlyOwner( req, res, next ) {
	if ( req.body.id ) {
		let p = await Project.findOne({
			_id   : req.body.id,
			owner: req.user._id
		})
	
		if ( p ) {
			req.project = p
			return next()
		}
		return res.status(422)
			.json({ message: 'Your must be project owner.' })
	}
	if ( !req.user._id.equals(req.project.owner) ) {
		return res.status(422)
			.json({ message: 'Your must be project owner.' })
	}
	next()
}