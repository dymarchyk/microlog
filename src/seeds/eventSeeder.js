import {
	Log,
	Project,
	Event
}                 from '@/entities'
import faker      from 'faker'

export default async function eventSeeder(  ){
	const proj = await Project.find({})
	
	let events = proj.map(async x => {
		let logs = []
		
		for ( let i = 0; i < 10; i++ ) {
			let dates = faker.datatype.array(faker.datatype.number(30)).map(() => +faker.date.recent(50))
			logs.push(new Event({
				project: x._id,
				name: faker.lorem.word(10),
				count: dates.length,
				dates
			}).save())
		}
		
		return Promise.all(logs)
	})
	
	await Promise.all(events)
}