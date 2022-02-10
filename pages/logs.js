import React, {
	useEffect,
	useState
}                                 from 'react'
import { useRouter }              from 'next/router'
import { useTranslation }         from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { wrapper }                from '@/redux/store'
import {
	selectLogs,
	selectProject,
	selectProjects,
	selectUser
} from '@/redux/selectors'
import {
	a_selectProject,
	t_loadProjects
}                    from '@/redux/Projects/actions'
import { request }   from '@/services'
import { p_getLogs } from '@/constants/api_routes'
import { t_loadUser }             from '@/redux/User/actions'
import {
	Breadcrumb,
	Empty,
	Row,
	Space,
	Spin,
	Table,
	Tag,
	Typography
} from 'antd'
import dayjs           from 'dayjs'
import Link            from 'next/link'
import {
	useDispatch,
	useSelector
} from 'react-redux'


function getTagColor( level ) {
	
	switch ( level.toLowerCase() ) {
		case 'info':
		default:
			return '#a646b1'
		case 'error':
			return '#be5448'
		case 'warn':
			return '#a7792d'
		case  'debug':
			return '#13346b'
	}
	
}

function LogView( { text } ) {
	const { t } = useTranslation()
	const [ html, setHtml ] = useState('')
	const [ expanded, setExpanded ] = useState(false)
	
	const st = {
		border: 'none', background: 'none',
		fontFamily: '-apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Helvetica Neue\', Arial, \'Noto Sans\', sans-serif, \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Segoe UI Symbol\', \'Noto Color Emoji\''
	}
	
	useEffect(() => {
		setHtml(
			text
				.replace(/\\n/g, '<br>')
				.replace(/\\t/g, '<span style="width: 1em;height: 1px;display: inline-block"></span>')
		)
	}, [])
	
	if ( html.length > 200 && !expanded ) {
		return <Typography.Paragraph>
			<span style={st} dangerouslySetInnerHTML={ { __html: html.substr(0, 197) + '...' } } />
			
			<Typography.Link onClick={ e => {
				e.preventDefault()
				setExpanded(true)
			} }>{ t('Expand') }</Typography.Link>
		</Typography.Paragraph>
	}
	
	return <Typography.Paragraph>
		<pre style={st} dangerouslySetInnerHTML={ { __html: html } } />
		{
			html.length > 200 && expanded &&
			<Typography.Link onClick={ e => {
				e.preventDefault()
				setExpanded(false)
			} }>{ t('Collapse') }</Typography.Link>
		}
	</Typography.Paragraph>
}

const LogsPage = (  ) => {
	const router = useRouter()
	const { t } = useTranslation()
	const user = useSelector(selectUser)
	const projects = useSelector(selectProjects)
	const project = useSelector(selectProject)
	const [logs,setLogs] = useState([])
	
	const d = useDispatch()
	const columns = [
		{
			title    : t('Date'),
			dataIndex: 'createdAt',
			key      : 'createdAt',
			render   : x => dayjs(x)
				.format('HH:mm:ss')
		}, {
			title    : t('Level'),
			dataIndex: 'level',
			key      : 'level',
			render   : x => <Tag color={ getTagColor(x) }>{ t(x) }</Tag>,
			filters  : [
				'info',
				'error',
				'warn',
				'debug'
			].map(x => ( { text: t(x), value: x } )),
			onFilter : ( value, record ) => record.level === value,
		}, {
			title    : t('Namespace'),
			dataIndex: 'namespace',
			key      : 'namespace',
		}, {
			title    : t('Message'),
			dataIndex: 'message',
			key      : 'message',
			width    : '80%',
			render   : x => <LogView text={ x } />
		}
	]
	
	const boot = async () => {
		if(!user){
			if(!d(t_loadUser())){
				return router.push('/login')
			}
		}
		const project = router.query.project
		
		if ( !projects ) {
			let pr = await d(t_loadProjects( ))
			
			d(a_selectProject(pr?.find(x => x._id === project)))
		}
		
		const [ res ] = await request.local({ ...p_getLogs, data: { date: router.query.date } })
		setLogs(res?.data ?? null)
	}
	
	
	useEffect(() => {
		boot()
	},[])
	
	return (
		<div style={{padding         : '20px', height: '100%'}}>
			<div className="colored-blok"
				 style={ {
					 height       : '100%',
					 display      : 'flex',
					 flexDirection: 'column'
				 } }>
				{
					project &&
						<Breadcrumb style={{marginBottom: 10}}>
							<Breadcrumb.Item>
								<Link href="/"
									  shallow>{ project.name }</Link>
							</Breadcrumb.Item>
							<Breadcrumb.Item>
								{ t('Logs') }
							</Breadcrumb.Item>
						</Breadcrumb>
				}
				{
					!logs && <Row style={ { height: '100%' } }
								  align="middle"
								  justify="center">
						<Spin />
					</Row>
				}
				{
					logs?.length === 0 &&
					<Row style={ { height: '100%' } }
						 align="middle"
						 justify="center">
						<Empty />
					</Row>
				}
				{
					logs?.length > 0 &&
					<Table dataSource={ logs }
						   columns={ columns } />
				}
			</div>
		</div>
	)
}

export const getServerSideProps = wrapper.getServerSideProps(store => async ( context ) => {
	const { date, project } = context.query
	
	let projects = selectProjects(store.getState())
	
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
	
	if(!p){
		return {notFound: true}
	}
	
	store.dispatch(
		a_selectProject(
			p
		)
	)
	
	let logs = selectLogs(store.getState())
	
	if(!logs){
		const [ res ] = await request.local({ ...p_getLogs, data: { date } })
		logs = res.data
	}
	
	return {
		props: {
			...await serverSideTranslations(context.locale),
			logs   : logs ?? null,
			project: selectProject(store.getState()) ?? null
		}
	}
})

export default LogsPage