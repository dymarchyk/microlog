import {
	applyMiddleware,
	createStore
}                  from 'redux'
import rootReducer from './RootReducer'
import ReduxThunk  from 'redux-thunk'

import { createWrapper }       from 'next-redux-wrapper'
import { composeWithDevTools } from 'redux-devtools-extension'


import { request, setStore } from '@/services'


export const store = createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(ReduxThunk.withExtraArgument(request)))
)

setStore(store)
const makeStore = () => store

export const wrapper = createWrapper(makeStore, { debug: false })
