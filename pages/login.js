import React from 'react'
import {Button, Col, Form, Input, notification, Row, Space, Typography,} from 'antd'
import {useTranslation} from 'next-i18next'
import {useDispatch} from 'react-redux'
import {t_login} from '@/redux/User/actions'
import Link from 'next/link'
import nookies from 'nookies'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations'


const Login = () => {
	const {t} = useTranslation()
	const d = useDispatch()

	const [loading, setLoading] = React.useState(false)

	const onFinish = async (vals) => {
		setLoading(true)
		const err = await d(t_login(vals))
		setLoading(false)
		if (err) {
			return notification.error({
				message: err.message
			})
		}
	}
	return (
		<Row align="center"
			 style={ { paddingTop: 50 } }>
			<Col span={ 24 }>
				<Typography.Title style={ { textAlign: 'center' } }
								  level={ 2 }>
					{ t('Login') }
				</Typography.Title>
			</Col>
			
			<Col span={ 6 }
				 style={ { marginTop: 80 } }>
				<Form
					labelCol={ { span: 5 } }
					onFinish={ onFinish }
					autoComplete="email"
				>
					<Form.Item
						label={t('Email')}
						name="email"
						rules={ [ { required: true, message: t('Please input your email') } ] }
					>
						<Input autoComplete="email" />
					</Form.Item>
					
					<Form.Item
						label={t('Password')}
						name="password"
						rules={ [ { required: true, message: t('Please input your password') } ] }
					>
						<Input.Password autoComplete="password" />
					</Form.Item>
					
					
					<Form.Item wrapperCol={ { offset: 10, span: 16 } }>
						<Space>
							<Button type="primary"
									htmlType="submit">
								{loading ? t('Loading') : t('Login')}
							</Button>
							<Link passHref
								  href="/register">
								<Button type={ 'link' }>
									{t('Register')}
								</Button>
							</Link>
						</Space>
					</Form.Item>
				</Form>
			</Col>
		</Row>
	)
}

export const getServerSideProps = async context => {
	if(context.query.reset){
		nookies.destroy(context, 'user')
	}
	
	return {props:  await serverSideTranslations(context.locale) }
}

export default Login