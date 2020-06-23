import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { connect, useSelector } from 'react-redux'
import Button from '../Button'
import { updateUser } from '../../redux/actions/index'
import userService from '../../services/users'
import StatusMessage from '../StatusMessage'
import AvatarContainer from './AvatarContainer'

const ProfileContainer = styled.div`
	padding-top: 55px;
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
	user-select: none;
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
		padding: 0 50px 0 50px;
	}
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

	useEffect(() => {
		if (user) {
			if (user.username) {
				setUsername(user.username)
			}
			if (user.email) {
				setEmail(user.email)
				if (user.gravatarEmail) {
					setGravatarEmail(user.gravatarEmail)
				} else {
					setGravatarEmail(user.email)
				}
			}
		}
	}, [user])

	return (
		<ProfileContainer>
			<AvatarContainer user={user} setStatusType={setStatusType} setStatusMessage={setStatusMessage} />
			<AccountDetailsForm onSubmit={handleSubmit}>
				<StatusMessage statusMessage={statusMessage} statusType={statusType} />
				<TextSpan>Username</TextSpan>
				<ProfileTextarea id="usernameField" value={username} onChange={(e) => setUsername(e.target.value)} />
				<br />
				<TextSpan>Email</TextSpan>
				<ProfileTextarea type="email" id="emailField" value={email} onChange={(e) => setEmail(e.target.value)} />
				<br />
				<TextSpan>New password</TextSpan>
				<ProfileTextarea type="password" id="passwordField" value={password} onChange={(e) => setPassword(e.target.value)} />
				<br />
				<TextSpan>Current password</TextSpan>
				<ProfileTextarea type="password" id="oldPasswordField" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
				<br />
				<SaveButton type="submit">Save changes</SaveButton>
			</AccountDetailsForm>
		</ProfileContainer>
	)
}

export default connect(null, null)(ProfilePage)
