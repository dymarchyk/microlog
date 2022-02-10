import nc      from 'next-connect'
import { all } from '@/middleware'
import {User} from '@/entities'

async function findUser(req,res){
	const {q} = req.query
	res.json({
		data: await User.find({
			_id: {$ne: req.user._id},
			email: new RegExp(q, 'i')
		})
	})
}

export default nc().use(all).get(findUser)