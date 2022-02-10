import axios, { AxiosInstance } from 'axios'
import * as qs                  from 'qs'
import {
	noop,
	pickBy
}                               from 'lodash'
import { parseCookies }         from 'nookies'
import { merge }                from 'qs/lib/utils'


let store = null

export const setStore = s => store = s

const log = process.env.NODE_ENV === 'development'
			? console.info
			: noop

const options = {
	paramsSerializer: p => qs.stringify(pickBy(p)),
	timeout         : 10e3,
}

const server = axios.create({
	baseURL: process.env.NEXT_PUBLIC_SERVER,
	...options,
})

const local = axios.create({
	baseURL: typeof window !== 'undefined'
			 ? '/api'
			 : process.env.NEXT_PUBLIC_SITEURL + '/api',
	...options
})

/**
 *
 * @param context {{req: Request, res: Response} | null}
 * @param url {String}
 * @param method {String}
 * @param data {Object}
 * @param client {AxiosInstance}
 * @returns {Promise<{code: (response.status|number), message: (string|*|response.statusText|string)}[]|{code: number, message: string}[]|{redirect: string, code: number, message: string}[]|*[]|[*, null]|[null, {code: number, message: string}]|*|[null, {redirect: string, code: number, message: string}]|[null, {code: number, message}]|[null, {code: *, message}]|undefined|{code: number, message: (string|*|string)}[]>}
 */
async function request( { context = null, url = '/', method = 'get', data = {} } = {}, client = server ) {
	let header = {}
	let cookies = parseCookies(context)
	const state = store.getState()
	
	log('[%s] -> %s with %o and cookies %o', method.toUpperCase(), client.defaults.baseURL + '/' + url, data, cookies)
	
	let apiKey = ''
	
	if ( cookies.user ) {
		apiKey += cookies.user
	}
	else if ( state?.user?._id ) apiKey += state.user._id
	
	if ( state?.projects?.selected?._id ) apiKey += state.projects.selected._id
	if ( cookies._jt ) {
		header.Authorization = `Bearer ${ cookies._jt }`
	}
	try {
		const res = await client({
			method,
			url,
			headers: header,
			data   : method !== 'get'
					 ? data
					 : null,
			params : method === 'get'
					 ? merge({ apiKey }, data)
					 : { apiKey }
		})
		return [ res.data, null ]
	} catch ( e ) {
		if ( e.response ) {
			log(
				method.toUpperCase(),
				client.defaults.baseURL + '/' + url,
				e.response.status,
				e.response.data.message || e.response.statusText
			)
			const { status, data, statusText } = e.response
			switch ( status ) {
				case 500:
					return [ null, { code: 500, ...data, message: data.message || 'server error', } ]
				case 422:
					return [
						null,
						{ code: 422, message: data.message || 'check input' }
					]
				default:
					return [ null, { code: status, message: data.message || statusText || 'error' } ]
			}
		}
		else {
			log(e.message)
			return [ null, e ]
		}
	}
}


export default Object.freeze({
	/**
	 *
	 * @param context {{req: Request, res: Response} || null}
	 * @param url {String}
	 * @param method {String}
	 * @param data {Object}
	 * @returns {Promise<{code: (response.status|number), message: (string|*|response.statusText)}[]|{code: number, message: string}[]|{redirect: string, code: number, message: string}[]|*[]|(*|null)[]|(null|{code: number, message: string})[]|*|(null|{redirect: string, code: number, message: string})[]|(null|{code: number, message})[]|(null|{code: *, message})[]|undefined|{code: number, message: (string|*)}[]>}
	 */
	server: ( { context, url, method, data } ) => request.apply(request, [ { context, url, method, data }, server ]),
	/**
	 * @param context {{req: Request, res: Response} | null}
	 * @param url {String}
	 * @param method {String}
	 * @param data {Object | null}
	 * @returns {Promise<{code: (response.status|number), message: (string|*|response.statusText)}[]|{code: number, message: string}[]|{redirect: string, code: number, message: string}[]|*[]|[*, null]|[null, {code: number, message: string}]|*|[null, {redirect: string, code: number, message: string}]|[null, {code: number, message}]|[null, {code: *, message}]|{code: number, message: (string|*)}[]|undefined>}
	 */
	local: ( { context = null, url, method, data } ) => request.apply(
		request,
		[ { context, url, method, data }, local ]
	)
})
