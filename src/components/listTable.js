import React, { useState, useEffect, Suspense } from 'react'
import Button from 'react-bootstrap/Button'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import CardListContainer from './cardList'
import { updateListOrder } from '../redux/actions/index'
const AddList = React.lazy(() => import('./addList'))


const mapStateToProps = (state) => {
	// console.log('state', state.listReducer)
	return { lists: state.board.board? state.board.board.lists : [] }
}

const ListTable = ({ lists, dispatch }) => {
	const [showingAddAnother, setShowingAddAnother] = useState(true)
	const [dragging, setDragging] = useState(false)

	const changeShowAddAnother = (show) => {
		setShowingAddAnother(show)
	}

	const onDragEnd = (result) => {
		const {
			// eslint-disable-next-line no-unused-vars
			destination, source, draggableId, type
		} = result

		if (dragging) {
			setDragging(false)
		}

		if (!destination) {
			return
		}

		if (destination.droppableId === source.droppableId
			&& destination.index === source.index) {
			return
		}
		if (type === 'list') {
			if (source.droppableId === 'main' && destination.droppableId === 'main') {
				const list = lists[source.index]
				const newLists = Array.from(lists)

				newLists.splice(source.index, 1)
				newLists.splice(destination.index, 0, list)
				dispatch(updateListOrder(newLists))
			}
		} else if (source.droppableId === destination.droppableId) {
			const list = lists[source.droppableId]
			const newCards = Array.from(list.cards)
			newCards.splice(source.index, 1)
			newCards.splice(destination.index, 0, list.cards[source.index])

			const newList = {
				...list,
				cards: newCards
			}

			const newLists = Array.from(lists)
			newLists.splice(source.droppableId, 1)
			newLists.splice(source.droppableId, 0, newList)

			console.log('new lists', newLists)
			console.log('sendind list', dispatch(updateListOrder(newLists)))
		} else {
			const sourceList = lists[source.droppableId]
			const destinationList = lists[destination.droppableId]
			const newSourceCards = Array.from(sourceList.cards)
			const newDestinationCards = Array.from(destinationList.cards)
			newSourceCards.splice(source.index, 1)
			newDestinationCards.splice(destination.index, 0, sourceList.cards[source.index])
			newDestinationCards[destination.index].listId = destinationList.id

			const newSourceList = {
				...sourceList,
				cards: newSourceCards
			}

			const newDestinationList = {
				...destinationList,
				cards: newDestinationCards
			}

			const newLists = Array.from(lists)
			newLists.splice(source.droppableId, 1)
			newLists.splice(source.droppableId, 0, newSourceList)
			newLists.splice(destination.droppableId, 1)
			newLists.splice(destination.droppableId, 0, newDestinationList)
			dispatch(updateListOrder(newLists))
		}
	}

	const updatecards = (cards, index) => {
		const newList = {
			...lists[index],
			cards
		}

		const newLists = Array.from(lists)
		newLists.splice(index, 1)
		newLists.splice(index, 0, newList)

		dispatch(updateListOrder(newLists))
	}

	const onDragStart = () => {
		if (!dragging) {
			setDragging(true)
			lists.map((list) => document.getElementById(`listTitle${list.id.toString()}`).blur())
		}
	}

	function downHandler({ key }) {
		if (key === 'F1') {
			// eslint-disable-next-line no-debugger
			debugger
		}
	}

	useEffect(() => {
		window.addEventListener('keydown', downHandler)
		return () => {
			window.removeEventListener('keydown', downHandler)
		}
	}, [])

	return (
		<table style={{ width: (lists.length + 1) * 257 }}>
			<tbody>
				<DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
					<Droppable droppableId="main" direction="horizontal" type="list">
						{(provided) => (
							<tr
								ref={provided.innerRef}
								{...provided.droppableProps}
							>
								{
									lists.map((list, i) => (
										<CardListContainer
											key={list.id}
											listTitle={list.name}
											cards={list.cards}
											index={i}
											id={list.id}
											setCards={(newcards) => updatecards(newcards, i)}
										/>
									))
								}

								{provided.placeholder}
								<td>
									{showingAddAnother
										? (
											<Button vertical-align="baseline" top="0" className="btn-add-another-list" variant="link" onClick={() => changeShowAddAnother(false)}>
												<font size="4">＋</font>
												Add another list
											</Button>
										)
										: (
											<Suspense fallback={<div>Loading...</div>}>
												<AddList
													changeShowAddAnother={changeShowAddAnother}
												/>
											</Suspense>
										)}
								</td>

							</tr>
						)}
					</Droppable>
				</DragDropContext>
			</tbody>
		</table>
	)
}
export default connect(mapStateToProps)(ListTable)
