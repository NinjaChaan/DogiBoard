import React, { useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import md5 from 'md5'
import styled, { css } from 'styled-components'
import { updateUser } from '../redux/actions/index'
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
	margin: 0 auto;

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
	user, title = true, noBorder, noBorderRadius, size = '50', update = false, dispatch
}) => {
	const currentUser = useSelector((state) => state.user.user)
	const [gravatar, setGravatar] = useState('0')
	const [rgb, setRgb] = useState({})
	const [keepUpdated, setKeepUpdated] = useState(true)

	const updateAvatarSettings = (type) => {
		if (user === currentUser) {
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
					avatarType: type
				}
			}

			console.log('user update', upUser)

			userService.updateAvatar(user.id, updatedUser).then((res) => {
				console.log('profile change response', res)
				if (res.status === 200) {
					console.log('Profile changes saved successfully')
					dispatch(updateUser(upUser))
				} else if (res.status === 400 || res.status === 401 || res.status === 404) {
					console.log(res.data.error)
				} else {
					console.log(res.data)
				}
			})
		}
	}

	const tryLoadingGravatar = () => {
		if (user.gravatarEmail || user.email) {
			userService.getGravatar(md5(user.gravatarEmail || user.email), size < 100 ? size * 2 : size * 1.5)
				.then((response) => {
					if (response.status) {
						if (response.status === 200) {
							const fileReaderInstance = new FileReader()
							fileReaderInstance.readAsDataURL(response.data)
							fileReaderInstance.onload = () => {
								const base64data = fileReaderInstance.result
								setGravatar(base64data)
								updateAvatarSettings('gravatar')
							}
						} else if (response.status === 404) {
							setGravatar('initials')
							updateAvatarSettings('initials')
						}
					} else {
						console.log('complete failure!')
					}
				})
		}
	}

	useEffect(() => {
		if (keepUpdated) {
			if (user) {
				if (user.avatar) {
					if (user.avatar.avatarType === 'gravatar') {
						tryLoadingGravatar()
					} else if (user.avatar.avatarType === 'initials') {
						setGravatar('initials')
						if (user.avatar.color) {
							setRgb(user.avatar.color)
						} else {
							setRgb({
								r: Math.floor(Math.random() * 256),
								g: Math.floor(Math.random() * 256),
								b: Math.floor(Math.random() * 256)
							})
						}
					}
				} else {
					console.log('trying avatars failed')
					tryLoadingGravatar()
					if (gravatar === 'initials') {
						setRgb({
							r: Math.floor(Math.random() * 256),
							g: Math.floor(Math.random() * 256),
							b: Math.floor(Math.random() * 256)
						})
					}
				}
			}
			setKeepUpdated(update)
		}
	}, [user, size])

	return (
		<>
			{gravatar !== 'initials' && gravatar !== '0'
				&& (
					<AvatarStyle size={size} src={gravatar} title={title ? (user && user.username) : null} alt={`User ${(user && user.username) || 'Default'}'s avatar`} noBorder={noBorder} round={!noBorderRadius} />
				)}
			{gravatar === 'initials' && user.username && rgb && (
				<TextAvatar rgb={rgb} brightness={getBrightness(rgb)} size={size} title={title ? (user && user.username) : null} alt={`User ${(user && user.username) || 'Default'}'s avatar`} noBorder={noBorder} round={!noBorderRadius} initials={`${user.username[0]}`} />
			)}
		</>
	)
}

export default connect(null, null)(UserAvatar)
