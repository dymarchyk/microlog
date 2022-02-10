import React, {
	useEffect,
	useState
}                                 from 'react'
import {
	Button,
	Card,
	Col,
	Form,
	Input,
	Menu,
	notification,
	Row,
	Space,
	Spin,
	Tag,
	Typography
}                                 from 'antd'
import { useTranslation }         from 'next-i18next'
import {
	useDispatch,
	useSelector
}                                 from 'react-redux'
import {
	a_selectProject,
	t_createProject,
	t_loadProjects,
	t_updateProject
}                                 from '@/redux/Projects/actions'
import { useRouter }              from 'next/router'
import {
	selectProjects,
	selectUser
}                  from '@/redux/selectors'
import { request } from '@/services'
import {
	p_loadProjects,
	p_searchUser
}                  from '@/constants/api_routes'
import {
	debounce,
	pick
}                                 from 'lodash'
import { DeleteOutlined }         from '@ant-design/icons'
import { t_loadUser }             from '@/redux/User/actions'
import { wrapper }                from '@/redux/store'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'


const AddProject = () => {
	const { t } = useTranslation()
	const [ editForm ] = Form.useForm()
	const d = useDispatch()
	const router = useRouter()
	const p = useSelector(selectProjects)
	const [ project, setProject ] = useState(null)
	const [ searchRes, setSearchRes ] = useState([])
	
	
	const onUpdate = async ( vals ) => {
		let err = await d(t_updateProject({ ...project, name: vals.name }))
		if ( err ) return notification.error(err)
		
		notification.success({
			message    : t('Success'),
			description: t('{{name}} was updated.', project)
		})
	}
	
	const onSave = async ( vals ) => {
		let err = await d(t_createProject(vals))
		if ( err ) return notification.error(err)
		
		a_selectProject(p[0])
		router.push('/')
	}
	
	const searchUsers = debounce(( async q => {
		if ( q.trim().length === 0 ) return setSearchRes([])
		setSearchRes(null)
		const [ res, err ] = await request.local({ ...p_searchUser, data: { q } })
		if ( res.data ) {
			setSearchRes(res.data.map(x => pick(x, [ '_id', 'email' ])))
		}
		else {
			setSearchRes([])
		}
	} ), 600)
	
	useEffect(() => {
		if ( router.query.projectId ) {
			request.local({ ...p_loadProjects, data: { id: router.query.projectId } })
				.then(( [ res ] ) => {
					if ( res?.data ) {
						setProject(res.data)
						d(a_selectProject(res.data))
					}
				})
		}
	}, [ router.query.projectId ])
	
	if ( router.query.projectId ) {
		return <Row style={ { height: '100%', padding: 20 } }>
			<Col span={ 24 }
				 justify="center">
				{
					project
					?
					<Card style={ { height: '100%', border: 0 } }
						  className="colored-blok">
						<Form
							onFinish={ onUpdate }
							form={ editForm }
							initialValues={ project }
							onKeyDown={ ( e ) => e.keyCode == 13
												 ? e.preventDefault()
												 : '' }
							layout="vertical">
							<Row gutter={ 20 }>
								<Col span={ 24 }>
									<Typography.Title level={ 3 }
													  style={ { textAlign: 'center', marginBottom: 16 } }>{ t(
										'Edit {{name}}',
										project
									) }</Typography.Title>
								</Col>
								
								<Col span={ 8 }>
									<Form.Item
										label={ t('Project name') }
										name="name">
										<Input placeholder="My project" />
									</Form.Item>
									
									<Form.Item name="search"
											   label={ t('Collaborate') }>
										<Space style={ { marginBottom: 16 } }>
											{
												project.sharedWith.map(x => <Tag icon={
													<DeleteOutlined onClick={ () => {
														setProject({
															...project,
															sharedWith: project.sharedWith.filter(r => x._id !== r._id)
														})
													} } /> }
																				 key={ x._id }
																				 color="#F9975D">{ x.email }</Tag>)
											}
										</Space>
										<Input.Search onSearch={ searchUsers }
													  loading={ !searchRes } />
										<Menu>
											{
												searchRes?.map(x => ( <Menu.Item onClick={ () => {
													setProject({
														...project,
														sharedWith: [ x, ...project.sharedWith ]
													})
													setSearchRes(searchRes.filter(x => x._id !== x._id))
													editForm.resetFields([ 'search' ])
													
												} }
																				 key={ x._id }>{ x.email }</Menu.Item> ))
											}
										</Menu>
									</Form.Item>
									
									<Form.Item>
										<Row align="center"
											 justify={ 'center' }>
											<Button htmlType="submit"
													type="primary">{ t('Update') }</Button>
										</Row>
									</Form.Item>
								
								
								</Col>
							</Row>
						</Form>
					</Card>
					: <Card style={ {
						alignItems    : 'center',
						justifyContent: 'center',
						display       : 'flex',
						height        : '100%'
					} }>
						<Spin />
					</Card>
				}
			</Col>
		
		</Row>
	}
	
	return (
		
		<div style={ { flex: '1 0 auto', height: '100%', border: 0, padding: 20 } }>
			<Row
				className="colored-blok"
				style={ { height: '100%', } }
				align="stretch"
				justify="center">
				<Col span={ 8 }>
					<Form
						style={{marginTop: 120}}
						onFinish={ onSave }
						layout="vertical">
						<Form.Item
							label={ t('Project name') }
							rules={ [
								{
									required: true,
									message : t('Input project name')
								}
							] }
							name="name">
							<Input placeholder="My project" />
						</Form.Item>
						
						<Form.Item>
							<Row align="center"
								 justify={ 'center' }>
								<Button htmlType="submit"
										type="primary">{ t('Save') }</Button>
							</Row>
						</Form.Item>
					</Form>
				</Col>
			</Row>
		</div>
	
	
	)
}

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
	if ( !selectUser(store.getState()) ) {
		if ( !await store.dispatch(t_loadUser({ context })) ) {
			return {
				redirect: { destination: '/login' }
			}
		}
		await store.dispatch(t_loadProjects({ context }))
	}
	
	return {
		props: await serverSideTranslations(context.locale)
	}
})

export default AddProject