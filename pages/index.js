import {
	useDispatch,
	useSelector
}                                 from 'react-redux'
import {
	useEffect,
	useState
}                                 from 'react'
import { t_loadUser }             from '@/redux/User/actions'
import {
	selectEvents,
	selectLogsDates,
	selectProject,
	selectProjects,
	selectUser
} from '@/redux/selectors'
import { useRouter }              from 'next/router'
import {
	Badge,
	Button,
	Col,
	Descriptions,
	Dropdown,
	Empty,
	List,
	Menu,
	notification,
	PageHeader,
	Row,
	Space,
	Tag,
	Typography
} from 'antd'
import { useTranslation }         from 'next-i18next'
import {
	DeleteOutlined,
	EditOutlined,
	EllipsisOutlined,
	MenuOutlined
}                  from '@ant-design/icons'
import { request } from '@/services'
import {
	p_deleteLogs,
	p_getEvents,
	p_getLogs
}                  from '@/constants/api_routes'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { wrapper }      from '@/redux/store'
import {
	a_selectProject,
	t_deleteProject,
	t_loadProjects
}                       from '@/redux/Projects/actions'
import styled           from 'styled-components'
import { last }         from 'lodash'
import dayjs                     from 'dayjs'
import nookies, { parseCookies } from 'nookies'
import {
	a_clearLogs,
	t_loadLogs
}                                from '@/redux/Logs/actions'
import {
	a_clearEvents,
	t_loadEvents
}                                from '@/redux/Events/actions'
import Link                      from 'next/link'
import project                   from '@/entities/project'

dayjs.extend(require('dayjs/plugin/relativeTime'))

export default function Home() {
	const d = useDispatch()
	const user = useSelector(selectUser)
	const { t } = useTranslation()
	const router = useRouter()
	const selected = useSelector(selectProject)
	const dates = useSelector(selectLogsDates)
	const events = useSelector(selectEvents)
	const loadedFor = useSelector(s => s?.logs?.loadedFor)
	const loadedForDate = useSelector(s => s?.logs?.date)
	
	useEffect(() => {
		if(Object.keys(router.query).length) router.replace('/', undefined, { shallow: true });
	}, [router.query])
	
	useEffect(() => {
		
		if ( selected && selected._id !== loadedFor ) {
			d(a_clearLogs())
			d(a_clearEvents())
			d(t_loadLogs())
			d(t_loadEvents())
		}
	}, [ selected ])
	
	const deleteProject = async () => {
		let err = await d(t_deleteProject(selected._id))
		if ( err ) notification.error(err)
	}
	
	const clearLogs = async date => {
		const [_,err] = await request.local({...p_deleteLogs, data: {date}})
		if(err) return notification.error(err)
		d(t_loadLogs())
	}
	
	const loadLogsFor = async date => {
		
		if(loadedForDate !== date) await d(t_loadLogs({date}))
		
		router.push({
			pathname: '/logs',
			query   : { date: date, project: selected._id }
		})
	}
	
	return (
		<>
			{
				selected ?
				<Col style={ { padding: 20, height: '100%', display: 'flex', flexDirection: 'column' } }>
					<PageHeader
						style={ {
							padding: '0 0 1rem'
						} }
						title={ selected.name }
						onBack={ null }
						extra={ selected.owner === user._id && [
							<Dropdown key="opts"
									  overlay={ <Menu style={ { marginRight: 8 } }>
										  <Menu.Item onClick={ () => router.push({
											  pathname: '/add-project',
											  query   : { projectId: selected._id }
										  }) }
													 key="delete">
											  <Space>
												  <EditOutlined />
												  { t('Edit') }
											  </Space>
										  </Menu.Item>
										  <Menu.Item onClick={ deleteProject }
													 key="delete">
											  <Space>
												  <DeleteOutlined />
												  { t('Delete') }
											  </Space>
										  </Menu.Item>
									  </Menu> }>
								<Button
									type={'dashed'}
									shape={'circle'}
									className='header-menu-btn'
									style={ {
										border : 'none',
										padding: 0,
									} }
									icon={
										<MenuOutlined
											className='header-menu-icon'
											style={ {
												verticalAlign: 'top',
											} }
										/>
									}
								/>
								
							</Dropdown>
						] }
					>
						<Typography.Paragraph>
							{ t('Your api key:') } { ' ' }
							<Typography.Text code
											 copyable>{ `${ user._id }${ selected._id }` }</Typography.Text>
						</Typography.Paragraph>
					
					</PageHeader>
					
					<div className='colored-blok' style={ {
						height         : '100%',
						display        : 'flex',
						flexDirection  : 'column'
					} }>
						<Row gutter={ [ 32, 0 ] }>
							<Col span={ 8 }>
								<List
									size="small"
									split
									loading={!dates}
									rowKey={ 'date' }
									itemLayout={ 'vertical' }
									header={ <Typography.Title style={{textAlign: 'center'}} level={ 4 }>{ t('Logs') }</Typography.Title> }
									dataSource={ dates ?? [] }
									renderItem={ x => <ListItem
										className={'hoverable'}
										extra={ [
											<Button key={ 'dlt' }
													onClick={ () => clearLogs(x) }
													shape="circle"
													icon={ <DeleteOutlined /> }>
											</Button>
										] }>
										<List.Item.Meta
											onClick={ () => loadLogsFor(x.date)  }
											title={ <Badge type="success"
														   offset={ [ 10, 0 ] }
														   dot={ dayjs()
															   .format('YYYY-MM-DD') === x.date }>{ x.date }</Badge> }
											description={ t('Records') + `: ${ x.count }` }
										/>
									
									</ListItem> }
								/>
							</Col>
							<Col span={ 8 }>
								<List
									loading={!events}
									dataSource={ events || [] }
									rowKey={ '_id' }
									size="small"
									split
									itemLayout={ 'vertical' }
									header={ <Typography.Title style={{textAlign: 'center'}} level={ 4 }>{ t('Events') }</Typography.Title> }
									renderItem={ row => (
										<ListItem onClick={() => router.push({
											pathname: '/events-data',
											query: {event: row._id, project: selected._id}
										})}  className={'hoverable'}>
											<Descriptions layout="vertical"
														  size="small">
												<Descriptions.Item label={ t('Event name') }>
													<Tag color="#8B9556">{ row.name }</Tag>
												</Descriptions.Item>
												<Descriptions.Item label={ t('Count') }>{ row.count }</Descriptions.Item>
												<Descriptions.Item label={ t('Last event') }>{ row.dates |> last  |> dayjs |> ( x => x.from(
													new Date()) ) }</Descriptions.Item>
											</Descriptions>
										</ListItem>
									) }
								/>
							</Col>
						</Row>
					
					</div>
				</Col>
				: <Row align='middle' justify='center' style={{height: '100%'}}>
					<Col align={'middle'}>
						<Empty/>
						<Link href='/add-project'>{t('Add project')}</Link>
					</Col>
				</Row>
			}
		</>
	)
}

const ListItem = styled(List.Item)`
	cursor: pointer;
`

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
	
	if ( context.query.user ) {
		nookies.destroy(context, 'user')
		nookies.set(context, 'user', context.query.user.toString())
	}
	
	if(!await store.dispatch(t_loadUser({ context }))){
		return {
			redirect: {destination: '/login'}
		}
	}
	let projects = await store.dispatch(t_loadProjects({context})) || []
	
	if(projects[0]){
		store.dispatch(a_selectProject(projects.find(x => x._id === context.query.projectId) ||  projects[0]))
	}
	
	return {
		props: await serverSideTranslations(context.locale)
	}
})
