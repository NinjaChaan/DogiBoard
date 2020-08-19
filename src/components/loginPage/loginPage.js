/* eslint-disable indent */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-trailing-spaces */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { connect, useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import validator from 'email-validator'
import { Link, useLocation } from 'react-router-dom'
import { login } from '../../redux/actions/index'
import loginService from '../../services/login'
import userService from '../../services/users'
import Button from '../Button'
import StatusMessage from '../StatusMessage'
import Toggle from '../Toggle'
import { device } from '../../devices'

const PageContainer = styled.div`
	display: flex;
	align-content: center;
	height: 100vh;
`

const LoginContainer = styled.div`
	margin: 60px auto auto auto;
	width: 100%;
	text-align: center;
	@media ${device.mobileL} {
		width: 60%;
	}
`

const LoginTextarea = styled.input`
	height: 2rem;
	resize: none;
	width: 100%;
	margin-bottom: 20px;
	border-radius: 4px;
	padding-left: 5px;
`

const LoginButton = styled(Button)`
	width: 50%;
	margin: 0 auto;
	@media ${device.mobileL} {
		width: 40%;
	}
`

const TextSpan = styled.span`
	text-align: left;
`

const LoginForm = styled.form`
	margin: auto;
	width: 80%;	
	@media ${device.mobileL} {
		width: 70%;
	}
	@media ${device.laptop} { 
		width: 50%;
	}
`

const SignUpLink = styled.span`

`

const LoginButtonContainer = styled.div`
	margin: auto;
	margin-bottom: 100px;
	display: flex;
`

const SignUpContainer = styled.div`
	padding: 5px 0;
`

const LoginPage = ({ dispatch }) => {
	const user = useSelector((state) => state.user)
	const [statusMessage, setStatusMessage] = useState('')
	const [statusType, setStatusType] = useState('')
	const signUp = useLocation().pathname.includes('/signup')

	const handleSubmit = (event) => {
		event.preventDefault()
		const username = document.getElementById('usernameField').value
		const pass = document.getElementById('passwordField').value
		if (!window.location.pathname.includes('/signup')) {
			loginService.login({ username, password: pass }).then((response) => {
				console.log('login response', response)
				if (response && response.status) {
					if (response.status === 200) {
						setStatusType('success')
						setStatusMessage('Logged in successfully')
						setTimeout(() => {
							if (Cookies.get('stayLogged') === 'true') {
								Cookies.set('token', response.data.token, { expires: 365, secure: true })
							}
							dispatch(login({ loggedIn: true, token: response.data.token, user: response.data.user }))
						}, 1000)
					} else if (response.status === 401) {
						setStatusType('error')
						setStatusMessage(response.data.error)
					} else {
						setStatusType('error')
						setStatusMessage(response.data.error)
					}
				}
			})
		} else {
			let passAgain
			if (document.getElementById('passwordFieldAgain')) {
				passAgain = document.getElementById('passwordFieldAgain').value
			}

			if (pass === passAgain) {
				const email = document.getElementById('emailField').value
				userService.create({ username, password: pass, email }).then((response) => {
					console.log('singup response', response)
					if (response && response.status) {
						if (response.status === 200) {
							loginService.login({ username, password: pass }).then((res) => {
								console.log('login response', res)
								if (res && res.status) {
									if (res.status === 200) {
										setStatusType('success')
										setStatusMessage('Signed up successfully')
										setTimeout(() => {
											if (Cookies.get('stayLogged') === 'true') {
												Cookies.set('token', res.data.token, { expires: 365, secure: true })
											}
											dispatch(login({ loggedIn: true, token: res.data.token, user: res.data.user }))
										}, 1000)
									} else if (res.status === 401) {
										setStatusType('error')
										setStatusMessage(res.data.error)
									} else {
										setStatusType('error')
										setStatusMessage(response.data.error)
									}
								}
							})
						} else if (response.status === 401) {
							setStatusType('error')
							setStatusMessage(response.data.error)
						} else {
							setStatusType('error')
							if (response.data.error.includes('That username already exists')) {
								setStatusMessage('That username already exists')
							} else if (response.data.error.includes('That email already exists')) {
								setStatusMessage('That email already exists')
							} else {
								setStatusMessage(response.data.error)
							}
						}
					}
				})
			} else {
				setStatusType('error')
				setStatusMessage('Password and password confirmation don\'t match')
			}
		}
	}

	useEffect(() => {
		if (user.loggedOut) {
			setStatusType('success')
			setStatusMessage('Logged out')
		}
	}, [user])

	useEffect(() => {
		const listener = (event) => {
			if (event.code === 'Enter' || event.code === 'NumpadEnter') {
				handleSubmit(event)
			}
		}
		document.addEventListener('keydown', listener)
		return () => {
			document.removeEventListener('keydown', listener)
		}
	}, [])

	const keepLoggedInChanged = (value) => {
		Cookies.set('stayLogged', value, { expires: 365 })
	}

	const checkEmailValidity = () => {
		if (!validator.validate(document.getElementById('emailField').value)) {
			setStatusType('error')
			setStatusMessage('Invalid email address')
		} else {
			setStatusType(null)
			setStatusMessage(null)
		}
	}

	const checkPasswordValidity = () => {
		const pass = document.getElementById('passwordField').value
		let passAgain = null
		if (document.getElementById('passwordFieldAgain')) {
			passAgain = document.getElementById('passwordFieldAgain').value
		}
		if (pass.length > 0 && passAgain &&  passAgain.length > 0) {
			if (pass !== passAgain) {
				setStatusType('error')
				setStatusMessage('Password and password confirmation don\'t match')
			} else {
				setStatusType(null)
				setStatusMessage(null)
			}
		}
	}

	return (
		<PageContainer>
			<LoginContainer>
				<LoginForm onSubmit={handleSubmit}>
					<StatusMessage statusMessage={statusMessage} statusType={statusType} />
					{signUp
						? (
							<>
								<TextSpan>Username</TextSpan>
								<br />
								<LoginTextarea id="usernameField" />
								<br />
								<TextSpan>Email</TextSpan>
								<br />
								<LoginTextarea onBlur={checkEmailValidity} type="email" id="emailField" />
								<br />
							</>
						) : (
							<>
								<TextSpan>Username or email</TextSpan>
								<br />
								<LoginTextarea id="usernameField" />
								<br />
							</>
						)}
					<TextSpan>Password</TextSpan>
					<br />
					<LoginTextarea onBlur={checkPasswordValidity} type="password" id="passwordField" />
					<br />
					{signUp
						&& (
							<>
								<TextSpan>Confirm password</TextSpan>
								<br />
								<LoginTextarea onBlur={checkPasswordValidity} type="password" id="passwordFieldAgain" />
								<br />
							</>
						)}
					<Toggle scale={0.75} text="Keep me logged in" checked={Cookies.get('stayLogged') === 'true'} onChange={keepLoggedInChanged} />
					<LoginButtonContainer>
						<LoginButton type="submit">
							{signUp ? (
								'Sign up'
							) : (
									'Log in'
								)}
						</LoginButton>
						{!signUp
							&& (
								<SignUpContainer>
									<span style={{ margin: '0 10px' }}>Don't have an account yet?</span>
									<Link to="/signup">
										<SignUpLink>Sign up!</SignUpLink>
									</Link>
								</SignUpContainer>
							)}
					</LoginButtonContainer>
				</LoginForm>
			</LoginContainer>
		</PageContainer>
	)
}

export default connect(null, null)(LoginPage)
