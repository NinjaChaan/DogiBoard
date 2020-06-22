/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'
import Dropdown from './Dropdown'
import Button from './Button'
import boardService from '../services/boards'
import userService from '../services/users'
import AvatarStyle from './UserAvatar'
import ac from '../utils/accessControl'
import getRole from '../utils/getUserRole'
import boardIncludesUser from '../utils/boardIncludesUser'

const UsersButton = styled(Button)`
`

const UsersButtonContainer = styled.div`
	flex: 0 0 30%;
	max-width: 30%;
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
	display: contents;
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
	overflow-y: auto;
	max-height: 90px;
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
		${(props) => !props.userOnBoard && css`
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
	
	${(props) => (props.userOnBoard) && css`
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
	${(props) => !props.userOnBoard && css`
		display: flex;
		align-items: center;`
	}
`

const UserInfoCardContainer = styled.div`
	min-width: 280px;
	display: flex;
	flex-wrap: wrap;
`

const UserInfoUsername = styled(UserName)`
	/* margin: 0 0 0 20px; */
	font-size: larger;
`

const EditProfileLink = styled.span`
	color: rgb(100, 100, 100) !important;
`

const UsersDropdownStyle = styled(Dropdown)`
	margin: 0 auto;
	@media ${(props) => props.theme.device.mobileL} {	
		margin: none;
	}
`

const UsersDropdown = () => {
	const currentUser = useSelector((state) => state.user.user)
	const board = useSelector((state) => state.board.board)
	const [showUsersMenu, setShowUsersMenu] = useState(false)
	const [showUserInfoMenu, setShowUserInfoMenu] = useState(false)
	const [clickedUser, setClickedUser] = useState()
	const [userInfoId, setUserInfoId] = useState('')
	const [userInfoPos, setUserInfoPos] = useState({})
	const [users, setUsers] = useState([])
	const [inviteInput, setInviteInput] = useState('')
	const [matchedUsers, setMatchedUsers] = useState([])
	const [selectedUsers, setSelectedUsers] = useState([])
	const [bigAvatar, setBigAvatar] = useState(false)

	useEffect(() => {
		if (board && board.users) {
			const userArray = []
			userArray.push(currentUser)
			const promises = board.users.map((user) => {
				if (user.id !== currentUser.id) {
					return userService.getOne(user.id)
				}
			}).filter((x) => x !== undefined)
			Promise.all(promises).then((responses) => {
				responses.map((response) => {
					if (response && response.data) {
						userArray.push(response.data)
					}
				})
				setUsers(userArray)
				console.log('users', userArray)
			})
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

	const selectUser = (user, userOnBoard) => {
		if (!userOnBoard) {
			if (selectedUsers.indexOf(user) > -1) {
				setSelectedUsers(selectedUsers.filter((u) => (u !== user)))
			} else {
				setSelectedUsers(selectedUsers.concat(user))
			}
		}
	}

	const inviteButtonPressed = () => {
		for (let i = 0; i < selectedUsers.length; i++) {
			const userId = selectedUsers[i].id
			boardService.inviteUser(board.id, { userId })
				.then((response) => {
					console.log('invite response', response)
				})
		}
		setSelectedUsers([])
	}

	const openUserInfoMenu = (user) => {
		const index = users.indexOf(user)
		if (user !== clickedUser) {
			setClickedUser(user)
		} else {
			setClickedUser(null)
		}
		setUserInfoId(`userButton-${user.id}`)
		const rect = document.getElementById(`userButton-${user.id}`).getBoundingClientRect()
		if (window.matchMedia('(min-width: 425px)').matches) {
			setUserInfoPos({ top: `${rect.top + 55}px`, left: `${index * 50 + 10}px` })
		} else {
			setUserInfoPos({ top: `${rect.top + 55}px`, left: '0' })
		}
		setShowUserInfoMenu(user !== clickedUser)
	}

	return (
		<div style={{ userSelect: 'none', display: 'flex', maxHeight: '45px' }} className="col">
			<UsersButtonContainer>
				<UsersButton id="usersMenuButton" onClick={() => { setShowUsersMenu(!showUsersMenu) }}>Users</UsersButton>
			</UsersButtonContainer>
			{users && users.length > 0 && (
				<UsersDropdownStyle bgColor="rgb(228, 225, 225)" show={showUsersMenu || false} setShowMenu={setShowUsersMenu} parentId="usersMenuButton" width={users.length > 12 ? 320 : 300} position={{ top: '43px', left: '-125px' }} relativePos noTopBorder>
					{board && board.users
						&& (
							<>
								<UsersContainer id="usersContainer">
									{users.map((user) => (
										<div key={user.id} style={{ margin: '3px' }}>
											<UsersUserButton link_transparent id={`userButton-${user.id}`} key={user.id} onClick={() => { openUserInfoMenu(user) }}><AvatarStyle user={user} size="40" noBorder /></UsersUserButton>
										</div>
									))}
									<Dropdown bgColor="rgb(255, 255, 255)" show={showUserInfoMenu || false} setShowMenu={setShowUserInfoMenu} parentId={userInfoId} width={300} position={userInfoPos}>
										{clickedUser && (
											<UserInfoCardContainer>
												<UsersUserButton link_transparent onClick={() => setBigAvatar(!bigAvatar)}><AvatarStyle update noBorderRadius={bigAvatar} user={clickedUser} size={bigAvatar ? '150' : '50'} /></UsersUserButton>
												<div className="col">
													<UserInfoUsername>{(clickedUser && clickedUser.username) || 'Default username'}</UserInfoUsername>
													{clickedUser && clickedUser.id === currentUser.id && (
														<Link to={`/profile/${clickedUser.id}`}>
															<EditProfileLink onClick={() => setShowUserInfoMenu(false)}> Edit profile </EditProfileLink>
														</Link>
														//ac.can(getRole(board.users, clickedUser.id)).updateOwn('profile').granted
													)}
												</div>
											</UserInfoCardContainer>
										)}
									</Dropdown>
								</UsersContainer>
								<h6>Invite to board</h6>
								<UserTextarea spellCheck={false} placeholder="Enter email or username" value={inviteInput} onChange={handleIviteTextChange} />
								{
									matchedUsers.length > 0
									&& (

										<div>
											{matchedUsers.map((user) => {
												const userOnBoard = boardIncludesUser(board, user.id)
												return (
													<MatchedUsersContainer className="col" selected={selectedUsers.indexOf(user) > -1} userOnBoard={userOnBoard} key={user.id} onMouseDown={() => selectUser(user, userOnBoard)}>
														<UsersUserButton link_transparent><AvatarStyle user={user} title={false} /></UsersUserButton>
														<UserInfoContainer userOnBoard={userOnBoard} className="col">
															<UserName userOnBoard={userOnBoard}>{user.username}</UserName>
															{userOnBoard && <UserInfo>(Already on board)</UserInfo>}
														</UserInfoContainer>
													</MatchedUsersContainer>
												)
											})}
										</div>
									)
								}
								<InviteButton onClick={inviteButtonPressed} disabled={selectedUsers.length < 1}> Invite</InviteButton>
							</>
						)}
				</UsersDropdownStyle>
			)}
		</div>
	)
}

export default UsersDropdown
