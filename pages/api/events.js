import nc        from 'next-connect'
import {
	all,
	validation,
	withProject
}                from '@/middleware'
import Joi       from 'joi'
import { Event } from '@/entities'


const eventSchema = Joi.object({
	name: Joi.string()
		.required()
})

async function getAllEvents( req, res ) {
	if(req.query.id){
		return res.json({
			data: await Event.findOne({
				project: req.project._id,
				_id: req.query.id
			})
		})
	}
	res.json({
		data: await Event.find({
				project: req.project._id,
			})
			.sort({ createdA: -1 })
	})
}

async function createEvent( req, res ) {
	await Event.updateOne({
		project: req.project._id,
		name   : req.validated.name,
	}, { $inc: { count: 1 }, $push: { dates: Date.now() } }, { new: true, upsert: true })
	res.json({
		data: await Event.findOne({
			project: req.project._id,
			name   : req.validated.name,
		})
	})
}

export default nc()
	.use(all)
	.use(withProject)
	.get(getAllEvents)
	.post(validation(eventSchema), createEvent)