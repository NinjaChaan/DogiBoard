import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import Button from 'react-bootstrap/Button'
import CheckListDraggable from './checkListDraggable'
import AddChecklistItem from './addChecklistItem'
import ChecklistTitle from './checkListTitle'
import ProgressBar from './progressBar'
import { setSelectedCard, updateChecklist } from '../../actions/index'

const Checklist = ({
	checkItems, createCard, innerRef, placeholder, showingAddAnother, changeShowAddAnother, id, calculateProgress
}) => {
	useEffect(() => {
		calculateProgress()
	}, [checkItems])

	if (checkItems) {
		return (
			<tbody
				id="checklistTable"
				ref={innerRef}
				className="scrollbar"
				style={{
					display: 'block',
					// overflow: 'auto',
					// maxHeight: '300px',
				}}
			>
				{
					checkItems.map((item, i) => (
						<CheckListDraggable key={item.id} i={i} checkItem={item} calculateProgress={calculateProgress} />
					))
				}
				{placeholder}
				<tr style={{ display: 'block', width: '100%' }}>
					<td style={{ display: 'block', width: '100%' }} />
					<div>
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
					</div>
				</tr>
			</tbody>

		)
	}
	return (<></>)
}

const CheckListContainer = ({ selectedCard, id, dispatch }) => {
	const [showingAddAnother, setShowingAddAnother] = useState(true)
	const [dragging, setDragging] = useState(false)
	const [progress, setProgress] = useState(0)

	function updateScroll() {
		const element = document.getElementById('checklistTable')
		element.scrollTop = element.scrollHeight
		setTimeout(() => {
			element.scrollTop = element.scrollHeight
		}, 100)
	}

	const changeShowAddAnother = (show) => {
		setShowingAddAnother(show)
		updateScroll()
	}

	const createCard = (newCheckItem) => {
		console.log('add list item', newCheckItem)
		selectedCard.checklist.checkItems.concat(newCheckItem)
		console.log('selected card checklist', selectedCard)
		const list = { text: selectedCard.checklist.text, checkItems: selectedCard.checklist.checkItems.concat(newCheckItem) }
		console.log('list', list)
		const newCard = {
			...selectedCard,
			checklist: list
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
		updateScroll()
	}

	const onDragStart = () => {
		if (!dragging) {
			// setDragging(true)
			// lists.map((list) => document.getElementById(`listTitle${list.id.toString()}`).blur())
		}
	}

	const onDragEnd = (result) => {
		const {
			destination, source
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
				...selectedCard,
				checklist: newList
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
			...selectedCard,
			checklist: newList
		}

		console.log('new lists', newChecklist)
		console.log('new card', newCard)
		console.log('sendind select', dispatch(setSelectedCard(newCard)))
		console.log('sendind list', dispatch(updateChecklist(newChecklist)))
	}

	const deleteChecklist = () => {
		const newChecklist = {
			checklist: null,
			id: selectedCard.id,
			listId: selectedCard.listId
		}
		const newCard = {
			...selectedCard,
			checklist: null
		}

		console.log('new card', newCard)
		console.log('sendind select', dispatch(setSelectedCard(newCard)))
		console.log('sendind list', dispatch(updateChecklist(newChecklist)))
	}

	const calculateProgress = () => {
		let finished = 0
		selectedCard.checklist.checkItems.map((item) => {
			if (item.done) {
				finished += 1
			}
		})
		setProgress(((finished / selectedCard.checklist.checkItems.length) * 100).toFixed(0))
	}

	return (
		<table style={{
			backgroundColor: 'transparent', marginLeft: '0px', marginTop: '10px', width: '100%'
		}}
		>
			<thead>
				<tr className="container" style={{ display: 'block', width: '100%' }}>
					<td className="row">
						<ChecklistTitle
							listTitle={selectedCard.checklist.text}
							id="0"
							card={false}
							classType="checklist"
							updateFunction={updateChecklistFunc}
							autoFocus={true}
						/>
						<Button className="btn-delete-checklist " variant="danger" onMouseDown={deleteChecklist}>✕</Button>
					</td>
				</tr>
			</thead>
			<tr>
				<td>
					<ProgressBar progress={progress} />
				</td>
			</tr>

			<DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
				<Droppable droppableId="0" type="card">
					{(provided) => (
						<Checklist
							id={id}
							checkItems={selectedCard.checklist.checkItems}
							createCard={createCard}
							showingAddAnother={showingAddAnother}
							changeShowAddAnother={changeShowAddAnother}
							calculateProgress={calculateProgress}
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
