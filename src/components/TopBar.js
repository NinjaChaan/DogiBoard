import React, { useState, useEffect } from 'react'
import md5 from 'md5'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { connect, useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import Button from './Button'
import { setBoard, logout } from '../redux/actions/index'
import Dropdown from './Dropdown'
import UsersDropdown from './UsersDropdown'
import UserAvatar from './UserAvatar'

const TopBarContainer = styled.div`
	position: fixed;
	height: 50px;
	background-color: #1d6cba;
	padding: 7.5px;
	display:flex;
	flex-wrap: wrap;
	width: 100%;
	z-index: 1;
	top: 0;
`

const TopButton = styled(Button)`
`

const BoardsButton = styled(TopButton)`
`

const UserMenuButton = styled(TopButton)`
	padding: 0px;
	background-color: transparent;
	width: 45px;
	height: 45px;
	float: right;
	&:hover{
		background-color: transparent;
	}
`

const LinkStyle = styled(Link)`
	max-height: 40px;
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

const UserMenuContainer = styled.div`
	flex: 0 0 10%;
	max-width: 10%;
	@media ${(props) => props.theme.device.mobileL} {	
		flex: 0 0 5%;
		max-width: 5%;
	}
	@media ${(props) => props.theme.device.laptop} { 
		flex: 0 0 3%;
		max-width: 3%;
	}
	margin-left: auto !important;
	margin-right: 5px;
	margin-top: -5px;
`

const LogoutStyle = styled(Link)`
	flex: 0 0 10%;
	max-width: 10%;
	@media ${(props) => props.theme.device.mobileL} {	
		flex: 0 0 5%;
		max-width: 5%;
	}
	@media ${(props) => props.theme.device.laptop} { 
		flex: 0 0 3%;
		max-width: 3%;
	}
	margin-left: auto !important;
	margin-right: 5px;
`
const ButtonContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: left;
`

const LabelDropdownButton = styled(Button)`
	padding-top: 3px;
	border: 3px solid transparent;

	background-color: ${(props) => props.backgroundColor || Button.backgroundColor};

	&:hover, &:focus, &:active{
		background-color: ${(props) => props.backgroundColor || Button.backgroundColor};
		${(props) => props.backgroundColor && css`filter: brightness(90%);`}
		border: 3px solid transparent;
	}

	&.selected{
		border: 3px solid #fff;
	}
`

const TopBar = ({ dispatch }) => {
	const userState = useSelector((state) => state.user)
	const [emailHash, setEmailHash] = useState('')
	const [showProfileMenu, setShowProfileMenu] = useState(false)
	const [user, setUser] = useState()
	const BoardsButtonPressed = () => {
		dispatch(setBoard({ board: null }))
	}

	const LogoutButtonPressed = () => {
		setShowProfileMenu(false)
		if (userState.loggedIn) {
			console.log('logged out')
			dispatch(logout())
			Cookies.remove('token')
		} else {
			console.log('faled to log out')
		}
	}

	useEffect(() => {
		if (user) {
			if (user.email) {
				if (user.gravatarEmail) {
					setEmailHash(md5(user.gravatarEmail))
				} else {
					setEmailHash(md5(user.email))
				}
			}
		}
	}, [user])

	useEffect(() => {
		if (userState) {
			setUser(userState.user)
		}
	}, [userState])

	return (
		<TopBarContainer>
			<div
				className="flex-row"
				style={{
					width: '100%', position: 'relative', height: '50px', display: 'flex', flexWrap: 'wrap'
				}}
			>
				<LinkStyle to="/boards">
					<BoardsButton type="button" onClick={BoardsButtonPressed}>Boards</BoardsButton>
				</LinkStyle>
				{useLocation().pathname.includes('/board/')
					&& (
						<UsersDropdown />
					)}
				{useLocation().pathname !== '/login' && emailHash
					&& (
						<>
							<UserMenuContainer className="float-right">
								<UserMenuButton link_transparent id="profileMenuButton" onClick={() => { setShowProfileMenu(!showProfileMenu) }}><UserAvatar size="45" user={user} noBorder /></UserMenuButton>
							</UserMenuContainer>
							<Dropdown show={showProfileMenu || false} setShowMenu={setShowProfileMenu} parentId="profileMenuButton" width={200} position={{ top: '50px', right: '0px' }} noTopBorder>
								<Link to={`/profile/${user.id}`}>
									<LabelDropdownButton light onClick={() => setShowProfileMenu(false)}>
										<ButtonContainer>
											Profile
										</ButtonContainer>
									</LabelDropdownButton>
								</Link>
								<Link to="/login">
									<LabelDropdownButton light onClick={LogoutButtonPressed}>
										<ButtonContainer>
											Log out
										</ButtonContainer>
									</LabelDropdownButton>
								</Link>
							</Dropdown>
						</>
					)}
			</div>
		</TopBarContainer>
	)
}

export default connect(null, null)(TopBar)
