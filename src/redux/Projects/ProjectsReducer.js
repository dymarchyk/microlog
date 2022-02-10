import types       from './actions'
import { HYDRATE } from 'next-redux-wrapper'


const initialState = null

export default function projectsReducer( state = initialState, { type, payload } ) {
	switch ( type ) {
		case HYDRATE:
			return payload.projects || state
		case types.SET_PROJECTS:
			return payload
		case types.ADD_PROJECT:
			return { ...state, data: [ payload, ...state.data ] }
		case types.SELECT_PROJECT:
			return { ...state, selected: payload }
		case types.DELETE_PROJECT:
			let p = state.data.filter(x => x._id !== payload)
			
			return { ...state, data: p, selected: p[0] }
		
		case types.UPDATE_PROJECT:
			return { ...state,
				data    : state.data.map(x => x._id === payload._id
											  ? payload
											  : x),
				selected: state.selected._id === payload._id
						  ? payload
						  : state.selected
			}
		default:
			return state
	}
}
