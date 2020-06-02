import React, { useEffect, useState, Suspense } from 'react'
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
import TopBar from './TopBar'
import LoginPage from './loginPage/loginPage'
import { device } from '../devices'
import {
	setLists, login, setBoard, setRoute
} from '../redux/actions/index'
import LoadingAnimation from './loadingAnimation'


const ListTable = React.lazy(() => import('./listTable'))
const CardWindow = React.lazy(() => import('./cardWindow/cardWindow'))

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
const BoardPage = ({ match, user, dispatch }) => {
	const boardId = match.params.id

	// const lists = useSelector((state) => state.listReducer.lists)
	const board = useSelector((state) => state.board.board)
	const [ignoreNextUpdate, setIgnoreNextUpdate] = useState(true)
	const [boardChecked, setBoardChecked] = useState(false)


	// Listen to server events (someone else changed something on their client)
	const startStream = () => {
		if (boardId) {
			console.log('Conncting to event stream:', `/api/boards/stream/${boardId}`)
			const eventSourceInitDict = {
				headers: {
					Authorization: `Bearer ${user.token}`
				}
			}
			const eventSource = new EventSourcePoly(`/api/boards/stream/${boardId}`, eventSourceInitDict)
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
					console.log('dispatch', dispatch(setBoard({ board: data })))
					// console.log('dispatch', dispatch(setLists(data.lists))) // TODO: can this be just setBoard?
				}
			}

			return () => {
				eventSource.close()
				console.log('eventSource closed!')
			}
		} else {
			console.log('No boardID')
		}
	}

	useEffect(startStream, [boardId])


	// If lists change in store, and first state has been loaded, send changes to mongodb
	useEffect(() => {
		console.log('list change', board)
		console.log('ignor next?', ignoreNextUpdate)

		if (!ignoreNextUpdate && board && board.id) {
			console.log('sending board', board)

			const updatedBoard = {
				name: board.name,
				lists: board.lists
			}

			boardService.update(board.id, updatedBoard).then((response) => {
				console.log(response)
			})
		} else if (ignoreNextUpdate) {
			setIgnoreNextUpdate(false)
		}
	}, [board])

	if (board && board.id) {
		return (
			<Suspense fallback={<LoadingAnimation />}>
				<PageStyle>
					<div style={{ width: '100vw', overflow: 'auto', height: '100vh' }}>
						<ListTable />
					</div>
					<CardWindow />
				</PageStyle>
			</Suspense>
		)
	} else {
		return (
			<LoadingAnimation />
		)
	}

}

export default connect(mapStateToProps, null)(BoardPage)