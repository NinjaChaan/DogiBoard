import React, { useState, useEffect, Suspense } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Button from '../Button'
const CheckListDraggable = React.lazy(() => import('./checkListDraggable'))
const AddChecklistItem = React.lazy(() => import('./addChecklistItem'))
import ChecklistTitle from './checkListTitle'
import ProgressBar from './progressBar'
import { setSelectedCard, updateChecklist } from '../../redux/actions/index'

const LinkButton = styled(Button)`
	width: auto;
	display: inline-block;
	justify-content: left;
	padding-bottom: 30px;
`

const Checklist = ({
	checkItems, createCard, innerRef, placeholder, showingAddAnother, changeShowAddAnother, id, calculateProgress
}) => {
	useEffect(() => {
		calculateProgress()
	}, [checkItems])

	const addChecklistItemPressed = () => {
		changeShowAddAnother(false)
		setTimeout(() => {
			document.getElementById('checklistItemTitle').focus()
		}, 100)
	}

	if (checkItems) {
		return (
			<tbody
				id="checklistTable"
				ref={innerRef}
				className="scrollbar"
				style={{
					// display: 'block',
					// overflow: 'auto',
					// maxHeight: '300px',
				}}
			>
				{
					checkItems.map((item, i) => (
						<Suspense fallback={<div>Loading...</div>}>
							<CheckListDraggable key={item.id} i={i} checkItem={item} calculateProgress={calculateProgress} />
						</Suspense>
					))
				}
				{placeholder}
				<tr style={{ display: 'block', width: '100%' }}>
					<td style={{ display: 'block', width: '100%' }}>
						<div>
							{showingAddAnother
								? (
									<LinkButton link onMouseDown={addChecklistItemPressed}>
										<font size="4">＋</font>
										Add checklist item
									</LinkButton>
								)
								: (
									<Suspense fallback={<div>Loading...</div>}>
										<AddChecklistItem
											listId={id}
											changeShowAddAnother={changeShowAddAnother}
											clickFunction={createCard}
											showingAddAnother={showingAddAnother}
										/>
									</Suspense>
								)}
						</div>
					</td>
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
	}

	const createCard = (newCheckItem) => {
		console.log('add list item', newCheckItem)
		selectedCard.checklist.checkItems.concat(newCheckItem)
		console.log('selected card checklist', selectedCard)
		const list = { name: selectedCard.checklist.name, checkItems: selectedCard.checklist.checkItems.concat(newCheckItem) }
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
		// if (document.getElementById('checkListTitle')) {
		// 	setTimeout(() => {
		// 		console.log(document.getElementById('checkListTitle'))
		// 		document.getElementById('checkListTitle').focus()
		// 	}, 10)
		// }
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
				name: selectedCard.checklist.name,
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

	const updateChecklistFunc = (name) => {
		const newList = {
			name,
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
		const newProgress = ((finished / selectedCard.checklist.checkItems.length) * 100).toFixed(0)
		if (newProgress === 'NaN') {
			setProgress(0)
		} else {
			setProgress(newProgress)
		}
	}

	return (
		<table style={{
			backgroundColor: 'transparent', marginLeft: '0px', marginTop: '10px', width: '100%'
		}}
		>
			<thead>
				<tr
					className="container"
					style={{
						display: 'block', width: '100%', margin: '0px', padding: '0px'
					}}
				>
					<td className="row">
						<ChecklistTitle
							listTitle={selectedCard.checklist.name}
							id="0"
							card={false}
							classType="checklist"
							updateFunction={updateChecklistFunc}
							autoFocus={true}
						/>
						<Button
							warning_light
							className="col"
							style={{
								maxWidth: '30px', margin: '0px', marginRight: '1rem', fontWeight: '900 !important'
							}}
							onMouseDown={deleteChecklist}
						>
							✕
						</Button>
					</td>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>
						<ProgressBar progress={progress} />
					</td>
				</tr>
			</tbody>
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
