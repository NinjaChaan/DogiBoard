import React from 'react'
import styled, { keyframes } from 'styled-components'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
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

const BoardsContainer = styled.div`
	margin: auto;
	width: 90%;
`

const Title = styled.h1`
	margin: auto;
	width: 90%;
	padding: 15px;
`

const BoardLink = styled(Link)`
	margin: 15px;
`

const BoardsPage = ({ user, dispatch }) => {
	const OpenBoard = (board) => {
		dispatch(setBoard({ board }))
		// dispatch(setRoute({ route: 'board' }))
	}
	console.log('we in boards', user)
	return (
		<div className="container">
			<Title>Boards</Title>
			<BoardsContainer className="row">
				{
					user.user.boards.map((board) => (
						<BoardLink key={board.id} to={`/board/${board.id}`}>
							<BoardButton onClick={() => { OpenBoard(board) }}>{board.name}</BoardButton>
						</BoardLink>
					))
				}
			</BoardsContainer>
		</div>
	)
}

export default connect(mapStateToProps, null)(BoardsPage)
