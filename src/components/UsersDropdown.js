import React, { useState, useEffect } from 'react'
import { connect, useSelector } from 'react-redux'
import styled, { css } from 'styled-components'
import Cookies from 'js-cookie'
import Dropdown from './Dropdown'
import Button from './Button'
import userService from '../services/users'
import UserAvatar from './UserAvatar'

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
	margin: 5.5px 5.5px 0px 5.5px;
	margin-left: 0px;

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
const UserTextarea = styled.input`
	height: 2rem;
	resize: none;
	width: 100%;
	margin-bottom: 20px;
	border-radius: 4px;
	outline: 0px none transparent;
	padding-left: 5px;
`

const InviteButton = styled(Button)`
	margin-bottom: 0px;
`

const MatchedUsersContainer = styled.div`
	display: -ms-flexbox;
	display: -webkit-box;
	display: -webkit-flex;
	display: -ms-flexbox;
	display: flex;
	-ms-flex-wrap: wrap;
	-webkit-flex-wrap: wrap;
	-ms-flex-wrap: wrap;
	flex-wrap: wrap;
	margin-bottom: 5px;
	cursor: default;
	border: 2px solid transparent;
	max-width: 280px;
	padding: 0px;

	${(props) => props.selected && css`
		border: 2px solid #557dff;
		border-radius: 4px;`
	}	

	&:hover{
		${(props) => !props.onBoard && css`
			cursor: pointer;
			background-color: rgba(0, 0, 0, 0.07);`
	}		
	}
`

const UserName = styled.span`
	/* margin: auto auto auto 10px; */
	font-weight: 600;
	/* display: -ms-flexbox;
	display: flex;
	-ms-flex-wrap: wrap;
	flex-wrap: wrap; */
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	display: block;
	
	${(props) => (props.onBoard) && css`
		margin-bottom: -5px;
		margin-top: 5px;`
	}
`

const UserInfo = styled.span`
	font-size: smaller;
`

const UserInfoContainer = styled.div`
	flex: 0 0 80%;
	max-width: 80%;
	display: inline;
	${(props) => !props.onBoard && css`
		display: flex;
		align-items: center;`
	}
`

const UsersDropdown = () => {
	const currentUser = useSelector((state) => state.user.user)
	const board = useSelector((state) => state.board.board)
	const [showUsersMenu, setShowUsersMenu] = useState(false)
	const [users, setUsers] = useState([])
	const [inviteInput, setInviteInput] = useState('')
	const [matchedUsers, setMatchedUsers] = useState([])
	const [selectedUsers, setSelectedUsers] = useState([])

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
		if (!event.target.value.includes('/')) {
			userService.getClosestMatches(event.target.value)
				.then((response) => {
					if (response.data.length > 0) {
						const selected = []
						selected.push(...selectedUsers)
						setMatchedUsers([...selectedUsers, ...response.data.filter((u) => selected.every((us) => us.id !== u.id))])
					} else {
						setMatchedUsers([...selectedUsers])
					}
				})
		}
	}

	const selectUser = (user, onBoard) => {
		if (!onBoard) {
			if (selectedUsers.indexOf(user) > -1) {
				setSelectedUsers(selectedUsers.filter((u) => (u !== user)))
			} else {
				setSelectedUsers(selectedUsers.concat(user))
			}
		}
	}

	return (
		<div style={{ userSelect: 'none' }} className="col">
			<UsersButton id="usersMenuButton" onClick={() => { setShowUsersMenu(!showUsersMenu) }}>Users</UsersButton>
			<Dropdown bgColor="rgb(228, 225, 225)" show={showUsersMenu || false} setShowMenu={setShowUsersMenu} parentId="usersMenuButton" width={300} position={{ top: '-2.5px', left: '5px' }} relativePos noTopBorder>
				{board && board.users
					&& (
						<>
							<UsersContainer>
								{users.map((user) => (
									<UsersUserButton key={user.id} onClick={() => { setShowProfileMenu(!showProfileMenu) }}><UserAvatar user={user} /></UsersUserButton>
								))}
							</UsersContainer>
							<h6>Invite to board</h6>
							<UserTextarea spellCheck={false} placeholder="Enter email or username" value={inviteInput} onChange={handleIviteTextChange} />
							{matchedUsers.length > 0
								&& (

									<div>
										{matchedUsers.map((user) => {
											const onBoard = board.users.includes(user.id)
											return (
												<MatchedUsersContainer className="col" selected={selectedUsers.indexOf(user) > -1} onBoard={onBoard} key={user.id}>
													<UsersUserButton onClick={() => { setShowProfileMenu(!showProfileMenu) }}><UserAvatar user={user} title={false} /></UsersUserButton>
													<UserInfoContainer onBoard={onBoard} className="col" onMouseDown={() => selectUser(user, onBoard)}>
														<UserName onBoard={onBoard}>{user.username}</UserName>
														{onBoard && <UserInfo>(Already on board)</UserInfo>}
													</UserInfoContainer>
												</MatchedUsersContainer>
											)
										})}
									</div>
								)}
							<InviteButton disabled={selectedUsers.length < 1}>Invite</InviteButton>
						</>
					)}
			</Dropdown>
		</div>
	)
}

export default UsersDropdown
