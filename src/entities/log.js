import {
	model,
	Schema,
} from 'mongoose'

const schema = new Schema({
	message: String,
	level: String,
	namespace: String,
	project: {type: Schema.Types.ObjectId, ref: 'project'}
}, { timestamps: true })

global.$Log = global.$Log || model('log', schema)
/**
 * @type {Model<schema>}
 */
export default global.$Log