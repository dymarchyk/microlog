import { combineReducers } from 'redux'
import events from './Events/EventsReducer'
import logs from './Logs/LogsReducer'
import projects from './Projects/ProjectsReducer'
import user from './User/UserReducer'

export default combineReducers({
	events,
	logs,
	projects,
	user,

})
