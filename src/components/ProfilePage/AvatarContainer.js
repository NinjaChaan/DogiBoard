import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { connect, useSelector } from 'react-redux'
import { HuePicker } from 'react-color'
import Button from '../Button'
import { updateUser } from '../../redux/actions/index'
import userService from '../../services/users'
import UserAvatar from '../UserAvatar'
import RadioButton from '../RadioButton'

const ProfileTextarea = styled.input`
	height: 2rem;
	resize: none;
	width: 100%;
	margin-bottom: 20px;
	border-radius: 4px;
	padding-left: 5px;

	${(props) => props.noBottomMargin && css`
		margin-bottom: 0px;
	`}
`

const TextSpan = styled.span`
	text-align: left;
	display: block;
	font-weight: 600;
	user-select: none;
`

const AvatarText = styled.span`
	display: inline-block;
	margin: 0 10px 0 5px;
	user-select: none;
`

const AvatarTypeContainer = styled.div`
	text-align: left;
	margin: 10px 0 0 0;
`

const Title = styled.h2`
	user-select: none;
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
const AvatarContainerDiv = styled.div`
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
		padding: 0 50px 0 50px;
	}
`

const GravatarLink = styled.a`
	font-size: small;
	float: right;
	padding-top: '3px';
`

const AvatarInfoText = styled.span`
	display: block;
	font-size: small;
	font-weight: 600;
	text-align: left;
	margin-bottom: 5px;

	${(props) => props.color && css`
		color: ${props.color};
	`}
`

const HueSelector = styled(HuePicker)`
	margin-bottom: 20px;
	width: 100% !important;
`
const RadioContainer = styled.div`
	display: -ms-flexbox;
	display: flex;
	-ms-flex-wrap: wrap;
	flex-wrap: wrap;
