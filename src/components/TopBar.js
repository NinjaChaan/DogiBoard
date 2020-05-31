import React, { useEffect, useState } from 'react'
import { Link, BrowserRouter as Router, Switch } from 'react-router-dom'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Button from './Button'
import { setBoard, setRoute } from '../redux/actions/index'

const TopBarContainer = styled.div`
	height: 45px;
	background-color: #1d6cba;
	padding: 5px;
`

const BoardsButton = styled(Button)`
	width: 10%;
`

const TopBar = ({ dispatch }) => {
	const BoardsButtonPressed = () => {
		dispatch(setBoard({ board: null }))
	}

	return (
		<TopBarContainer>
			<nav>
				<Link to="/boards">
					<BoardsButton onClick={BoardsButtonPressed}>Boards</BoardsButton>
				</Link>
			</nav>
		</TopBarContainer>
	)
}

export default connect(null, null)(TopBar)
