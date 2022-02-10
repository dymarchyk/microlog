import React              from 'react'
import {
	Button,
	PageHeader
}                         from 'antd'
import { useSelector }    from 'react-redux'
import { selectUser }     from '@/redux/selectors'
import { useTranslation } from 'next-i18next'
import { request }        from '@/services'
import { p_logout }       from '@/constants/api_routes'
import { useRouter }      from 'next/router'
import nookies            from 'nookies'
import { LogoutOutlined } from '@ant-design/icons'


const Header = () => {
	const user = useSelector(selectUser)
	const { t } = useTranslation()
	const router = useRouter()
	return (
		<PageHeader
			className="site-page-header"
			title="Microlog"
			subTitle={user?.email}
			ghost={false}
			extra={ user? [
				<Button key="x"
						icon={<LogoutOutlined />}
						onClick={() => {
							request.local(p_logout)
							nookies.destroy(null, 'user')
							window.location.assign('/login?reset')
						}}
						title={t('Logout')}
						shape='circle'
						type="primary"/>
			] : null }
		>
		</PageHeader>
	)
}

export default Header