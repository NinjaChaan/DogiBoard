import React, { useState, useEffect } from 'react'
import md5 from 'md5'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { connect, useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import Button from './Button'
import { setBoard, logout } from '../redux/actions/index'

const TopBarContainer = styled.div`
	height: 45px;
	background-color: #1d6cba;
	padding: 5px;
	display:flex;
	flex-wrap: wrap;
`

const TopButton = styled(Button)`
`

const BoardsButton = styled(TopButton)`
`
const LogoutButton = styled(TopButton)`
	padding-top: 0px;
	background-color: transparent;
	width: 40px;
	height: 40px;
	float: right;
	&:hover{
		background-color: transparent;
	}
`

const LinkStyle = styled(Link)`
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

const LogoutStyle = styled(LinkStyle)`
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

const Avatar = styled.img`
	border-radius: 50%;
	border: 2px solid white;
`

const TopBar = ({ dispatch }) => {
	const user = useSelector((state) => state.user)
	const [emailHash, setEmailHash] = useState('')
	const BoardsButtonPressed = () => {
		dispatch(setBoard({ board: null }))
	}

	const LogoutButtonPressed = () => {
		if (user.loggedIn) {
			dispatch(logout())
			Cookies.remove('token')
		}
	}

	useEffect(() => {
		if (user.user.email) {
			setEmailHash(md5(user.user.email))
		}
	}, [user])

	return (
		<TopBarContainer className="flex-row">
			<LinkStyle to="/boards">
				<BoardsButton type="button" onClick={BoardsButtonPressed}>Boards</BoardsButton>
			</LinkStyle>
			{useLocation().pathname !== '/login' && emailHash
				&& (
					<LogoutStyle className="float-right" to="/login">
						<LogoutButton onClick={LogoutButtonPressed}><Avatar src={`https://www.gravatar.com/avatar/${emailHash}?s=100`} /></LogoutButton>
					</LogoutStyle>
				)}
		</TopBarContainer>
	)
}

export default connect(null, null)(TopBar)
