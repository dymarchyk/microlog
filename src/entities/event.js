import {
	model,
	Schema,
} from 'mongoose'


const schema = new Schema({
	name   : String,
	count  : { type: Number, default: 0 },
	dates  : [ Number ],
	project: { type: Schema.Types.ObjectId, ref: 'project' }
}, { timestamps: true })

global.$Event = global.$Event || model('event', schema)
/**
 * @type {Model<schema>}
 */
export default global.$Event