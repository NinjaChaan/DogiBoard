import React, { useState, useEffect } from 'react'
import md5 from 'md5'
import styled, { keyframes } from 'styled-components'
import { connect, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Button from './Button'
import { updateUser } from '../redux/actions/index'
import userService from '../services/users'
import StatusMessage from './StatusMessage'
import UserAvatar from './UserAvatar'

const ProfileContainer = styled.div`
	padding-right: 15px;
	padding-left: 15px;
	display: flex;
	width: 100%;
	text-align: center;

	-ms-flex-preferred-size: 0;
	flex-basis: 0;
	-ms-flex-positive: 1;
	flex-grow: 1;
	min-width: 0;
	max-width: 100%;
	flex-direction: column;

	@media ${(props) => props.theme.device.mobileL} {	
		flex-direction: row;
		width: 100%;
	}
`

const ProfileTextarea = styled.input`
	height: 2rem;
	resize: none;
	width: 100%;
	margin-bottom: 20px;
	border-radius: 4px;
	padding-left: 5px;
`

const SaveButton = styled(Button)`
	width: 50%;
	@media ${(props) => props.theme.device.mobileL} {	
		width: 40%;
	}
	@media ${(props) => props.theme.device.laptop} { 
		width: 40%;
		margin: 0 0 100px 0;
	}
`

const TextSpan = styled.span`
	text-align: left;
	display: block;
	font-weight: 600;
`
const AccountDetailsForm = styled.form`
	flex: 0 0 100%;
	max-width: 100%;
	@media ${(props) => props.theme.device.mobileL} {	
		flex: 0 0 50%;
		max-width: 50%;
	}
	@media ${(props) => props.theme.device.laptop} { 
		width: 50%;
	}
`
const AvatarContainer = styled.div`
	flex: 0 0 100%;
	max-width: 100%;
	text-align: center;
	@media ${(props) => props.theme.device.mobileL} {	
		flex: 0 0 40%;
		max-width: 40%;
		margin: 0 auto;
	}
	@media ${(props) => props.theme.device.laptop} { 
		width: 50%;
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
				<UserAvatar user={user} size="200" noBorder />
				<TextSpan>
					Gravatar email
					<a href="https://en.gravatar.com/" target="_blank" rel="noopener noreferrer" style={{ fontSize: 'small', float: 'right', paddingTop: '3px' }}>What is Gravatar?</a>
				</TextSpan>
				<ProfileTextarea id="gravatarField" value={gravatarEmail} onChange={(e) => setGravatarEmail(e.target.value)} />
				<SaveButton onClick={handleGravatarSubmit}>Save changes</SaveButton>
			</AvatarContainer>
		</ProfileContainer>
	)
}

export default connect(null, null)(ProfilePage)
