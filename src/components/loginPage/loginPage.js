import React, { useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { login } from '../../redux/actions/index'
import loginService from '../../services/login'
import Button from '../Button'

const PageContainer = styled.div`
	display: flex;
	align-content: center;
	height: 100vh;
`

const LoginContainer = styled.div`
	margin: 50px auto auto auto;
	width: 50%;
	text-align: center;
`

const LoginTextarea = styled.textarea`
	height: 2rem;
	resize: none;
	width: 40%;
	margin-bottom: 20px;
`

const LoginButton = styled(Button)`
	margin: auto;
	width: 40%;
`

const TextSpan = styled.span`
	text-align: left;
`

const LoginPage = ({ dispatch }) => {
	const handleSubmit = (event) => {
		event.preventDefault()
		console.log('submit login')
		const user = document.getElementById('usernameField').value
		const pass = document.getElementById('passwordField').value
		loginService.login({ username: user, password: pass }).then((response) => {
			console.log('login response', response)
			dispatch(login({ loggedIn: true, token: response.token }))
		})
	}

	return (
		<PageContainer>
			<LoginContainer>
				<form onSubmit={handleSubmit}>
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
		</PageContainer >
	)
}

export default connect(null, null)(LoginPage)
