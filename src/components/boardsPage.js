import React from 'react'
import styled from 'styled-components'
import { connect, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Button from './Button'
import { setBoard } from '../redux/actions/index'

const BoardButton = styled(Button)`
	padding: auto;
	width: 200px;
`

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

const BoardsPage = ({ dispatch }) => {
	const user = useSelector((state) => state.user.user)
	const OpenBoard = (board) => {
		dispatch(setBoard({ board }))
	}
	return (
		<div className="container">
			<Title>Boards</Title>
			<BoardsContainer className="row">
				{
					user.boards.map((board) => (
						<BoardLink key={board.id} to={`/board/${board.id}`}>
							<BoardButton onClick={() => { OpenBoard(board) }}>{board.name}</BoardButton>
						</BoardLink>
					))
				}
			</BoardsContainer>
		</div>
	)
}

export default connect(null, null)(BoardsPage)
