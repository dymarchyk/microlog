import {
	model,
	Schema,
}               from 'mongoose'
import { pick } from 'lodash'

const schema = new Schema({
	name: String,
	owner: {type: Schema.Types.ObjectId, ref: 'user'},
	sharedWith: [{
		type:Schema.Types.ObjectId,
		ref: 'user'
	}]
}, { timestamps: true })

schema.methods.toJSON = function (  ){
	let json = this.toObject()
	json.sharedWith = json.sharedWith.map(x => pick(x, ['_id', 'email']))
	return json
}
global.$Project = global.$Project || model('project', schema)
/**
 * @type {Model<schema>}
 */
export default global.$Project