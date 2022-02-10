import {
	ConfigProvider,
	Layout,
} from 'antd'
import 'antd/dist/antd.css'
import Header                 from 'components/Header'
import Menu                   from 'components/Menu'
import { appWithTranslation } from 'next-i18next'
import { wrapper }            from '@/redux/store'
import '../styles/global.sass'

import ru             from 'antd/lib/locale/ru_RU';
import Head           from 'next/head'
import dayjs          from 'dayjs'
import { t_loadUser } from '@/redux/User/actions'

dayjs.locale(require('dayjs/locale/ru'))

function MyApp( { Component, pageProps } ) {
	
	return <ConfigProvider locale={ru}><Layout style={ { minHeight: '100vh' } }>
		<Head>
			<title>Microlog</title>
			<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			
		</Head>
		<Header />
		<Layout>
			<Menu />
			<Layout.Content>
				<div style={ { height: '100%' } }>
					<Component { ...pageProps } />
				</div>
			</Layout.Content>
		</Layout>
	
	
	</Layout></ConfigProvider>
}

export default MyApp |> appWithTranslation|> wrapper.withRedux

