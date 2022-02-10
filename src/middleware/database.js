import mongoose from 'mongoose'

let conn

export async function getDatabase(){
	if(!conn) return conn = await mongoose.connect(process.env.DB_URI).catch(() => null)
	return conn
}

export default async function database( req, res, next ) {
	if ( !conn ) {
		conn = await mongoose.connect(process.env.DB_URI)
			.catch(next)
		console.log('Database connected')
	}
	req.db = conn
	next()
}