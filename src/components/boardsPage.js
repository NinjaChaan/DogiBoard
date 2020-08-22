import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { connect, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { RiDeleteBin2Line, RiDragMove2Line } from 'react-icons/ri'
import { MdDragHandle } from 'react-icons/md'
import ac from '../utils/accessControl'
import getRole from '../utils/getUserRole'
import Dropdown from './Dropdown'
import Button from './Button'
import { setBoard, updateUser, updateBoards } from '../redux/actions/index'
import boardService from '../services/boards'
import userService from '../services/users'

const BoardButton = styled(Button)`
	height: max-content;
	padding: auto;
	/* width: 200px; */
	flex: 0 0 90%;
	justify-content: left;
	margin: 0;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: break-word;
	width: 100%;
	text-align: left;
	word-wrap: break-word;
	padding-left: 0;
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
	width: 100%;
	/* pointer-events: ${(props) => props.disabled && 'none'}; */
`

const CreateBoardContainer = styled.div`
	margin-right: 20px;
	margin-bottom: 20px;
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

const BoardRenameInput = styled.input`
	width: 78%;
	height: 36px;
	padding: .375rem .75rem;
	padding-left: 0;
	border-radius: 4px;
	display: inline-block;
	background-color: transparent;
	border: none;
	outline: none;
	color: white;
	font-weight: 600;
	/* border: ${(props) => props.failedRename && 'solid rgba(255,0,0,0.75)'}; */
	&::placeholder{
		color: rgba(255,255,255,0.75);
	}
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
	text-align: left;
	word-wrap: break-word;
	max-height: 48px;
	max-width: 156px;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	display: -webkit-box;
`

const HamburgerButton = styled(Button)`
	/* padding: 5px 0 0 10px; */
	flex: 0 0 10%;	
	margin: 0;
`

const BoardDiv = styled.div`
	background-color: rgb(85,125,255);
	max-width: 200px;
	width: 200px;
	margin-right: 20px;
	margin-bottom: 20px;
	display: flex;
	border-radius: 4px;
`

const Container = styled.div`
	display: -ms-flexbox;
	display: flex;
	-ms-flex-wrap: wrap;
	flex-wrap: wrap;
`

const LeavePopUpContainer = styled.div`
	display: flex;
	margin-bottom: 5px;
`

const LeaveText = styled.span`
	flex: 0 0 100%;
`
const CloseButton = styled(Button)`
	flex: 0 0 5%;
	margin: 0 5px 0 5px;
	border-radius: 20%;
	max-width: 25px;
	max-height: 30px;
	padding: .2rem .75rem;
`

const LeaveButton = styled(Button)`
	width: 45%;
	margin: 0;
`

const WarningText = styled.span`
	color: red;
	font-weight: 600;
`

const BoardsPage = ({ dispatch }) => {
	const user = useSelector((state) => state.user.user)
	const [boards, setBoards] = useState([])
	const [invites, setInvites] = useState([])
	const [dragging, setDragging] = useState(false)
	const [creatingBoard, setCreatingBoard] = useState(false)
	const [newBoardName, setNewBoardName] = useState('')
	const [showHamburgerMenu, setShowHamburgerMenu] = useState(false)
	const [boardPos, setboardPos] = useState({})
	const [clickedBoard, setClickedBoard] = useState(null)
	const [showSureToLeave, setShowSureToLeave] = useState(false)
	const [showSureToRemove, setShowSureToRemove] = useState(false)
	const [renaming, setRenaming] = useState(false)

	const openBoard = (board) => {
		if (!renaming) {
			dispatch(setBoard({ board }))
		}
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
		boardService.createBoard(newBoard).then(() => {
			userService.getOne(user.id).then((u) => {
				console.log(u)
				dispatch(updateUser(u.data))
			})
		})
	}

	const handleChildClick = (e) => {
		e.stopPropagation()
	}

	const clickHamburgerMenu = (board) => {
		setShowSureToLeave(false)
		setShowSureToRemove(false)
		setClickedBoard(board)
		const element = document.getElementById(`hamburgerButton-${board.id}`)
		const rect = element.getBoundingClientRect()
		if (window.matchMedia('(min-width: 425px)').matches) {
			setboardPos({ top: `${rect.top + element.parentElement.offsetHeight}px`, left: `${rect.left}px` })
		} else {
			setboardPos({ top: `${rect.top + 35}px`, left: `${rect.left}px` })
		}
		setShowHamburgerMenu(!showHamburgerMenu)
	}

	const leaveBoard = () => {
		console.log(clickedBoard)
		setShowSureToLeave(false)
		setShowSureToRemove(false)
		setShowHamburgerMenu(false)
		// const newUsers = clickedBoard.users.filter((u) => u.id !== user.id)
		// newUsers[Math.floor(Math.random() * newUsers.length)].role = 'admin'
		// const updatedBoard = {
		// 	...clickedBoard,
		// 	users: newUsers
		// }
		// console.log(updatedBoard)
		// boardService.updateBoard(clickedBoard.id, updatedBoard).then((response) => {
		// 	console.log(response)
		// })
		boardService.removeUser(clickedBoard.id, { userId: user.id })
			.then((response) => {
				console.log('remove response', response)
				userService.getOne(user.id).then((u) => {
					console.log(u)
					dispatch(updateUser(u.data))
				})
			})
	}

	const removeBoard = () => {
		setShowSureToLeave(false)
		setShowSureToRemove(false)
		setShowHamburgerMenu(false)

		boardService.remove(clickedBoard.id)
			.then((response) => {
				console.log('remove response', response)
				userService.getOne(user.id).then((u) => {
					console.log(u)
					dispatch(updateUser(u.data))
				})
			})
	}

	const rename = (board) => {
		setRenaming(false)
		if (newBoardName.length < 3) {
			// if (newBoardName.length === 0) {
			// 	setFailedRename(false)
			// 	setRenaming(false)
			// 	return
			// }
			// setFailedRename(true)
			setNewBoardName('')
			return
		}

		const updatedBoard = {
			...board,
			name: newBoardName
		}
		boardService.updateBoard(board.id, updatedBoard).then((response) => {
			console.log(response)
		})
		dispatch(setBoard({ updatedBoard }))

		const updatedUser = user

		for (let index = 0; index < updatedUser.boards.length; index++) {
			if (updatedUser.boards[index].id === board.id) {
				updatedUser.boards[index] = updatedBoard
			}
		}
		dispatch(updateUser(updatedUser))
		setNewBoardName('')
	}

	const handleTextChange = (event) => {
		setNewBoardName(event.target.value)
	}

	useEffect(() => {
		const listener = (event) => {
			if (event.code === 'Enter' || event.code === 'NumpadEnter') {
				if (renaming && clickedBoard) {
					rename(clickedBoard)
				}
			}
		}
		document.addEventListener('keydown', listener)
		return () => {
			document.removeEventListener('keydown', listener)
		}
	}, [renaming, clickedBoard, newBoardName])

	return (
		<div className="container" style={{ marginTop: '60px' }} onClick={closeCreateBoard}>
			<DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
				{boards
					&& (
						<>
							<Title>Boards</Title>
							<BoardsContainer>
								<Droppable droppableId="boards" direction="horizontal">
									{(provided) => (
										<Container
											ref={provided.innerRef}
											{...provided.droppableProps}
										>
											{
												boards.map((board) => (
													// <Draggable
													// 	draggableId={board.id}
													// 	index={index}
													// 	key={board.id}
													// >
													// {(dragProvided) => (

													// <div
													// 	className="dragHandle"
													// 	{...dragProvided.dragHandleProps}
													// />
													<div
														key={board.id}
														style={{ justifyContent: 'left', height: 'auto' }}
													>
														<BoardDiv>
															<HamburgerButton
																id={`hamburgerButton-${board.id}`}
																transparent
																onClick={() => { clickHamburgerMenu(board) }}
															>
																<MdDragHandle
																	draggable="false"
																	size={20}
																	style={{
																		margin: '2px 0px 5px 0',
																		pointerEvents: 'none',
																		float: 'left'
																	}}
																/>
															</HamburgerButton>
															{(!renaming || board.id !== clickedBoard.id) && (
																<BoardLink
																	// ref={dragProvided.innerRef}
																	// {...dragProvided.draggableProps}
																	to={`/board/${board.id}`}
																	title={board.name}
																	onClick={(e) => { if (renaming) { e.preventDefault() } }}
																>
																	<BoardButton
																		onClick={() => { openBoard(board) }}
																		transparent
																	>
																		{(!renaming || board.id !== clickedBoard.id) && (
																			<BoardName>
																				{board.name}
																			</BoardName>
																		)}
																	</BoardButton>
																</BoardLink>
															)}

															{renaming && board.id === clickedBoard.id && (
																<BoardRenameInput
																	id={`rename-${board.id}`}
																	autoFocus
																	onChange={handleTextChange}
																	onBlur={() => { rename(board) }}
																	placeholder={board.name}
																/>
															)}
														</BoardDiv>
													</div>
													// )}
													// 	{/* </Draggable> */}
												))
											}
											<Dropdown show={showHamburgerMenu} setShowMenu={setShowHamburgerMenu} parentId={clickedBoard ? `hamburgerButton-${clickedBoard.id}` : null} width={200} position={boardPos}>
												{(!showSureToLeave && !showSureToRemove) && (
													<Button onClick={() => { setShowSureToLeave(true) }}>Leave board</Button>
												)}
												{(!showSureToLeave && !showSureToRemove) && clickedBoard && ac.can(getRole(clickedBoard.users, user.id)).deleteOwn('board').granted && (
													<>
														<Button onClick={() => { setRenaming(true); setShowHamburgerMenu(false) }}>Rename board</Button>
														<Button onClick={() => { setShowSureToRemove(true) }}>Delete board</Button>
													</>
												)}
												{clickedBoard && showSureToLeave && (
													<div>
														<LeavePopUpContainer>
															<LeaveText>
																Are you sure you want to leave the board?
															</LeaveText>
														</LeavePopUpContainer>
														<div style={{ display: 'flex' }}>
															<LeaveButton warning style={{ marginRight: '15px' }} onClick={leaveBoard}>
																Leave
															</LeaveButton>
															<LeaveButton onClick={() => { setShowSureToLeave(false) }}>
																Cancel
															</LeaveButton>
														</div>
													</div>
												)}
												{clickedBoard && showSureToRemove && (
													<div>
														<LeavePopUpContainer>
															<LeaveText>
																Are you certain you want to
																<WarningText> permanently </WarningText>
																delete this board?
															</LeaveText>
														</LeavePopUpContainer>
														<div style={{ display: 'flex' }}>
															<LeaveButton warning style={{ marginRight: '15px' }} onClick={removeBoard}>
																Delete
															</LeaveButton>
															<LeaveButton onClick={() => { setShowSureToRemove(false) }}>
																Cancel
															</LeaveButton>
														</div>
													</div>
												)}
											</Dropdown>
											{!creatingBoard && (
												<CreateBoardContainer onClick={handleChildClick}>
													<BoardButton
														style={{ justifyContent: 'center', height: 'auto', width: '200px' }}
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
										</Container>
									)}
								</Droppable>
							</BoardsContainer>
							{/* <Droppable droppableId="deleteArea">
								{(provided) => (
									<DeleteArea
										ref={provided.innerRef}
										{...provided.droppableProps}
										className={dragging && 'dragging'}
									>
										{dragging && (
											<DeleteText>
												<RiDeleteBin2Line
													size={window.matchMedia('(min-width: 425px)').matches ? 60 : 40}
													style={{ position: 'absolute', left: '10px' }}
												/>
												{!window.matchMedia('(min-width: 425px)').matches && '	'}
												Drag here to leave board
											</DeleteText>
										)}
										{provided.placeholder}
									</DeleteArea>
								)}
							</Droppable> */}
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
