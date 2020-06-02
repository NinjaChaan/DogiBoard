/* eslint-disable no-shadow */
import React, { useState, Suspense } from 'react'
import styled from 'styled-components'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import Button from './Button'
import AddCard from './addCard'
import ListTitle from './listTitle'
import './cardList.css'
import LoadingAnimation from './loadingAnimation'
const CardDraggable = React.lazy(() => import('./cardDraggable'))

const LinkButton = styled(Button)`
	width: auto;
	display: inline-block;
	justify-content: left;
	padding-bottom: 30px;
`

const CardList = ({
	cards, innerRef, placeholder, showingAddAnother, changeShowAddAnother, id
}) => (
		<tbody ref={innerRef}>

			<Suspense fallback={<tr><td><LoadingAnimation /></td></tr>}>
				{cards.map((card, i) => (
					<CardDraggable key={card.id} i={i} card={card} />
				))}
			</Suspense>

			{placeholder}
			<tr>
				<td style={{ paddingTop: '5px' }}>
					{showingAddAnother
						? (
							<LinkButton link_transparent style={{ marginBottom: '0px', height: '48px' }} className="btn-add-another-card" variant="link" onClick={() => changeShowAddAnother(false)}>
								<font size="4">＋</font>
							Add another card
							</LinkButton>
						)
						: <AddCard listId={id} changeShowAddAnother={changeShowAddAnother} />}
				</td>
			</tr>
		</tbody>
	)

const CardListContainer = ({
	listTitle, cards, index, setCards, id, dragging
}) => {
	const [showingAddAnother, setShowingAddAnother] = useState(true)

	const createCard = (newCard) => {
		setCards(cards.concat(newCard))
	}

	const changeShowAddAnother = (show) => {
		setShowingAddAnother(show)
	}

	const focusTitle = () => {
		document.getElementById(`listTitle${id.toString()}`).focus()
	}

	const unFocusTitle = () => {
		const titleElement = document.getElementById(`listTitle${id.toString()}`)
		titleElement.blur()
	}

	if (dragging) {
		unFocusTitle()
	}

	return (
		<Draggable draggableId={`list-${id.toString()}`} index={index}>
			{(provided) => (
				<td
					className="draggableList"
					ref={provided.innerRef}
					{...provided.draggableProps}
				>

					<table className="cardList">
						<thead>
							<tr>
								<td>
									<div
										aria-label="Edit title"
										className="dragHandle"
										{...provided.dragHandleProps}
										onClick={() => focusTitle()}
										onMouseDown={() => unFocusTitle()}
									/>
									<ListTitle
										listTitle={listTitle}
										id={id}
										card={false}
										classType="list"
									/>
								</td>
							</tr>
						</thead>

						<Droppable droppableId={index.toString()} type="card">
							{(provided) => (
								<CardList
									id={id}
									cards={cards}
									showingAddAnother={showingAddAnother}
									changeShowAddAnother={changeShowAddAnother}
									createCard={createCard}
									innerRef={provided.innerRef}
									placeholder={provided.placeholder}
									{...provided.droppableProps}
								/>
							)}
						</Droppable>
					</table>
				</td>
			)}
		</Draggable>
	)
}
export default CardListContainer
