import React from 'react'
import md5 from 'md5'
import styled, { css } from 'styled-components'

const Avatar = styled.img`
	user-select: none;
	border-radius: 50%;
	${(props) => props.noBorder || css`
		border: 2px solid white;`
	}
	${(props) => props.noBorderRadius && css`
		border-radius: 0;`
	}		
`

const UserAvatar = ({
	user, title = true, noBorder, noBorderRadius, size = '50'
}) => {
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

	return (
		<Avatar src={`https://www.gravatar.com/avatar/${GetUserEmailHash()}?s=${size}`} title={title ? (user && user.username) : null} alt={`User ${(user && user.username) || 'Default'}'s avatar`} noBorder={noBorder} noBorderRadius={noBorderRadius} />
	)
}

export default UserAvatar
