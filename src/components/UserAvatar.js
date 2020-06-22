import React, { useEffect, useState } from 'react'
import md5 from 'md5'
import styled, { css } from 'styled-components'
import userService from '../services/users'
import getBrightness from '../utils/getColorBrightness'

const AvatarStyle = styled.img`
	user-select: none;
	border-radius: 50%;
	${(props) => props.size && css`
		width: ${props.size}px;
		height: ${props.size}px;
	`}
	/* ${(props) => props.noBorder || css`
		border: 2px solid white;
	`} */
	${(props) => props.noBorderRadius && css`
		border-radius: 0;
	`}		
`

const TextAvatar = styled.div`
	user-select: none;
	border-radius: 100%;
	vertical-align: middle;
	display: flex;

	color: ${(props) => (props.brightness ? '#0e0e0e' : '#f1f1f1')};
	background-color: ${(props) => `rgb(${props.rgb.r}, ${props.rgb.g}, ${props.rgb.b})`};

	${(props) => props.size && css`
		width: ${props.size}px;
		height: ${props.size}px;
		font-size: calc(${props.size}px * 0.4);
	`}
	/* ${(props) => props.noBorder || css`
		border: 2px solid white;
	`} */
	${(props) => props.noBorderRadius && css`
		border-radius: 0px;
	`}

	&::before {
		display: flex;	
	}

	${(props) => props.initials && css`
		&::after {
			display: flex;
			margin: auto;
			content: "${props.initials}";
		}
	`}
`

const UserAvatar = ({
	user, title = true, noBorder, noBorderRadius, size = '50'
}) => {
	const [gravatar, setGravatar] = useState('0')
	const [rgb, setRgb] = useState({})

	useEffect(() => {
		if (user) {
			if (user.email) {
				userService.getGravatar(md5(user.gravatarEmail || user.email), size * 1.5)
					.then((response) => {
						if (response.status === 200) {
							const fileReaderInstance = new FileReader()
							fileReaderInstance.readAsDataURL(response.data)
							fileReaderInstance.onload = () => {
								const base64data = fileReaderInstance.result
								setGravatar(base64data)
							}
						} else if (response.status === 404) {
							setGravatar('404')
						}
					})
			}
			if (user.color) {
				setRgb(user.color)
			} else {
				setRgb({
					r: Math.floor(Math.random() * 256),
					g: Math.floor(Math.random() * 256),
					b: Math.floor(Math.random() * 256)
				})
			}
		}
	}, [user])
	const GetUserEmailHash = () => {
		if (user) {
			if (user.gravatarEmail) {
				return (md5(user.gravatarEmail))
			}
			if (user.email) {
				return (md5(user.email))
			}
		} else {
			return null
		}
	}

	console.log('brigt', getBrightness(rgb))

	return (
		<>
			{console.log(size)}
			{gravatar !== '404' && gravatar !== '0'
				&& (
					<AvatarStyle size={size} src={gravatar} title={title ? (user && user.username) : null} alt={`User ${(user && user.username) || 'Default'}'s avatar`} noBorder={noBorder} round={!noBorderRadius} />
				)}
			{gravatar === '404' && user.username && rgb && (
				<TextAvatar rgb={rgb} brightness={getBrightness(rgb)} size={size} title={title ? (user && user.username) : null} alt={`User ${(user && user.username) || 'Default'}'s avatar`} noBorder={noBorder} round={!noBorderRadius} initials={`${user.username[0]}`} />
			)}
		</>
	)
}

export default UserAvatar
