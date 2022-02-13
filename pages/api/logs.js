import nc from 'next-connect'
import {all, onlyOwner, validation, withProject} from '@/middleware'
import Joi from 'joi'
import {defaults} from 'lodash'
import dayjs from 'dayjs'
import {Log} from '@/entities'


const logSchema = Joi.object({
	message: Joi.string()
		.required(),
	namespace: Joi.string(),
	level: Joi.string()
		.default('info')
})

async function getLogs( req, res ) {
	if ( !req.query.date ) {
		const d = await Log.aggregate([
			{ $match: { project: req.project._id } },
		
			{
				$group: {
					_id  : { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
					count: { $sum: 1 },
					createdAt: {$first: '$createdAt'}
				}
			},
			{ $sort: { createdAt: -1 } },
		])
		// .sort({ createdAt: 1 })
		return res.json({dates: d.map(x => ({date: x._id, ...x}))})
		// res.json({ dates: d })
	}
	const date = dayjs(req.query.date)
	// const d = await Log.aggregate([
	// 	{
	// 		$match: {
	// 			project  : req.project._id,
	// 			createdAt: {
	// 				$gte: date.startOf('day')
	// 					.toDate(),
	// 				$lte: date.endOf('day')
	// 					.toDate()
	// 			}
	// 		}
	// 	},
	// 	{
	// 		$group: {
	// 			_id : { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
	// 			logs: {
	// 				$push: {
	// 					_id      : '$_id',
	// 					message  : '$message',
	// 					level    : '$level',
	// 					project  : '$project',
	// 					namespace: '$namespace',
	// 					createdAt: '$createdAt'
	// 				}
	// 			}
	// 		}
	// 	},
	// 	{ $project: { logs: 1 } }
	// ])
	
	const data = await Log.find({
			project  : req.project._id,
			createdAt: {
				$gte: date.startOf('day')
					.toDate(),
				$lte: date.endOf('day')
					.toDate()
			}
		})
		.sort({ createdAt: -1 })
	res.json({
		data
	})
}

async function create( req, res ) {
	try {
		const data = defaults(req.validated, {
			namespace: req.project.name,
			project  : req.project._id
		})
		const log = new Log(data)
		await log.save()
		res.status(200).json({message: 'saved', data: log})
	} catch ( e ) {
		console.log('cannot save log', e)
		res.status(200).json({message: 'saved'})
	}
}

async function deleteLogs( req, res ) {
	try {
		const date = dayjs(req.body.date)

		await Log.deleteMany({
			createdAt: {
				'$gte': date.startOf('day'),
				'$lte': date.endOf('day'),
			},
			project  : req.project._id
		})

		res.json({ message: 'done' })
		
	} catch ( e ) {
		res.status(500)
			.json({ message: e.toString() })
	}
}

export default nc()
	.use(all)
	.use(withProject)
	.get(getLogs)
	.delete(onlyOwner, deleteLogs)
	.post(validation(logSchema), create)