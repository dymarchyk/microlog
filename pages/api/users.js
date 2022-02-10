import nc       from 'next-connect'
import {
	database,
	validation,
	withSession
}               from '@/middleware'
import { User } from '@/entities'
import * as Joi from 'joi'
import bcrypt   from 'bcryptjs'
import auth     from '@/middleware/auth'
import nookies  from 'nookies'

const userSchema = Joi.object({
	password: Joi.string()
		.required()
		.alphanum()
		.min(6),
	email   : Joi.string()
		.email()
		.required()
})

async function register( req, res ) {
	try {
		const user = await new User({
			...req.validated,
			password: await bcrypt.hash(req.validated.password, await bcrypt.genSalt(5))
		}).save()
		nookies.set({ req, res }, 'user', user._id)
		res.json({ data: user })
		
	} catch ( e ) {
		res.status(500)
			.json({ message: e.toString() })
	}
}

async function getUser( req, res ) {
	res.json({
		data: req.user
	})
}

async function login( req, res ) {
	try {
		const user = await User.findOne({ email: req.validated.email })
		
		if ( !user ) {
			return res.status(404)
				.json({ message: 'User not found' })
		}
		
		
		const checkPass = await bcrypt.compare(req.validated.password, user.password)
		if ( !checkPass ) {
			return res.status(422)
				.json({ message: 'Email or password invalid' })
		}
		
		nookies.set({req,res}, 'user',user._id)
		res.json({ data: user })
	} catch ( e ) {
		console.log('cannot login', e)
		res.status(500)
			.json({ message: e.toString() })
	}
}

async function logout( req, res ) {
	nookies.destroy({req,res}, 'user')
	nookies.destroy(null, 'user')
	res.json({ message: 'done' })
}

export default nc()
	.use(database)
	.post(validation(userSchema), register)
	.get(auth, getUser)
	.delete(logout)
	.put(validation(userSchema), login)