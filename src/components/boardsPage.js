import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { connect, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Button from './Button'
import { setBoard, updateUser } from '../redux/actions/index'
import boardService from '../services/boards'
import userService from '../services/users'

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
	user-select: none;
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
	const [boards, setBoards] = useState([])
	const [invites, setInvites] = useState([])
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
			.then((response) => {
				console.log(response)
				userService.getOne(user.id).then((u) => {
					console.log(u)
					dispatch(updateUser(u.data))
				})
			})
	}

	useEffect(() => {
		if (user.boards) {
			setBoards(user.boards)
		}
		if (user.invites) {
			setInvites(user.invites)
		}
	}, [user])

	return (
		<div className="container" style={{ marginTop: '60px' }}>
			{boards.length > 0
				&& (
					<>
						<Title>Boards</Title>
						<BoardsContainer className="row">
							{
								boards.map((board) => (
									<BoardLink key={board.id} to={`/board/${board.id}`}>
										<BoardButton onClick={() => { OpenBoard(board) }}>{board.name}</BoardButton>
									</BoardLink>
								))
							}
						</BoardsContainer>
					</>
				)}
			{invites.length > 0
				&& (
					<>
						<Title>Invites</Title>
						<BoardsContainer className="row">
							{
								invites.map((board) => (
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
				)}
		</div>
	)
}

export default connect(null, null)(BoardsPage)
