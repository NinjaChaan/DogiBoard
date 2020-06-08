import React, { useState, useEffect } from 'react'
import md5 from 'md5'
import styled, { keyframes } from 'styled-components'
import { connect, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Button from './Button'
import { updateUser } from '../redux/actions/index'
import userService from '../services/users'
import StatusMessage from './StatusMessage'

const ProfileContainer = styled.div`
	margin: 10px auto auto 100px;
	display: flex;
	width: 100%;
	text-align: center;
	@media ${(props) => props.theme.device.mobileL} {	
		width: 60%;
	}
`

const ProfileTextarea = styled.textarea`
	height: 2rem;
	resize: none;
	width: 100%;
	margin-bottom: 20px;
	border-radius: 4px;
`

const SaveButton = styled(Button)`
	margin: 0 0 100px 0;
	width: 50%;
	@media ${(props) => props.theme.device.mobileL} {	
		width: 40%;
	}
`

const TextSpan = styled.span`
	text-align: left;
	display: block;
	font-weight: 600;
`
const AccountDetailsForm = styled.form`
	margin: auto auto auto 100px;
	flex: 0 0 70%;
	max-width: 70%;
	@media ${(props) => props.theme.device.mobileL} {	
		width: 70%;
	}
	@media ${(props) => props.theme.device.laptop} { 
		width: 50%;
	}
`
const AvatarContainer = styled.div`
	margin: 10px auto auto 100px;
	flex: 0 0 30%;
	max-width: 30%;
	text-align: center;
	@media ${(props) => props.theme.device.mobileL} {	
		width: 60%;
	}
`

const AvatarImage = styled.img`
	border-radius: 50%;
`

const ProfilePage = ({ dispatch }) => {
	const user = useSelector((state) => state.user.user)
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [gravatarEmail, setGravatarEmail] = useState('')
	const [password, setPassword] = useState('')
	const [currentPassword, setCurrentPassword] = useState('')
	const [statusMessage, setStatusMessage] = useState('')
	const [statusType, setStatusType] = useState('')
	const [emailHash, setEmailHash] = useState('')

	const handleSubmit = (event) => {
		event.preventDefault()
		console.log('submit profile changes')

		if (!currentPassword) {
			setStatusType('error')
			setStatusMessage('Enter current password to save changes')
			return
		}

		const updatedUser = {
			username,
			email,
			password,
			currentPassword
		}

		const upUser = {
			...user,
			username,
			email
		}

		console.log('user update', upUser)

		userService.update(user.id, updatedUser).then((response) => {
			console.log('profile change response', response)
			if (response.status === 200) {
				setStatusType('success')
				setStatusMessage('Profile changes saved successfully')
				dispatch(updateUser(upUser))
			} else if (response.status === 400 || response.status === 401 || response.status === 404) {
				setStatusType('error')
				setStatusMessage(response.data.error)
			} else {
				setStatusType('error')
				if (response.data) {
					setStatusMessage(response.data)
				} else {
					setStatusMessage('Unknown error. Send bug report?')
				}
			}
		})
	}

	const handleGravatarSubmit = () => {
		userService.updateGravatar(user.id, { gravatarEmail }).then((response) => {
			console.log('gravatar change response', response)
			if (response.status === 200) {
				setStatusType('success')
				setStatusMessage('Gravatar email saved successfully')
				const updatedUser = {
					...user,
					gravatarEmail
				}
				dispatch(updateUser(updatedUser))
			} else if (response.status === 400 || response.status === 401 || response.status === 404) {
				setStatusType('error')
				setStatusMessage(response.data.error)
			} else {
				setStatusType('error')
				if (response.data) {
					setStatusMessage(response.data)
				} else {
					setStatusMessage('Unknown error. Send bug report?')
				}
			}
		})
	}

	useEffect(() => {
		if (user) {
			if (user.username) {
				setUsername(user.username)
			}
			if (user.email) {
				setEmail(user.email)
				if (user.gravatarEmail) {
					setGravatarEmail(user.gravatarEmail)
					setEmailHash(md5(user.gravatarEmail))
				} else {
					setGravatarEmail(user.email)
					setEmailHash(md5(user.email))
				}
			}
		}
	}, [user])

	return (
		<ProfileContainer>
			<AccountDetailsForm onSubmit={handleSubmit}>
				<StatusMessage statusMessage={statusMessage} statusType={statusType} />
				<TextSpan>Username</TextSpan>
				<ProfileTextarea id="usernameField" value={username} onChange={(e) => setUsername(e.target.value)} />
				<br />
				<TextSpan>Email</TextSpan>
				<ProfileTextarea id="emailField" value={email} onChange={(e) => setEmail(e.target.value)} />
				<br />
				<TextSpan>New password</TextSpan>
				<ProfileTextarea id="passwordField" value={password} onChange={(e) => setPassword(e.target.value)} />
				<br />
				<TextSpan>Current password</TextSpan>
				<ProfileTextarea id="oldPasswordField" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
				<br />
				<SaveButton type="submit">Save changes</SaveButton>
			</AccountDetailsForm>
			<AvatarContainer>
				<h1>Avatar</h1>
				<AvatarImage src={`https://www.gravatar.com/avatar/${emailHash}?s=200`} alt="User avatar" />
				<TextSpan>Gravatar email</TextSpan>
				<ProfileTextarea id="gravatarField" value={gravatarEmail} onChange={(e) => setGravatarEmail(e.target.value)} />
				<SaveButton onClick={handleGravatarSubmit}>Save changes</SaveButton>
			</AvatarContainer>
		</ProfileContainer>
	)
}

export default connect(null, null)(ProfilePage)
