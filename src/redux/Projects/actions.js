import {
	p_createProject,
	p_deleteProject,
	p_loadProjects,
	p_updateProject
} from '@/constants/api_routes'


const types = {
	SET_PROJECTS: 'SET_PROJECTS',
	ADD_PROJECT: 'ADD_PROJECT',
	SELECT_PROJECT: 'SELECT_PROJECT',
	DELETE_PROJECT: 'DELETE_PROJECT',
	UPDATE_PROJECT: 'UPDATE_PROJECT',
}

export default types

export const a_setProjects = (payload) => ({
	type: types.SET_PROJECTS,
	payload
})

export const a_addProject = (payload) => ({
	type: types.ADD_PROJECT,
	payload
})

export const a_selectProject = (payload) => ({
	type: types.SELECT_PROJECT,
	payload
})
export const a_deleteProject = (payload) => ({
	type: types.DELETE_PROJECT,
	payload
})
export const a_updateProject = (payload) => ({
	type: types.UPDATE_PROJECT,
	payload
})

export const t_loadProjects = ( {context} = {} ) => async( dispatch, getState, { local } ) => {
	const [res, err] = await local({...p_loadProjects, context})
	if(err) return console.log(err)
	
	dispatch(a_setProjects({data: res.data}))
	return  res.data
}

export const t_createProject = ( data ) => async ( dispatch, getState, { local } ) => {
	const [ res, err ] = await local({...p_createProject, data})
	
	if(err) return err
	
	dispatch(
		a_addProject(res.data)
	)
}

export const t_deleteProject = ( id ) => async ( dispatch, getState, { local } ) => {

	const [ _, err ] = await local({...p_deleteProject, data: {id}})
	if(err) return err
	
	dispatch(a_deleteProject(id))
}

export const t_updateProject = ( data ) => async ( dispatch, getState, { local } ) => {
	
	const [ res, err ] = await local({...p_updateProject, data })
	if(err) return err
	
	dispatch(a_updateProject(res.data))
}

