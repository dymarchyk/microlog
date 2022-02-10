import session from 'next-session'
const s = session({autoCommit: false	})

export default async function withSession(req,res,next  ){
	req.session = await s(req,res)
	console.log(req.session)
	next()
}