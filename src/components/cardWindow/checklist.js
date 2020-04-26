import React, { useState } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import Button from 'react-bootstrap/Button'
import CheckListDraggable from './checkListDraggable'
import AddChecklistItem from './addChecklistItem'
import ChecklistTitle from './checkListTitle'
import { setSelectedCard, updateChecklist } from '../../actions/index'

const Checklist = ({ checkItems, createCard, innerRef, placeholder, showingAddAnother, changeShowAddAnother, id }) => {
	console.log('in check', checkItems)
	return (
		<tbody ref={innerRef}>
			{checkItems.map((card, i) => {
				return (
					<CheckListDraggable key={card.id} i={i} card={card} />
				)
			})}
			{placeholder}
			<tr>
				<td>
					{showingAddAnother
						? (
							<Button className="btn-add-another-checklist" variant="link" onClick={() => changeShowAddAnother(false)}>
								<font size="4">＋</font>
								Add checklist item
							</Button>
						)
						: (
							<AddChecklistItem
								listId={id}
								changeShowAddAnother={changeShowAddAnother}
								clickFunction={createCard}
							/>
						)}
				</td>
			</tr>
		</tbody>
	)
}

const CheckListContainer = ({ selectedCard, id, dispatch }) => {
	const [showingAddAnother, setShowingAddAnother] = useState(true)
	const [dragging, setDragging] = useState(false)

	const changeShowAddAnother = (show) => {
		setShowingAddAnother(show)
	}
	const createCard = (newCheckItem) => {
		console.log('add list item', newCheckItem)
		selectedCard.checklist.checkItems.concat(newCheckItem)
		console.log('selected card checklist', selectedCard)
		const list = { text: selectedCard.checklist.text, checkItems: selectedCard.checklist.checkItems.concat(newCheckItem) }
		console.log('list', list)
		const newCard = {
			text: selectedCard.text,
			description: selectedCard.description,
			checklist: list,
			id: selectedCard.id,
			listId: selectedCard.listId
		}

		const newChecklist = {
			checklist: list,
			id: selectedCard.id,
			listId: selectedCard.listId
		}

		console.log(dispatch(setSelectedCard(newCard)))
		console.log(dispatch(updateChecklist(newChecklist)))
		if (document.getElementById('checkListTitle')) {
			setTimeout(() => {
				console.log(document.getElementById('checkListTitle'))
				document.getElementById('checkListTitle').focus()
			}, 10)
		}

	}

	const onDragStart = () => {
		if (!dragging) {
			// setDragging(true)
			// lists.map((list) => document.getElementById(`listTitle${list.id.toString()}`).blur())
		}
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
		if (source.droppableId === destination.droppableId) {
			const listItem = selectedCard.checklist.checkItems[source.index]
			const newItems = Array.from(selectedCard.checklist.checkItems)

			newItems.splice(source.index, 1)
			newItems.splice(destination.index, 0, listItem)

			const newList = {
				text: selectedCard.checklist.text,
				checkItems: newItems
			}
			const newChecklist = {
				checklist: newList,
				id: selectedCard.id,
				listId: selectedCard.listId
			}
			const newCard = {
				text: selectedCard.text,
				description: selectedCard.description,
				checklist: newList,
				id: selectedCard.id,
				listId: selectedCard.listId
			}

			console.log('new lists', newChecklist)
			console.log('new card', newCard)
			console.log('sendind select', dispatch(setSelectedCard(newCard)))
			console.log('sendind list', dispatch(updateChecklist(newChecklist)))
		}
	}

	const updateChecklistFunc = (text) => {
		const newList = {
			text,
			checkItems: selectedCard.checklist.checkItems
		}
		const newChecklist = {
			checklist: newList,
			id: selectedCard.id,
			listId: selectedCard.listId
		}
		const newCard = {
			text: selectedCard.text,
			description: selectedCard.description,
			checklist: newList,
			id: selectedCard.id,
			listId: selectedCard.listId
		}

		console.log('new lists', newChecklist)
		console.log('new card', newCard)
		console.log('sendind select', dispatch(setSelectedCard(newCard)))
		console.log('sendind list', dispatch(updateChecklist(newChecklist)))
	}

	console.log('rendering checklist', selectedCard)
	return (
		<table className="cardList" style={{ backgroundColor: 'transparent', marginLeft: '0px' }}>
			<thead>
				<tr>
					<td>
						<ChecklistTitle
							listTitle={selectedCard.checklist.text}
							id={'0'}
							card={false}
							classType="checklist"
							updateFunction={updateChecklistFunc}
							autoFocus={true}
						/>
					</td>
				</tr>
			</thead>
			<DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
				<Droppable droppableId={'0'} type="card">
					{(provided) => (
						<Checklist
							id={id}
							checkItems={selectedCard.checklist.checkItems}
							createCard={createCard}
							showingAddAnother={showingAddAnother}
							changeShowAddAnother={changeShowAddAnother}
							innerRef={provided.innerRef}
							placeholder={provided.placeholder}
							{...provided.droppableProps}
						/>
					)}
				</Droppable>
			</DragDropContext>
		</table>
	)
}

export default connect(null, null)(CheckListContainer)
