
import types       from './actions'
import { HYDRATE } from 'next-redux-wrapper'

const initialState = {dates: null, data: [], loadedFor: null, date: null}

export default function logsReducer(state = initialState, { type, payload, loadedFor, date }) {
	switch (type) {
		case HYDRATE:
			return state.logs ?? state
		case types.SET_LOGS:
			return { ...state, data: payload , loadedFor, date }
		case types.SET_LOGS_DATES:
			return {...state, dates: payload , loadedFor}
		case types.CLEAR_LOGS:
			return initialState
		default:
			return state
	}
}
