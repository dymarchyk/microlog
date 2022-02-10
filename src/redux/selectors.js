import { capitalize } from 'lodash'


export const selectUser = s => s.user

export const selectProjects = s => s?.projects?.data?.map(x => ({...x, name: capitalize(x.name)}))

export const selectProject = s => s?.projects?.selected

export const selectLogs = s => s?.logs?.data
export const selectLogsDates = s => s?.logs?.dates
export const selectEvents = s => s?.events