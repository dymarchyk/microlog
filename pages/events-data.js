import React, {
	useEffect,
	useState
}                                 from 'react'
import { wrapper }                from '@/redux/store'
import {
	selectEvents,
	selectProject,
	selectProjects,
	selectUser
} from '@/redux/selectors'
import { t_loadUser }             from '@/redux/User/actions'
import {
	a_selectProject,
	t_loadProjects
}                                 from '@/redux/Projects/actions'
import { request }                from '@/services'
import { p_getEvents }            from '@/constants/api_routes'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Breadcrumb }             from 'antd'
import Link                       from 'next/link'
import { useTranslation }         from 'next-i18next'
import dayjs                      from 'dayjs'
import { groupBy }                from 'lodash'
import { Line }                   from 'react-chartjs-2'


import {
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip,
} from 'chart.js'


ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
)

const EventsData = ( { event, project } ) => {
	const { t } = useTranslation()
	const [ groups, setGroups ] = useState([])
	
	useEffect(() => {
		groupBy(
			event.dates,
			x => dayjs(+x)
				.format('DD.MM')
		) |> setGroups
	}, [ event.dates ])
	
	return (
		<div style={ { padding: '20px', height: '100%' } }>
			<div className="colored-blok"
				 style={ {
					 height       : '100%',
					 display      : 'flex',
					 flexDirection: 'column'
				 } }>
				
				{
					event &&
					<Breadcrumb style={ { marginBottom: 10 } }>
						<Breadcrumb.Item>
							<Link href="/"
								  shallow>{ project.name }</Link>
						</Breadcrumb.Item>
						<Breadcrumb.Item>
							<Link href="/"
								  shallow>
							{ t('Events') }
							</Link>
						</Breadcrumb.Item>
						<Breadcrumb.Item>
							{ event.name }
						</Breadcrumb.Item>
					</Breadcrumb>
				}
				
				
				<Line
					type="line"
					style={ { maxHeight: 600 } }
					options={ {
						scales: {
							yAxis: {
								beginAtZero: false,
								gridLines: {
									drawTicks: false,
								},
								
								ticks: {
									stepSize: 1,
									// callback: function ( value, index, values ) {
									// 	return value % 1 === 0 ? value : ''
									// }
								}
							}
						},
						plugins: {
							legend: {
								display: false
							},
						}
					} }
					data={ {
						labels: Object.keys(groups),
						
						datasets: [
							{
								label          : event.name,
								data           : Object.values(groups)
									.map(x => x.length),
								borderColor    : 'rgb(255, 99, 132)',
								backgroundColor: 'rgba(255, 99, 132, 0.5)',
							}
						]
					} }
				/>
			</div>
		</div>
	
	)
}

export const getServerSideProps = wrapper.getServerSideProps(store => async ( context ) => {
	const { date, event, project } = context.query
	const state = store.getState()
	let projects = selectProjects(state)
	
	await store.dispatch(t_loadUser({ context }))
	
	if ( !selectUser(store.getState()) ) {
		return {
			redirect: {
				destination: '/login',
				permanent  : true
			}
		}
	}
	
	if ( !projects ) {
		await store.dispatch(t_loadProjects({ context }))
		projects = selectProjects(store.getState())
	}
	
	const p = projects.find(x => x._id === project)
	
	if ( !p ) {
		return { notFound: true }
	}
	
	store.dispatch(
		a_selectProject(
			p
		)
	)
	
	let evt = selectEvents(store.getState())?.find(x => x._id === event)
	
	if(!evt){
		const [ res ] = await request.local({ ...p_getEvents, data: { id: event } })
		
		evt = res.data
	}
	
	return {
		props: {
			...await serverSideTranslations(context.locale),
			event  : evt,
			project: selectProject(store.getState()) ?? null
		}
	}
})


export default EventsData