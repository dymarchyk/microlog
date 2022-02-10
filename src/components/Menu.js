import React                  from 'react'
import {
	Divider,
	Layout,
	Menu as AMenu
}                             from 'antd'
import {
	useDispatch,
	useSelector
}                             from 'react-redux'
import {
	selectProject,
	selectProjects,
	selectUser
}                             from '@/redux/selectors'
import { useTranslation }     from 'next-i18next'
import { useRouter }          from 'next/router'
import { a_selectProject }    from '@/redux/Projects/actions'
import { PlusSquareOutlined } from '@ant-design/icons'


const Menu = () => {
	const user = useSelector(selectUser)
	const projects = useSelector(selectProjects)
	const selectedProject = useSelector(selectProject)
	const { t } = useTranslation()
	const router = useRouter()
	const d = useDispatch()
	
	if ( !user || !projects ) return null
	return (
		<Layout.Sider theme={ 'light' }
					  collapsible
					  defaultCollapsed>
			<AMenu style={{maxHeight: '400px', overflowY: 'auto'}}>
				{
					projects?.map(x => (
						<AMenu.Item
							className={ x.name.toLowerCase() === selectedProject?.name?.toLowerCase() ? 'ant-menu-item-selected' : ''}
							key={ x.createdAt + x.name }
							onClick={ () => {
								d(a_selectProject(x))
								if ( router.pathname !== '/' ) router.push(`/?projectId=${x._id}`, undefined, {shallow: true})
							} }
						>{ x.name }</AMenu.Item>
					))
				}
			</AMenu>
				<Divider key="dv" />
			<AMenu>
				<AMenu.Item key="add"
							icon={ <PlusSquareOutlined /> }
							onClick={ () => router.push('/add-project') }>
					{ t('Add project') }
				</AMenu.Item>
			</AMenu>
			
			
		</Layout.Sider>
	
	)
}

export default Menu