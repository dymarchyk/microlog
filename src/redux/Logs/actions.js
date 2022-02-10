import { p_getLogs } from '@/constants/api_routes'


const types = {
	SET_LOGS      : 'SET_LOGS',
	SET_LOGS_DATES: 'SET_LOGS_DATES',
	CLEAR_LOGS    : 'CLEAR_LOGS'
}

export default types

export const a_setLogs = ( payload, loadedFor, date ) => ( {
	type: types.SET_LOGS,
	payload,
	loadedFor,
	date
} )
export const a_setLogsDates = ( payload, loadedFor ) => ( {
	type: types.SET_LOGS_DATES,
	payload,
	loadedFor
} )
export const a_clearLogs = ( payload ) => ( {
	type: types.CLEAR_LOGS,
	payload,
} )

export const t_loadLogs = ( { context, date } = {} ) => async ( dispatch, getState, { local } ) => {
	const [ res, err ] = await local({ ...p_getLogs, data: { date }, context })
	if ( err ) return console.log(err)
	
	if ( res.dates ) dispatch(a_setLogsDates(res.dates, getState().projects.selected._id))
	if ( res.data ) dispatch(a_setLogs(res.data, getState().projects.selected._id, date))
}