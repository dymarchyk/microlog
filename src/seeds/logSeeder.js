import {
	Log,
	Project
}                 from '@/entities'
import { sample } from 'lodash'
import faker      from 'faker'


export default async function logSeeder() {
	const proj = await Project.find({})
	
	let tasks = proj.map(async x => {
		let logs = []
		
		for ( let i = 0; i < 10; i++ ) {
			logs.push(new Log({
				level    : sample([ 'info', 'error', 'debug', 'warn' ]),
				namespace: faker.animal.bear(),
				message  : [
					faker.lorem.lines(2),
					JSON.stringify(JSON.parse(faker.datatype.json()), null, 2),
					faker.lorem.lines(10),
					JSON.stringify(faker.datatype.array(20), null, 2)
				].join('\n'),
				project  : x._id,
				createdAt: faker.date.recent(2)
			}).save())
		}
		
		return Promise.all(logs)
	})
	
	await Promise.all(tasks)
}