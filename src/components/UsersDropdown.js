import React, { useState, useEffect } from 'react'
import { connect, useSelector } from 'react-redux'
import styled from 'styled-components'
import md5 from 'md5'
import Cookies from 'js-cookie'
import Dropdown from './Dropdown'
import Button from './Button'
import userService from '../services/users'

const UsersButton = styled(Button)`
	flex: 0 0 20%;
	max-width: 20%;
	@media ${(props) => props.theme.device.mobileL} {	
		flex: 0 0 15%;
		max-width: 15%;
	}
	@media ${(props) => props.theme.device.laptop} { 
		flex: 0 0 10%;
		max-width: 10%;
	}
	margin-left: 5px;
`

const UsersUserButton = styled(Button)`
	padding-top: 0px;
	background-color: transparent;
	width: 45px;
	height: 45px;
	margin: 5.5px;

	&:hover{
		background-color: transparent;
	}
`

const UsersContainer = styled.div`
	display: -ms-flexbox;
	display: flex;
	-ms-flex-wrap: wrap;
	flex-wrap: wrap;
`

const Avatar = styled.img`
	border-radius: 50%;
	border: 2px solid white;
`
const UserTextarea = styled.textarea`
	height: 2rem;
	resize: none;
	width: 100%;
	margin-bottom: 20px;
	border-radius: 4px;
`

const InviteButton = styled(Button)`
	margin-bottom: 0px;
`

const UsersDropdown = () => {
	const currentUser = useSelector((state) => state.user.user)
	const board = useSelector((state) => state.board.board)
	const [showUsersMenu, setShowUsersMenu] = useState(false)
	const [users, setUsers] = useState([])
	const [inviteInput, setInviteInput] = useState('')

	const GetUserEmailHash = (user) => {
		if (user.gravatarEmail) {
			return (md5(user.gravatarEmail))
		}
		if (user.email) {
			return (md5(user.email))
		}
	}

	useEffect(() => {
		if (board && board.users) {
			const userArray = []
			userArray.push(currentUser)
			board.users.map((user) => {
				if (user !== currentUser.id) {
					userService.getOne(user)
						.then((response) => {
							console.log('user response', response)
							userArray.push(response.data)
						})
				}
			})
			setUsers(userArray)
		}
	}, [board])

	const handleIviteTextChange = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault()
		}
		setInviteInput(event.target.value)
	}

	return (
		<div className="col">
			<UsersButton id="usersMenuButton" onClick={() => { setShowUsersMenu(!showUsersMenu) }}>Users</UsersButton>
			<Dropdown bgColor="rgb(228, 225, 225)" show={showUsersMenu || false} setShowMenu={setShowUsersMenu} parentId="usersMenuButton" width={300} position={{ top: '-5px', left: '5px' }} relativePos={true}>
				{board && board.users
					&& (
						<>
							<UsersContainer>
								{users.map((user) => (
									<UsersUserButton key={user.id} onClick={() => { setShowProfileMenu(!showProfileMenu) }}><Avatar src={`https://www.gravatar.com/avatar/${GetUserEmailHash(user)}?s=100`} /></UsersUserButton>
								))}
							</UsersContainer>
							<h6>Invite to board</h6>
							<UserTextarea placeholder="Enter email or username" value={inviteInput} onChange={handleIviteTextChange} />
							<InviteButton>Invite</InviteButton>
						</>
					)}
			</Dropdown>
		</div>
	)
}

export default UsersDropdown
