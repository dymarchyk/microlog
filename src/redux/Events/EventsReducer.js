
import types from './actions'

const initialState = null

export default function eventsReducer(state = initialState, { type, payload }) {
	switch (type) {
		case types.SET_EVENTS:
			return payload
		case types.CLEAR_EVENTS:
			return initialState
		default:
			return state
	}
}
