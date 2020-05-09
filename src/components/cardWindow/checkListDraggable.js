import React, { useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { isMobile } from 'react-device-detect'
import Button from '../Button'
import CheckItemTitle from './checkItemTitle'
import { device } from '../../devices'
import { setSelectedCard, updateChecklist } from '../../redux/actions/index'

const CheckButton = styled(Button)`
	color: ${(props) => (props.done && 'white') || 'transparent'};
	background-color: ${(props) => (!props.done && 'transparent')};
	border: 2px solid ${(props) => ((props.done && props.theme.colors.success.backgroundColor) || props.theme.colors.primary.backgroundColor)};
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

const mapStateToProps = (state) => ({
	selectedCard: state.selectedCard
})

const CheckListDraggable = ({
	i, checkItem, selectedCard, dispatch, calculateProgress
}) => {
	const [editing, setEditing] = useState(false)
	const [dragging, setDragging] = useState(false)

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
					style={{ display: 'block', width: '100%' }}
				>
					<td className=" container mx-0" style={{ display: 'block', width: '100%' }}>
						<div className="row">
							<div
								className="dragHandle"
								{...provided.dragHandleProps}
								onClick={() => focusTitle()}
								onMouseDown={() => unFocusTitle()}
							/>
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
							<div className="col pl-2 pr-0" style={{ width: '100%' }}>
								<CheckItemTitle selectedCard={selectedCard} checkItem={checkItem} setEditing={setEditing} editing={editing} />
							</div>

						</div>
					</td>
				</tr>
			)}
		</Draggable>
	)
}

export default connect(mapStateToProps, null)(CheckListDraggable)
