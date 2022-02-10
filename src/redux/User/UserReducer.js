
import types       from './actions'
import { HYDRATE } from 'next-redux-wrapper'

const initialState = null

export default function userReducer(state = initialState, { type, payload }) {
	switch (type) {
		case HYDRATE:
			return payload?.user ?? state
		case types.SET_USER:
			return payload
		default:
			return state
	}
}
