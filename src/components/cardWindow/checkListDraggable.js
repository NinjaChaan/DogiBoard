/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { connect, useSelector } from 'react-redux'
import styled from 'styled-components'
import { isMobile } from 'react-device-detect'
import Button from '../Button'
import CheckItemTitle from './checkItemTitle'
import { setSelectedCard, updateChecklist } from '../../redux/actions/index'

const CheckButton = styled(Button)`
	color: ${(props) => (props.done && 'white') || 'transparent'};
	background-color: ${(props) => (!props.done && 'transparent')};
	border: 2px solid ${(props) => props.theme.colors.success.backgroundColor};
	width: 25px;
	height: 25px;
	font-size: 1rem;
	padding-bottom: 5px;
	padding: 0;
	&:hover{
		color: ${() => (!isMobile && 'white')};
		border: 2px solid ${(props) => (props.theme.colors.success.backgroundColor)};
	}
	&:focus{
		border: 2px solid ${(props) => (props.theme.colors.success.backgroundColor)};
		background-color: ${(props) => (!props.done && isMobile && 'transparent')};
	}
	&:active{
		border: 2px solid ${(props) => (props.theme.colors.success.backgroundColor)};
		background-color: ${(props) => (!props.done && isMobile && 'transparent')};
	}
`

const OptionsButton = styled(CheckButton)`
	color: black;
	background-color: 'transparent';
	max-width: 25px;
	max-height: 25px;
	font-size: 1rem;
	padding-bottom: 5px;
	padding: 0;
	border: none;
	&:hover{
	border: none;
		color: ${() => (!isMobile && 'white')};
	}
	&:focus{
	border: none;
		background-color: ${(props) => (!props.done && isMobile && 'transparent')};
	}
	&:active{
	border: none;
		background-color: ${(props) => (!props.done && isMobile && 'transparent')};
	}
`

const mapStateToProps = (state) => ({
	selectedCard: state.selectedCard
})

const CheckListDraggable = ({
	i, checkItem, dispatch, calculateProgress
}) => {
	const selectedCard = useSelector((state) => state.selectedCard)
	const [editing, setEditing] = useState(false)
	const [dragging, setDragging] = useState(false)
	const [hovering, setHovering] = useState(false)

	const toggleItemDone = () => {
		const newList = {
			name: selectedCard.checklist.name,
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

		// console.log('new lists', newChecklist)
		// console.log('new card', newCard)
		dispatch(setSelectedCard(newCard))
		dispatch(updateChecklist(newChecklist))
	}

	const deleteCheckItem = () => {
		const newList = {
			name: selectedCard.checklist.name,
			checkItems: selectedCard.checklist.checkItems.filter((item) => item !== checkItem)
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
		console.log('sendind list with done', dispatch(updateChecklist(newChecklist)))

		calculateProgress()
	}

	const focusTitle = () => {
		document.getElementById(`checkItemTitle${checkItem.id}`).focus()
	}

	const unFocusTitle = () => {
		const titleElement = document.getElementById(`checkItemTitle${checkItem.id}`)
		titleElement.blur()
	}

	const hover = () => {
		setHovering(true)
	}

	const unhover = () => {
		setHovering(false)
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
				// style={{ width: '100%' }}
				>
					<td
						className="container mx-0"
						style={{ width: 'inherit' }}
						onMouseOver={hover}
						onMouseLeave={unhover}
					>
						<div
							className="dragHandle"
							{...provided.dragHandleProps}
							onClick={() => focusTitle()}
							onMouseDown={() => unFocusTitle()}
						/>
						<div className="row">
							<div className="">
								<CheckButton
									success
									done={checkItem.done}
									// className={checkItem.done
									// 	? 'btn-checklistToggle-toggled'
									// 	: 'btn-checklistToggle'}
									onMouseDown={toggleItemDone}
								>
									✓
								</CheckButton>
							</div>
							<div className="col pl-2 pr-2" style={{ width: '100%', display: 'flex' }}>
								<CheckItemTitle selectedCard={selectedCard} checkItem={checkItem} setEditing={setEditing} editing={editing} />
							</div>
							{hovering
								? <OptionsButton warning_light className="col" onMouseDown={deleteCheckItem}>✕</OptionsButton>
								: <OptionsButton style={{ visibility: 'hidden' }} warning_light className="col" onMouseDown={deleteCheckItem}>✕</OptionsButton>}
						</div>
					</td>
				</tr>
			)}
		</Draggable>
	)
}

export default connect(null, null)(CheckListDraggable)
