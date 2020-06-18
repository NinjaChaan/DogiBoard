import React, { useState, useEffect } from 'react'
import md5 from 'md5'
import styled, { keyframes } from 'styled-components'
import { connect, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Button from '../Button'
import { updateUser } from '../../redux/actions/index'
import userService from '../../services/users'
import StatusMessage from '../StatusMessage'
import UserAvatar from '../UserAvatar'

const ProfileTextarea = styled.input`
	height: 2rem;
	resize: none;
	width: 100%;
	margin-bottom: 20px;
	border-radius: 4px;
	padding-left: 5px;
`

const TextSpan = styled.span`
	text-align: left;
	display: block;
	font-weight: 600;
	user-select: none;
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

const AvatarContainer = ({ user, gravatarEmail }) => {
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

	return (
		<AvatarContainerDiv>
			<Title>Avatar</Title>
			<UserAvatar user={user} size="200" noBorder />
			<TextSpan>
				Gravatar email
				<GravatarLink href="https://en.gravatar.com/" target="_blank" rel="noopener noreferrer">What is Gravatar?</GravatarLink>
			</TextSpan>
			<ProfileTextarea type="email" id="gravatarField" value={gravatarEmail} onChange={(e) => setGravatarEmail(e.target.value)} />
			<SaveButton onClick={handleGravatarSubmit}>Save changes</SaveButton>
		</AvatarContainerDiv>
	)
}

export default AvatarContainer
