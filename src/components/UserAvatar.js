import React, {
	useEffect, useState, useRef, useMemo
} from 'react'
import { connect, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import md5 from 'md5'
import _ from 'underscore'
import styled, { css } from 'styled-components'
import { updateUser } from '../redux/actions/index'
import userService from '../services/users'
import getBrightness from '../utils/getColorBrightness'

const AvatarStyle = styled.img`
	user-select: none;
	border-radius: 50%;
	background-color: white;
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
	${(props) => props.noMargin || css`
		margin: 0 auto;
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
	user, title = true, noBorder, noBorderRadius, noMargin = false, size = '50', quality = 2, dispatch
}) => {
	const currentUser = useSelector((state) => state.user.user)
	const [gravatar, setGravatar] = useState('0')
	const [rgb, setRgb] = useState({
		r: Math.floor(Math.random() * 256),
		g: Math.floor(Math.random() * 256),
		b: Math.floor(Math.random() * 256)
	})
	const [keepUpdated, setKeepUpdated] = useState(true)
	const [initials, setInitials] = useState('')
	const [gravatarFailed, setGravatarFailed] = useState(false)
	const [prevType, setPrevType] = useState('')
	const [prevUser, setPrevUser] = useState('')
	const [loadedUser, setLoadedUser] = useState(null)

	const updateAvatarSettings = (type) => {
		if (loadedUser.id !== currentUser.id) {
			return
		}
		if (loadedUser.avatar && loadedUser.avatar.avatarType === type) {
			return
		}
		const updatedUser = {
			avatar: {
				avatarType: type
			}
		}

		const upUser = {
			...loadedUser,
			avatar: {
				avatarType: type,
				color: loadedUser.avatar.color,
				gravatarEmail: loadedUser.avatar.gravatarEmail,
				initials: initials !== '' ? initials : loadedUser.avatar.initials
			}
		}

		userService.updateAvatar(loadedUser.id, updatedUser).then((res) => {
			if (res.status === 200) {
				dispatch(updateUser(upUser))
			} else if (res.status === 400 || res.status === 401 || res.status === 404) {
				console.log(res.data.error)
			} else {
				console.log(res.data)
			}
		})
	}

	const tryLoadingGravatar = () => {
		if (((loadedUser.avatar && loadedUser.avatar.gravatarEmail) || loadedUser.email) && ((loadedUser.avatar.avatarType !== prevType || loadedUser.id !== prevUser.id) || loadedUser.avatar.settingsChanged)) {
			setPrevType(loadedUser.avatar.avatarType)
			userService.getGravatar(md5(loadedUser.avatar.gravatarEmail || loadedUser.email), size * quality, loadedUser.avatar && loadedUser.avatar.avatarType)
				.then((response) => {
					if (response.status) {
						const manual = window.location.pathname.includes('/profile/') ? false : null
						if (response.status === 200 || response.status === 418) {
							const fileReaderInstance = new FileReader()
							fileReaderInstance.readAsDataURL(response.data)
							fileReaderInstance.onload = () => {
								const base64data = fileReaderInstance.result
								setGravatar(base64data)

								if (response.status === 200 && loadedUser.id === currentUser.id) {
									const upUser = {
										...loadedUser,
										avatar: {
											avatarType: loadedUser.avatar.avatarType,
											color: loadedUser.avatar.color,
											gravatarEmail: loadedUser.avatar.gravatarEmail,
											initials: initials !== '' ? initials : loadedUser.avatar.initials
										}
									}
									dispatch(updateUser(upUser))
								}
							}
							if (response.status === 418 && loadedUser.id === currentUser.id) {
								const upUser = {
									...loadedUser,
									avatar: {
										avatarType: loadedUser.avatar.avatarType,
										color: loadedUser.avatar.color,
										gravatarEmail: loadedUser.avatar.gravatarEmail,
										initials: initials !== '' ? initials : loadedUser.avatar.initials,
										gravatarFailed: true
									}
								}
								dispatch(updateUser(upUser))
							}
						} else if (response.status === 404) {
							setGravatar('404')
							setGravatarFailed(true)
							if (loadedUser.id === currentUser.id) {
								const upUser = {
									...loadedUser,
									avatar: {
										avatarType: type,
										color: loadedUser.avatar.color,
										gravatarEmail: loadedUser.avatar.gravatarEmail,
										initials: initials !== '' ? initials : loadedUser.avatar.initials,
										gravatarFailed: true,
										manual
									}
								}
								dispatch(updateUser(upUser))
							}
							// updateAvatarSettings('initials')
						}
					} else if (response.cached) {
						setGravatar(response.data)
					} else {
						console.log('complete failure!')
					}
				})
		}
	}

	useEffect(() => {
		console.log('user effect', user)
		console.log('user effect loaded', loadedUser)
		console.log('equal?', loadedUser && loadedUser.id === user.id)
		if (user) {
			if (!(loadedUser && loadedUser.id === user.id)) {
				if (!user.id) {
					userService.getOne(user).then((response) => {
						setLoadedUser(response.data)
					})
				} else {
					setLoadedUser(user)
				}
			}
		}
	}, [user])

	useEffect(() => {
		console.log('avatar effect')
		if (keepUpdated && !_.isEqual(prevUser, loadedUser)) {
			if (loadedUser) {
				setPrevUser(loadedUser)
				if (loadedUser.avatar) {
					if (loadedUser.avatar.manual !== false) {
						if (loadedUser.avatar.initials) {
							setInitials(loadedUser.avatar.initials)
						} else {
							setInitials(loadedUser.username[0])
						}
						if (loadedUser.avatar.avatarType === 'gravatar') {
							tryLoadingGravatar()
						} else if (loadedUser.avatar.avatarType === 'initials') {
							setGravatar('initials')
							if (loadedUser.avatar.color) {
								setRgb(loadedUser.avatar.color)
							} else {
								console.log('no avatartype?', loadedUser.avatar)
								setRgb({
									r: Math.floor(Math.random() * 256),
									g: Math.floor(Math.random() * 256),
									b: Math.floor(Math.random() * 256)
								})
							}
						} else {
							tryLoadingGravatar()
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
			// setKeepUpdated(update)
		}
	}, [loadedUser, size])
	console.log('render avatar')
	return (
		<>
			{gravatar !== 'initials' && gravatar !== '0'
				&& (
					<AvatarStyle size={size} src={gravatar} title={title ? (loadedUser && loadedUser.username) : null} alt={`User ${(loadedUser && loadedUser.username) || 'Default'}'s avatar`} noBorder={noBorder} round={!noBorderRadius} />
				)}
			{gravatar === 'initials' && loadedUser.username && rgb && (
				<TextAvatar noMargin={noMargin} rgb={rgb} brightness={getBrightness(rgb)} size={size} title={title ? (loadedUser && loadedUser.username) : null} alt={`User ${(loadedUser && loadedUser.username) || 'Default'}'s avatar`} noBorder={noBorder} round={!noBorderRadius} initials={initials} />
			)}
		</>
	)
}

export default connect(null, null)(React.memo(UserAvatar))
