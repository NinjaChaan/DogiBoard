import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Button from './Button'
import { setBoard } from '../redux/actions/index'

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
	}
	// const [boardIds, setBoardIds] = useState([])
	// useEffect(() => {
	// 	user.user.boards.map((board) => (
	// 		console.log('board', board)
	// 	))
	// }, [])
	return (
		<div>
			<h1>Boards</h1>
			{
				user.user.boards.map((board) => (
					<BoardButton key={board.id} onClick={() => { OpenBoard(board) }}>{board.name}</BoardButton>
				))
			}
		</div>
	)
}

export default connect(mapStateToProps, null)(BoardsPage)
