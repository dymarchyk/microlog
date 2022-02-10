import Joi from 'joi'
/**
 *
 * @param schema {Joi.AnySchema}
 * @param options {Joi.ValidationOptions }
 * @param field {String }
 * @returns {(function(*, *, *): (*|undefined))|*}
 */
export default function validation( schema ,options = null, field = 'body'){

	return function ( req,res,next ){
		const validated = schema.validate(req[field], options)
		if(validated.error){
			return res.status(422).json(validated.error.details[0])
		}
		req.validated = validated.value
		next()
	}
}