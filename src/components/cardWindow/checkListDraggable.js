import React, { useState } from 'react'
import Card from 'react-bootstrap/Card'
import { Draggable } from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import Button from 'react-bootstrap/Button'
import CheckItemTitle from './checkItemTitle'
import { setSelectedCard, updateChecklist } from '../../actions/index'

const mapStateToProps = (state) =>
	// console.log('state at cardwindiw', state.selectedCard.text)
	({
		selectedCard: state.selectedCard
	})

const CheckListDraggable = ({ i, checkItem, selectedCard, dispatch, calculateProgress }) => {
	const [editing, setEditing] = useState(false)
	const [dragging, setDragging] = useState(false)

	console.log('calculateProgress', calculateProgress)
	const toggleItemDone = () => {
		console.log('toggle is', checkItem.done)
		const newList = {
			text: selectedCard.checklist.text,
			checkItems: selectedCard.checklist.checkItems
		}
		checkItem.done = !checkItem.done
		newList.checkItems.map((item) => {
			if (item.id === checkItem.id) {
				item.done = checkItem.done
			}
		})

		const newChecklist = {
			checklist: newList,
			id: selectedCard.id,
			listId: selectedCard.listId
		}
		const newCard = {
			...selectedCard,
			checklist: newList
		}

		calculateProgress()

		console.log('new lists', newChecklist)
		console.log('new card', newCard)
		console.log('sendind select', dispatch(setSelectedCard(newCard)))
		console.log('sendind list with done', dispatch(updateChecklist(newChecklist)))
	}

	const focusTitle = () => {
		document.getElementById(`checkItemTitle${checkItem.id}`).focus()
	}

	const unFocusTitle = () => {
		const titleElement = document.getElementById(`checkItemTitle${checkItem.id}`)
		titleElement.blur()
	}

	if (dragging) {
		unFocusTitle()
	}

	return (
		<Draggable draggableId={checkItem.id.toString()} index={i}>
			{(provided) => (
				<tr
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
				>
					<td style={{ display: 'block', width: '500px' }}>
						<div
							className="dragHandle"
							{...provided.dragHandleProps}
							onClick={() => focusTitle()}
							onMouseDown={() => unFocusTitle()}
						/>
						<div className="checklistToggle">
							<Button
								className={checkItem.done
									? 'btn-checklistToggle-toggled'
									: 'btn-checklistToggle'}
								onMouseDown={toggleItemDone}
							>
								{checkItem.done ? '✓' : ''}
							</Button>
						</div>
						<div style={{ width: '100%' }}>
							{/* <Card.Text>
												{checkItem.text}
											</Card.Text> */}
							<CheckItemTitle selectedCard={selectedCard} checkItem={checkItem} setEditing={setEditing} editing={editing} />
						</div>
						{/* {editing
							? <CheckItemTitle selectedCard={selectedCard} checkItem={checkItem} setEditing={setEditing} />
							: (
								// <Card
								// 	className="card-body-checklist"
								// 	body
								// 	padding="30px"
								// 	onClick={() => { setEditing(true) }}
								// 	style={{ marginLeft: '0px !important', float: 'right' }}
								// >


								
								// </Card>
							)} */}
					</td>
				</tr >
			)
			}
		</Draggable >
	)
}

export default connect(mapStateToProps, null)(CheckListDraggable)
