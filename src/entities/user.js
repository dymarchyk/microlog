import {
	model,
	Schema
} from 'mongoose'


const schema = new Schema({
	email: { type: String, unique: true },
	password: String,
	name: String,
	projects: [{type: Schema.Types.ObjectId, ref: 'project'}]
	
}, { timestamps: true })

schema.methods.toJSON = function() {
	let obj = this.toObject()
	delete obj.password
	return obj
}

global.$User = global.$User || model('user', schema)
/**
 * @type {Model<schema>}
 */
export default global.$User