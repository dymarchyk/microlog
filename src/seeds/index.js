import {getDatabase } from '@/middleware/database'
import UserSeeder     from './userSeeder'
import ProjectSeeder  from '@/seeds/projectSeeder'
import LogSeeder      from '@/seeds/logSeeder'
import EventSeeder    from '@/seeds/eventSeeder'

export default async function seed({createUser}){
	let db = await getDatabase()
	if(!db) throw new Error('No database')
	
	createUser && await UserSeeder()
	await ProjectSeeder()
	await LogSeeder()
	await EventSeeder()
}