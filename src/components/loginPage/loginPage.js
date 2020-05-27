/* eslint-disable indent */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-trailing-spaces */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { login } from '../../redux/actions/index'
import loginService from '../../services/login'
import Button from '../Button'
import StatusMessage from '../StatusMessage'

const PageContainer = styled.div`
	display: flex;
	align-content: center;
	height: 100vh;
`

const LoginContainer = styled.div`
	margin: 10px auto auto auto;
	width: 60%;
	text-align: center;
`

const LoginTextarea = styled.textarea`
	height: 2rem;
	resize: none;
	width: 40%;
	margin-bottom: 20px;
	border-radius: 4px;
`

const LoginButton = styled(Button)`
	margin: auto;
	width: 40%;
`

const TextSpan = styled.span`
	text-align: left;
`

const LoginPage = ({ dispatch }) => {
	const [statusMessage, setStatusMessage] = useState('')
	const [statusType, setStatusType] = useState('')
	const handleSubmit = (event) => {
		event.preventDefault()
		console.log('submit login')
		const user = document.getElementById('usernameField').value
		const pass = document.getElementById('passwordField').value
		loginService.login({ username: user, password: pass }).then((response) => {
			console.log('login response', response)
			if (response.status === 200) {
				setStatusType('success')
				setStatusMessage('Logged in successfully')
				setTimeout(() => {
					dispatch(login({ loggedIn: true, token: response.data.token, user: response.data.user }))
				}, 1000)
			} else if (response.status === 401) {
				setStatusType('error')
				setStatusMessage(response.data.error)
			}
		})
	}

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

	return (
		<PageContainer>
			<LoginContainer>
				<StatusMessage statusMessage={statusMessage} statusType={statusType} />
				<form
					onSubmit={handleSubmit}
				>
					<TextSpan>Username or email</TextSpan>
					<br />
					<LoginTextarea id="usernameField" />
					<br />
					<TextSpan>Password</TextSpan>
					<br />
					<LoginTextarea id="passwordField" />
					<LoginButton type="submit">Log in</LoginButton>
				</form>
			</LoginContainer>
		</PageContainer>
	)
}

export default connect(null, null)(LoginPage)
