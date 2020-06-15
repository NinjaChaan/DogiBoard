import React, { useEffect } from 'react'
import styled from 'styled-components'
import { connect, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Button from './Button'
import { setBoard, updateUser } from '../redux/actions/index'
import boardService from '../services/boards'

const BoardButton = styled.a`
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

const InviteButtonsContainer = styled.div`
	margin: 5px 10px 10px 10px;
	display: -ms-flexbox;
	display: flex;
	-ms-flex-wrap: wrap;
	flex-wrap: wrap;
	font-size: medium;
`

const InviteButton = styled(Button)`
	flex: 0 0 45%;
	max-width: 45%;
	margin-right: 5px;
	margin: auto;
`

const BoardTitle = styled.span`
	font-size: large;
	font-weight: 600;
	padding-left: 15px;
`

const BoardContainer = styled.div`
	width: 200px;
	margin: 15px;	
	color: white;
	font-size: larger;
	font-weight: 600;
	background-color: #557dff;
	border-radius: 4px;

`

const BoardsPage = ({ dispatch }) => {
	const user = useSelector((state) => state.user.user)
	const OpenBoard = (board) => {
		dispatch(setBoard({ board }))
	}

	const answerInvitation = (boardid, answer) => {
		console.log('answer', user.id)
		const update = {
			userId: user.id,
			answer
		}

		boardService.respondToInvitation(boardid, update)
			.then((u) => {
				dispatch(updateUser({ u }))
			})
	}

	useEffect(() => {
		console.log('user updated')
	}, [user])

	return (
		<div className="container">
			{user.boards.length > 0
				&& (
					<>
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
					</>
				)}
			{user.invites.length > 0
				&& (
					<>
						<Title>Invites</Title>
						<BoardsContainer className="row">
							{
								user.invites.map((board) => (
									<BoardContainer key={board.id}>
										<BoardTitle>
											{board.name}
											<InviteButtonsContainer>
												<InviteButton onClick={() => answerInvitation(board.id, true)} success>Join</InviteButton>
												<InviteButton onClick={() => answerInvitation(board.id, false)} warning>Reject</InviteButton>
											</InviteButtonsContainer>
										</BoardTitle>
									</BoardContainer>
								))
							}
						</BoardsContainer>
					</>
				)
			}
		</div >
	)
}

export default connect(null, null)(BoardsPage)
