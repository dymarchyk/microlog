import { p_getEvents } from '@/constants/api_routes'


const types = {
	SET_EVENTS  : 'SET_EVENTS',
	CLEAR_EVENTS: 'CLEAR_EVENTS'
}

export default types

export const a_setEvents = ( payload ) => ( {
	type: types.SET_EVENTS,
	payload
} )

export const a_clearEvents = () => ( {
	type: types.CLEAR_EVENTS,
} )

export const t_loadEvents = ( { context } = {} ) => async ( dispatch, getState, { local } ) => {
	const [ res, err ] = await local({ ...p_getEvents, context })
	if ( err ) return console.log(err)
	
	dispatch(a_setEvents(res.data))
	return res.data
}