`

const AvatarContainer = ({
	user, setStatusMessage, setStatusType, dispatch
}) => {
	const [initials, setInitials] = useState('')
	const [gravatarEmail, setGravatarEmail] = useState('')
	const [avatarType, setAvatarType] = useState('')
	const [avatarColor, setAvatarColor] = useState({ r: 100, g: 100, b: 100 })
	const [sliderColor, setSliderColor] = useState({ r: 100, g: 100, b: 100 })

	const handleAvatarSubmit = () => {
		const updatedUser = {
			avatar: {
				avatarType,
				color: avatarColor,
				gravatarEmail,
				initials
			}
		}

		const upUser = {
			...user,
			avatar: {
				avatarType,
				color: avatarColor,
				gravatarEmail,
				initials,
				settingsChanged: true
			}
		}
		userService.updateAvatar(user.id, updatedUser).then((response) => {
			console.log('avatar change response', response)
			if (response.status === 200) {
				setStatusType('success')
				setStatusMessage('Avatar settings saved successfully')
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

	const handleRadioChange = (type) => {
		setStatusType('')
		setStatusMessage('')
		setAvatarType(type)
		if (user.avatar && user.avatar.avatarType === type) {
			return
		}
		const updatedUser = {
			avatar: {
				avatarType: type
			}
		}

		const upUser = {
			...user,
			avatar: {
				avatarType: type,
				color: user.avatar.color,
				gravatarEmail,
				initials,
				manual: true,
				settingsChanged: true
			}
		}

		userService.updateAvatar(user.id, updatedUser).then((res) => {
			if (res.status === 200) {
				dispatch(updateUser(upUser))
			} else if (res.status === 400 || res.status === 401 || res.status === 404) {
				console.log(res.data.error)
			} else {
				console.log(res.data)
			}
		})
	}

	useEffect(() => {
		if (user) {
			if (user.avatar) {
				if (user.avatar.gravatarEmail) {
					setGravatarEmail(user.avatar.gravatarEmail)
				} else {
					setGravatarEmail(user.email)
				}
				if (user.avatar.avatarType) {
					setAvatarType(user.avatar.avatarType)
				}
				if (user.avatar.initials) {
					setInitials(user.avatar.initials)
				} else {
					setInitials(user.username[0])
				}
				if (user.avatar.gravatarFailed) {
					// setStatusType('error')
					// setStatusMessage('Loading gravatar failed. Do you have a Gravatar account?')
				}
				if (user.avatar.color) {
					setAvatarColor(user.avatar.color)
					setSliderColor(user.avatar.color)
				}
			}
		}
	}, [user])

	const handleColorChange = (color, event) => {
		setAvatarColor(color.rgb)
		setSliderColor(color.rgb)

		const upUser = {
			...user,
			avatar: {
				avatarType,
				color: color.rgb,
				gravatarEmail,
				initials
			}
		}
		dispatch(updateUser(upUser))
	}

	const handleColorSliderChange = (color, event) => {
		setSliderColor(color.rgb)
	}

	return (
		<AvatarContainerDiv>
			<Title>Avatar</Title>
			<UserAvatar user={user} size="150" noBorder />
			<AvatarTypeContainer>
				<TextSpan>Avatar type</TextSpan>
				<RadioContainer>
					<RadioButton id="gravatar" name="avatarType" value="Gravatar" callBack={handleRadioChange} checked={user.avatar.avatarType === 'gravatar'} />
					<RadioButton id="robo" name="avatarType" value="Robot" callBack={handleRadioChange} checked={user.avatar.avatarType === 'robo'} />
					<RadioButton id="initials" name="avatarType" value="Initials" callBack={handleRadioChange} checked={user.avatar.avatarType === 'initials'} />
				</RadioContainer>
			</AvatarTypeContainer>
			{user.avatar && user.avatar.avatarType && (user.avatar.avatarType === 'gravatar' || user.avatar.avatarType === 'robo')
				&& (
					<>
						<TextSpan>
							Gravatar email
							{/* {!user.avatar.gravatarFailed
								&& (<GravatarLink href="https://en.gravatar.com/" target="_blank" rel="noopener noreferrer">What is Gravatar?</GravatarLink>)} */}
						</TextSpan>
						{user.avatar.avatarType === 'gravatar' && user.avatar.gravatarFailed
							&& (
								<AvatarInfoText color="crimson">
									Failed to load Gravatar. Do you have a Gravatar account?
									<GravatarLink href="https://en.gravatar.com/" target="_blank" rel="noopener noreferrer">What is Gravatar?</GravatarLink>
								</AvatarInfoText>
							)}
						{user.avatar.avatarType === 'robo'
							&& (
								<AvatarInfoText>
									Gravatar email is used to generate a robot
									<GravatarLink href="https://en.gravatar.com/" target="_blank" rel="noopener noreferrer">What is Gravatar?</GravatarLink>
								</AvatarInfoText>
							)}
						<ProfileTextarea type="email" id="gravatarField" value={gravatarEmail} onChange={(e) => setGravatarEmail(e.target.value)} />
					</>
				)}
			{user.avatar && user.avatar.avatarType && user.avatar.avatarType === 'initials'
				&& (
					<>
						<TextSpan>
							Initials
						</TextSpan>
						<AvatarInfoText>
							Max 3 letters
						</AvatarInfoText>
						<ProfileTextarea noBottomMargin maxLength={3} id="initialsField" value={initials} onChange={(e) => setInitials(e.target.value)} />
						<TextSpan>
							Color
						</TextSpan>
						{(window.matchMedia('(max-width: 425px)').matches && (
							<HueSelector color={sliderColor} onChange={handleColorSliderChange} onChangeComplete={handleColorChange} />
						)) || (
								<HueSelector color={sliderColor} onChange={handleColorChange} />
							)}
					</>
				)}
			<SaveButton onClick={handleAvatarSubmit}>Save changes</SaveButton>
		</AvatarContainerDiv>
	)
}

export default connect(null, null)(AvatarContainer)
