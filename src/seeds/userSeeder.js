import { User } from '@/entities'
import bcrypt   from 'bcryptjs'


export default async function userSeeder() {
	await User.create({ email: 'mail@mail.com', password: await bcrypt.hash('123456', await bcrypt.genSalt(10)) })
	
}