import React, { useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import _ from 'underscore'
import styled from 'styled-components'
import EventSourcePoly from 'eventsource'
import Cookies from 'js-cookie'
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect
} from 'react-router-dom'
import boardService from '../services/boards'
import userService from '../services/users'
import BoardsPage from './boardsPage'
import LoginPage from './loginPage/loginPage'
import { device } from '../devices'
import { setLists, login, setBoard } from '../redux/actions/index'

const mapStateToProps = (state) => {
	console.log('state at page', state)
	const user = state.user
	return (
		({
			user
		})
	)
}

const PageStyle = styled.div`
display: flex;
position: relative;

height: 100%;
max-width: 200px;

@media ${device.mobileS}{
	max-width: 100%;
}
@media ${device.mobileM}{
	max-width: 100%;
}
@media ${device.mobileL}{
	max-width: 100%;
}

@media ${device.laptop} { 
	max-width: 100%;
}

@media ${device.desktop} {
	max-width: 100%;
}
`
const Page = ({ children, dispatch, user }) => {
	const lists = useSelector((state) => state.listReducer.lists)
	const board = useSelector((state) => state.board.board)
	const [ignoreNextUpdate, setIgnoreNextUpdate] = useState(true)
	const [loggedIn, setLoggedIn] = useState(false)
	const [tokenChecked, setTokenChecked] = useState(false)
	const [boardChecked, setBoardChecked] = useState(false)

	useEffect(() => {
		const token = Cookies.get('token')
		console.log('token?', token)
		console.log('cookies', Cookies.get())
		if (token) {
			userService.getWithToken(token)
				.then((response) => {
					console.log('user', response)
					dispatch(login({ loggedIn: true, token, user: response }))
					if (window.location.href.includes('/board/')) {
						console.log('try to load board', window.location.href)
						const boardId = window.location.href.split('/board/')[1]

						boardService.getOne(boardId).then((response) => {
							console.log('response', response.data)
							if (response.data.error) {
								console.log(response.data.error)
							} else {
								dispatch(setBoard({ board: response.data }))
							}
							setBoardChecked(true)
						})
					}
					setTokenChecked(true)
				})
		}
	}, [])

	useEffect(() => {
		if (user.loggedIn) {
			setLoggedIn(true)
		}
	}, [user])

	// Listen to server events (someone else changed something on their client)
	const startStream = () => {
		console.log('trying to start stream', user)
		if (user.loggedIn && board.id) {
			console.log('Conncting to event stream:', `/api/boards/stream/${board.id}`)
			const eventSourceInitDict = {
				headers: {
					Authorization: `Bearer ${user.token}`
				}
			}
			const eventSource = new EventSourcePoly(`/api/boards/stream/${board.id}`, eventSourceInitDict)
			console.log('events', eventSource)
			eventSource.onopen = (m) => {
				console.log('Connected!', m)
			}
			eventSource.onerror = (e) => console.log(e)
			eventSource.onmessage = (e) => {
				const data = JSON.parse(e.data)
				console.log('stream data', data)

				if (!_.isEqual(data, board)) {
					setIgnoreNextUpdate(true)
					dispatch(setLists(data.lists))
				}
			}
		}
	}

	// // Get all data from mongodb at the start
	// const getAllHook = () => {
	// 	if (loggedIn) {
	// 		boardService.getOne('5eca9eb8ac8fb5275c45e1c5').then((response) => {
	// 			console.log('response', response)
	// 			dispatch(setLists(response[0].lists))
	// 			// console.log(dispatch(setLists(response[0].lists)))
	// 			console.log('loaded lists', response[0].lists)
	// 			setFirstStateGotten(true)
	// 		})
	// 	}
	// }
	// useEffect(getAllHook, [])

	// If lists change in store, and first state has been loaded, send changes to mongodb
	useEffect(() => {
		console.log('list change', lists)
		console.log('ignor next?', ignoreNextUpdate)

		if (!ignoreNextUpdate && lists) {
			console.log('sending lists', lists)

			const updatedBoard = {
				name: board.name,
				lists
			}

			boardService.update(board.id, updatedBoard).then((response) => {
				console.log(response)
			})
		} else if (ignoreNextUpdate) {
			setIgnoreNextUpdate(false)
		}
	}, [lists])
	// If board changes in store, load that board
	useEffect(() => {
		if (board.id) {
			console.log('board change', board)
			startStream()
			dispatch(setLists(board.lists))
		}
		// if (firstStateGotten && !ignoreNextUpdate) {
		// 	console.log('sending lists', lists)

		// 	const updatedBoard = {
		// 		name: 'TestBoard',
		// 		lists
		// 	}

		// 	boardService.update('5eca9eb8ac8fb5275c45e1c5', updatedBoard).then((response) => {
		// 		console.log(response)
		// 	})
		// } else if (ignoreNextUpdate) {
		// 	setIgnoreNextUpdate(false)
		// }
	}, [board])

	// if (!loggedIn) {
	// 	return (
	// 		<Router>
	// 			<Redirect to="/login" />
	// 		</Router>
	// 	)
	// }

	const TopBar = styled.div`
		height: 40px;
		background-color: dodgerblue;
	`

	console.log('loggedIn', loggedIn)
	console.log('tokenChecked', tokenChecked)
	return (
		<div>
			<TopBar />
			{/* if token checked, show routed stuff */}
			{tokenChecked
				&& (
					<Router>
						<Switch>
							<Route exact path="/">
								{!loggedIn
									? <Redirect to="/login" />
									: <Redirect to="/boards" />}
							</Route>
							<Route path="/login">
								{(loggedIn && tokenChecked)
									? <Redirect to="/boards" />
									: <LoginPage />}
							</Route>
							<Route path="/board">
								{/* if board checked from url and board is valid, show the board */}
								{boardChecked && board.id
									&& (
										<PageStyle>
											{children}
										</PageStyle>
									)}

								{/* if board checked from url and board is invalid, show the boards page */}
								{boardChecked && !board.id
									&& <Redirect to="/boards" />}

								{/* if board not checked from url, show nothing */}
								{!boardChecked && null}
							</Route>
							<Route path="/boards">
								{board.id
									? <Redirect to={`/board/${board.id}`} />
									: <BoardsPage />}
							</Route>
						</Switch>
					</Router>
				)}
			{!tokenChecked && <div>Loading...</div>}
		</div>
	)
	// return (
	// 	<Router>
	// 		<div>
	// 			<Switch>
	// 				<Route exact path="/">
	// 					{!loggedIn
	// 						? <Redirect to="/login" />
	// 						: <Redirect to="/boards" />}
	// 				</Route>
	// 				<Route path="/login">
	// 					{(loggedIn && tokenChecked)
	// 						? <Redirect to="/boards" />
	// 						: <LoginPage />}
	// 				</Route>
	// 				<Route path="/board">
	// 					{board.id
	// 						? (
	// 							<PageStyle>
	// 								{children}
	// 							</PageStyle>
	// 						)
	// 						: null}
	// 				</Route>
	// 				<Route path="/boards">
	// 					{board.id
	// 						? <Redirect to={`/board/${board.id}`} />
	// 						: <BoardsPage />}
	// 				</Route>
	// 			</Switch>
	// 		</div>
	// 	</Router>
	// )
	// }

	// if (loggedIn) {
	// 	if (!board.id) {
	// 		return (
	// 			<BoardsPage />
	// 		)
	// 	}
	// 	return (
	// 		<PageStyle>
	// 			{children}
	// 		</PageStyle>
	// 	)
	// }
	// return (
	// 	<LoginPage />
	// )
}

export default connect(mapStateToProps, null)(Page)
