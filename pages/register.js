import React                      from 'react'
import {
	Button,
	Col,
	Form,
	Input,
	notification,
	Row,
	Space,
	Typography
}                                 from 'antd'
import { useTranslation }         from 'next-i18next'
import Link                       from 'next/link'
import { useDispatch }            from 'react-redux'
import { t_register }             from '@/redux/User/actions'
import { omit }                   from 'lodash'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'


const Register = () => {
	const { t } = useTranslation()
	const d = useDispatch()
	
	const onFinish = async ( vals ) => {
		if ( vals.password !== vals.password_confirmation ) {
			return notification.error({ message: 'Passwords not match' })
		}
		
		const err = await d(t_register(omit(vals, [ 'password_confirmation' ])))
		if ( err ) {
			return notification.error({
				message: err.message.match(/duplicate/)
						 ? t('Email is not unique')
						 : err.message
			})
		}
	}
	
	return (
		<Row align="center"
			 style={ { paddingTop: 50 } }>
			<Col span={ 24 }>
				<Typography.Title style={ { textAlign: 'center' } }
								  level={ 2 }>
					{ t('Register') }
				</Typography.Title>
			</Col>
			
			<Col span={ 8 }
				 style={ { marginTop: 80 } }>
				<Form
					name="basic"
					labelCol={ { span: 7 } }
					// wrapperCol={{ span: 12 }}
					// initialValues={{ remember: true }}
					onFinish={ onFinish }
					autoComplete="on"
				>
					<Form.Item
						label="Email"
						name="email"
						rules={ [ { required: true, message: t('Please input your email') } ] }
					>
						<Input />
					</Form.Item>
					
					<Form.Item
						label={ t('Password') }
						name="password"
						rules={ [ { required: true, message: t('Please input your password') } ] }
					>
						<Input.Password />
					</Form.Item>
					
					<Form.Item
						label={ t('Confirm password') }
						name="password_confirmation"
						rules={ [ { required: true, message: t('Please confirm password') } ] }
					>
						<Input.Password />
					</Form.Item>
					
					<Form.Item wrapperCol={ { offset: 10, span: 16 } }>
						<Space>
							<Button type="primary"
									htmlType="submit">
								{ t('Register') }
							</Button>
							
							<Link passHref
								  href="/login">
								<Button type="link">
									{ t('Login') }
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
	return {
		props: await serverSideTranslations(context.locale)
	}
}

export default Register