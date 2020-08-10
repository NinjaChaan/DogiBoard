import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { connect, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { RiDeleteBin2Line, RiDragMove2Line } from 'react-icons/ri'
import { MdDragHandle } from 'react-icons/md'
import Button from './Button'
import { setBoard, updateUser, updateBoards } from '../redux/actions/index'
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

const CreateBoardContainer = styled.div`
	margin: 15px;
	max-width: 200px;
`

const InviteButtonsContainer = styled.div`
	margin: 10px 5px;
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
	text-align: center;
	width: 200px;
	min-width: 200px;
	display: inline-block;
	margin-top: 5px;
	text-align: center;
	text-overflow: ellipsis;
	overflow: hidden;
	word-wrap: break-word;
`

const BoardContainer = styled.div`
	width: 200px;
	/* margin: 15px;	 */
	color: white;
	font-size: larger;
	font-weight: 600;
	background-color: #557dff;
	border-radius: 4px;
	display: table;
`

const DeleteArea = styled.div`
	display: flex;
	background-color: transparent;
	height: 100px;
	position: absolute;
	bottom: 0px;
	width: 100%;
	left: 0px;
	align-items: center;
	justify-content: center;
	
	&.dragging{
		background-color: rgba(255, 0, 0, 0.8)		
	}
`

const DeleteText = styled.span`
	font-size: 1.5rem;
	font-weight: bold;
	position: fixed;
	margin: auto;
	color: white;
	width: 100%;
	text-align: center;
	@media ${(props) => props.theme.device.laptop} {
		font-size: 2.5rem;
	}
`

const BoardNameInput = styled.input`
	width: 95%;
	margin: 10px 5px 5px 5px;
	border-radius: 4px;
`

const BoardCreatorButton = styled(Button)`
	margin: 5px 5px;
	width: 50%;
	flex: 0 0 45%;
`

const BoardButtonContainer = styled.div`
	display: flex;
`

const BoardCreator = styled.div`
	padding: 6px;
	background-color: rgb(85,125,255);
	border-radius: 4px;
	justify-content: 'center';
	height: 'auto';
`

const BoardCreatorSpan = styled.span`
	text-align: center;
	color: white;
	font-weight: 600;
`

const BoardName = styled.span`
	float: left;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: break-word;
	width: 75%;
	text-align: left;
	word-wrap: break-word;
`

const BoardsPage = ({ dispatch }) => {
	const user = useSelector((state) => state.user.user)
	const [boards, setBoards] = useState([])
	const [invites, setInvites] = useState([])
	const [dragging, setDragging] = useState(false)
	const [creatingBoard, setCreatingBoard] = useState(false)
	const [newBoardName, setNewBoardName] = useState('')
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
		console.log(user)
		if (user.boards) {
			setBoards(user.boards)
		}
		if (user.invites) {
			setInvites(user.invites)
		}
	}, [user])

	const onDragEnd = (result) => {
		const {
			// eslint-disable-next-line no-unused-vars
			destination, source, draggableId, type
		} = result

		setDragging(false)

		if (!destination) {
			console.log('no destination')
			return
		}
		if (destination.droppableId === 'deleteArea') {
			const updatedUser = {
				...user,
				boards: user.boards.filter((b) => b.id !== draggableId).map((board) => board.id)
			}
			const upUser = {
				...user,
				boards: user.boards.filter((b) => b.id !== draggableId)
			}

			userService.updateBoards(user.id, updatedUser)
				.then((response) => {
					if (response.status === 200) {
						console.log('deleted ', draggableId)
						dispatch(updateUser(upUser))
					} else {
						console.log('failed to delete ', draggableId)
						console.log(response)
					}
				})
		}
	}

	const onDragStart = () => {
		setDragging(true)
	}

	const closeCreateBoard = () => {
		setNewBoardName('')
		setCreatingBoard(false)
	}

	const createNewBoard = (e) => {
		e.stopPropagation()

		closeCreateBoard()

		const newBoard = {
			name: newBoardName
		}
		boardService.createBoard(newBoard).then((res) => {
			userService.getOne(user.id).then((u) => {
				console.log(u)
				dispatch(updateUser(u.data))
			})
		})
	}

	const handleTextChange = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault()
		}
		setNewBoardName(event.target.value)
	}

	const handleChildClick = (e) => {
		e.stopPropagation()
	}
	return (
		<div className="container" style={{ marginTop: '60px' }} onClick={closeCreateBoard}>
			<DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
				{boards.length > 0
					&& (
						<>
							<Title>Boards</Title>
							<BoardsContainer>
								<Droppable droppableId="boards" direction="horizontal">
									{(provided) => (
										<div
											className="row"
											ref={provided.innerRef}
											{...provided.droppableProps}
										>
											{
												boards.map((board, index) => (
													<Draggable
														draggableId={board.id}
														index={index}
														key={board.id}
													>
														{(dragProvided) => (
															<BoardLink
																ref={dragProvided.innerRef}
																{...dragProvided.draggableProps}
																to={`/board/${board.id}`}
																title={board.name}
															>
																<div
																	className="dragHandle"
																	{...dragProvided.dragHandleProps}
																/>
																<BoardButton
																	style={{ justifyContent: 'left', height: 'auto' }}
																	onClick={() => { OpenBoard(board) }}
																>
																	<div style={{ width: '110%' }}>
																		<MdDragHandle
																			draggable="false"
																			size={20}
																			style={{
																				margin: '2px 20px 5px 0',
																				pointerEvents: 'none',
																				float: 'left'
																			}}
																		/>
																		<BoardName>{board.name}</BoardName>
																	</div>
																</BoardButton>
															</BoardLink>
														)}
													</Draggable>
												))
											}
											{!creatingBoard && (
												<CreateBoardContainer onClick={handleChildClick}>
													<BoardButton
														style={{ justifyContent: 'center', height: 'auto' }}
														onClick={() => { setCreatingBoard(true) }}
													>
														<BoardCreatorSpan>Create a new board</BoardCreatorSpan>
													</BoardButton>
												</CreateBoardContainer>
											)}

											{creatingBoard && (
												<CreateBoardContainer onClick={handleChildClick}>
													<BoardCreator>
														<div
															style={{ display: 'grid' }}
														>
															<BoardCreatorSpan>Create a new board</BoardCreatorSpan>
															<BoardNameInput
																autoFocus
																placeholder="Enter board name"
																value={newBoardName}
																onChange={handleTextChange}
															/>
															<BoardButtonContainer>
																<BoardCreatorButton
																	success={newBoardName.length >= 3}
																	onClick={createNewBoard}
																	disabled={newBoardName.length < 3}
																	title={newBoardName.length < 3 ? 'Name must be at least 3 characters long' : null}
																>
																	Create
																</BoardCreatorButton>
																<BoardCreatorButton
																	warning
																	onClick={closeCreateBoard}
																>
																	Cancel
																</BoardCreatorButton>
															</BoardButtonContainer>
														</div>
													</BoardCreator>
												</CreateBoardContainer>
											)}
											{provided.placeholder}
										</div>
									)}
								</Droppable>
							</BoardsContainer>
							<Droppable droppableId="deleteArea">
								{(provided) => (
									<DeleteArea
										ref={provided.innerRef}
										{...provided.droppableProps}
										className={dragging && 'dragging'}
									>
										{dragging && (
											<DeleteText>
												<RiDeleteBin2Line size={window.matchMedia('(min-width: 425px)').matches ? 60 : 40} style={{ position: 'absolute', left: '10px' }} />
												{!window.matchMedia('(min-width: 425px)').matches && '	'}
												Drag here to leave board
											</DeleteText>
										)}
										{provided.placeholder}
									</DeleteArea>
								)}
							</Droppable>
						</>
					)}
				{
					invites.length > 0
					&& (
						<>
							<Title>Invites</Title>
							<BoardsContainer className="row">
								{
									invites.map((board) => (
										<BoardContainer key={board.id}>
											<BoardTitle>
												{board.name}
											</BoardTitle>
											<InviteButtonsContainer>
												<InviteButton onClick={() => answerInvitation(board.id, true)} success>Join</InviteButton>
												<InviteButton onClick={() => answerInvitation(board.id, false)} warning>Reject</InviteButton>
											</InviteButtonsContainer>
										</BoardContainer>
									))
								}
							</BoardsContainer>
						</>
					)
				}
			</DragDropContext>
		</div>
	)
}

export default connect(null, null)(BoardsPage)
