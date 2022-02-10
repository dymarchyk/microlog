import { User, Project } from '@/entities'
import faker from 'faker'
export default async function projectSeeder(  ){
	const user = await User.findOne()
	let proj = []
	if(!user) throw new Error('No users found')
	for ( let i = 0; i < 100; i++ ) {
		proj.push(new Project({
			owner: user._id,
			name: faker.internet.userName()
		}).save())
	}
	
	proj = await Promise.all(proj)
	user.projects = user.projects.concat(proj)
	await user.save()
}