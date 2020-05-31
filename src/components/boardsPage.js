import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Button from './Button'
import { setBoard, setRoute } from '../redux/actions/index'


const BoardButton = styled(Button)`
	padding: auto;
	width: 200px;
`

const mapStateToProps = (state) => {
	const user = state.user
	console.log('board user', user)
	return (
		({
			user
		})
	)
}

const BoardsPage = ({ user, dispatch }) => {
	const OpenBoard = (board) => {
		dispatch(setBoard({ board }))
		// dispatch(setRoute({ route: 'board' }))
	}
	console.log('we in boards', user)
	return (
		<div>
			<h1>Boards</h1>
			{
				user.user.boards.map((board) => (
					<Link key={board.id} to={`/board/${board.id}`}>
						<BoardButton onClick={() => { OpenBoard(board) }}>{board.name}</BoardButton>
					</Link>
				))
			}
		</div>
	)
}

export default connect(mapStateToProps, null)(BoardsPage)
