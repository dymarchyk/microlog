import nc  from 'next-connect'
import {
	all,
	onlyOwner,
	validation,
	withProject
}               from '@/middleware'
import {
	Log,
	Project
}               from '@/entities'
import Joi      from 'joi'
import { omit } from 'lodash'


const createProjectSchema = Joi.object({
	name: Joi.string()
		.required()
})

const updateProjectSchema = createProjectSchema.append({
	sharedWith: Joi.array().items(({
		_id: Joi.string().required(),
		email: Joi.string().required()
	}))
})

async function getProjects( req, res ) {
	if ( req.query.id ) {
		return res.json({
			data: await Project.findById(req.query.id)
				.populate('sharedWith')
		})
	}
	let p = await Project.find({
		$or: [
			{ owner: req.user._id }, { sharedWith: { $in: [ req.user._id ] } }
		]
	})
	res.json({ data: p })
}

async function deleteProject( req, res ) {
	try {
		await Project.findByIdAndDelete(req.body.id)
		
		await Log.deleteMany({
			project: { '$in': req.body.id }
		})
		
		await req.user.updateOne({ $pull: { projects: req.body.id } })
		
		res.json({
			message: 'done'
		})
	} catch ( e ) {
		res.status(422)
			.json({
				message: e.toString()
			})
	}
}

async function createProject( req, res ) {
	try {
		const project = new Project({ ...req.validated, owner: req.user._id })
		await project.save()
		req.user.projects.push(project)
		await req.user.save()
		res.json({ data: project })
	} catch ( e ) {
		console.log('cannot create project', e)
		res.status(500)
			.json({ message: e.toString() })
	}
}

async function updateProject( req, res ) {
	try {
		const { _id, sharedWith, ...rest } = req.body
		
		const r = await Project.findOneAndUpdate({ _id }, {
			$set: {
				sharedWith: sharedWith.map(x => x._id),
				...omit(rest, ['owner', 'createdAt', 'updatedAt']),
			}
		}, {new: true})
		res.json({data: await r.populate('sharedWith')})
	} catch ( e ) {
		console.log(e)
		res.status(422).json({message: 'Cannot update this project.'})
	}
}

export default nc()
	.use(all)
	.get(getProjects)
	.delete(onlyOwner, deleteProject)
	.patch(withProject, onlyOwner, validation(updateProjectSchema, {allowUnknown: true}), updateProject)
	.post(validation(createProjectSchema, {allowUnknown: true}), createProject)