import React from 'react'
import { Link, BrowserRouter as Router, Switch } from 'react-router-dom'
import styled from 'styled-components'
import { connect } from 'react-redux'
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
	/* position: absolute;
	top: 0;
	right: 0;  */
	float: right;
`

const LinkStyle = styled(Link)`
	flex: 0 0 10%;
	max-width: 10%;
	padding-left: 10px;
`

const LogoutStyle = styled(LinkStyle)`
	/* position: absolute; */
	/* top: 0; */
	/* right: 10px; */
	margin-left: auto !important;
	margin-right: 1.5rem !important;
`

const TopBar = ({ dispatch }) => {
	const BoardsButtonPressed = () => {
		dispatch(setBoard({ board: null }))
	}

	const LogoutButtonPressed = () => {
		dispatch(logout())
		Cookies.remove('token')
	}

	return (
		<TopBarContainer className="row">
			<LinkStyle to="/boards">
				<BoardsButton type="button" onClick={BoardsButtonPressed}>Boards</BoardsButton>
			</LinkStyle>
			<LogoutStyle className="float-right" to="/login">
				<LogoutButton onClick={LogoutButtonPressed}>Logout</LogoutButton>
			</LogoutStyle>
		</TopBarContainer>
	)
}

export default connect(null, null)(TopBar)
