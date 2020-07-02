import React, { useEffect, useState, Suspense } from 'react'
import { connect, useSelector } from 'react-redux'
import _ from 'underscore'
import styled from 'styled-components'
import EventSourcePoly from 'eventsource'
import boardService from '../services/boards'
import { device } from '../devices'
import { setBoard } from '../redux/actions/index'
import LoadingAnimation from './loadingAnimation'


const ListTable = React.lazy(() => import('./listTable'))
const CardWindow = React.lazy(() => import('./cardWindow/cardWindow'))

const PageStyle = styled.div`
padding-top: 50px;
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
const BoardPage = ({ match, dispatch }) => {
	const boardId = match.params.id

	// const lists = useSelector((state) => state.listReducer.lists)
	const user = useSelector((state) => state.user)
	const board = useSelector((state) => state.board.board)
	const [ignoreNextUpdate, setIgnoreNextUpdate] = useState(true)
	const [boardChecked, setBoardChecked] = useState(false)


	// Listen to server events (someone else changed something on their client)
	const startStream = () => {
		if (boardId) {
			console.log('Connecting to event stream:', `/api/boards/stream/${boardId}`)
			const eventSourceInitDict = {
				headers: {
					Authorization: `Bearer ${user.token}`
				}
			}
			const eventSource = new EventSourcePoly(`/api/boards/stream/${boardId}`, eventSourceInitDict)
			eventSource.onopen = (m) => {
				console.log('Connected!', m)
			}
			eventSource.onerror = (e) => console.log(e)
			eventSource.onmessage = (e) => {
				const data = JSON.parse(e.data)
				// console.log('stream data', data)

				if (!_.isEqual(data, board)) {
					setIgnoreNextUpdate(true)
					dispatch(setBoard({ board: data }))
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
		if (!ignoreNextUpdate && board && board.id) {
			const updatedBoard = {
				name: board.name,
				lists: board.lists
			}
			console.log(board)
			boardService.update(board.id, updatedBoard).then((response) => {
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

export default connect(null, null)(BoardPage)