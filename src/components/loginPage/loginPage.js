/* eslint-disable indent */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-trailing-spaces */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { connect, useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import { login } from '../../redux/actions/index'
import loginService from '../../services/login'
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
	margin: 10px auto auto auto;
	width: 100%;
	text-align: center;
	@media ${device.mobileL} {
		width: 60%;
	}
`

const LoginTextarea = styled.textarea`
	height: 2rem;
	resize: none;
	width: 100%;
	margin-bottom: 20px;
	border-radius: 4px;
`

const LoginButton = styled(Button)`
	margin: auto;
	margin-bottom: 100px;
	width: 50%;
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

const LoginPage = ({ dispatch }) => {
	const user = useSelector((state) => state.user)
	const [statusMessage, setStatusMessage] = useState('')
	const [statusType, setStatusType] = useState('')

	const handleSubmit = (event) => {
		event.preventDefault()
		console.log('submit login')
		const username = document.getElementById('usernameField').value
		const pass = document.getElementById('passwordField').value
		loginService.login({ username, password: pass }).then((response) => {
			console.log('login response', response)
			if (response.status === 200) {
				setStatusType('success')
				setStatusMessage('Logged in successfully')
				setTimeout(() => {
					if (Cookies.get('stayLogged') === 'true') {
						Cookies.set('token', response.data.token)
					}
					dispatch(login({ loggedIn: true, token: response.data.token, user: response.data.user }))
				}, 1000)
			} else if (response.status === 401) {
				setStatusType('error')
				setStatusMessage(response.data.error)
			}
		})
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
		Cookies.set('stayLogged', value)
	}

	return (
		<PageContainer>
			<LoginContainer>
				<StatusMessage statusMessage={statusMessage} statusType={statusType} />
				<LoginForm
					onSubmit={handleSubmit}
				>
					<TextSpan>Username or email</TextSpan>
					<br />
					<LoginTextarea id="usernameField" />
					<br />
					<TextSpan>Password</TextSpan>
					<br />
					<LoginTextarea id="passwordField" />
					<br />
					<Toggle scale={0.75} text="Keep me logged in" checked={Cookies.get('stayLogged') === 'true'} onChange={keepLoggedInChanged} />
					<LoginButton type="submit">Log in</LoginButton>
				</LoginForm>
			</LoginContainer>
		</PageContainer>
	)
}

export default connect(null, null)(LoginPage)
