import {
	p_getUser,
	p_login,
	p_register
}              from '@/constants/api_routes'
import nookies from 'nookies'



const types = {
	SET_USER: 'SET_USER'
}

export default types

export const a_setUser = (payload) => ({
	type: types.SET_USER,
	payload
})

export const t_loadUser = ( {context} = {}) => async	( dispatch, getState, { local } ) => {
	
	const [res,err] = await local({...p_getUser, context})
	if(err) return console.log(err)
	
	dispatch(a_setUser(res.data))
	
	return res.data
}

export const t_login = ( {email,password} ) => async ( dispatch, getState, { local } ) => {
	const [res,err] = await local({...p_login, data: {email, password}})
	
	if(err) return err
	nookies.set(null, 'user', res.data._id)
	window.location.assign('/?user=' + res.data._id)
	// dispatch(a_setUser(res.data))
}

export const t_register = ( data ) => async ( dispatch, getState, { local } ) => {
	const [ res, err ] = await local({...p_register, data})
	if(err) return err
	nookies.set(null, 'user', res.data._id)
	window.location.assign('/?user=' + res.data._id)
}