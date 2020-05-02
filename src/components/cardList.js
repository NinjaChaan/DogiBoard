import React, { useState } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import Button from 'react-bootstrap/Button'
import CardDraggable from './cardDraggable'
import AddCard from './addCard'
import ListTitle from './listTitle'
import './cardList.css'


const CardList = ({
	cards, innerRef, placeholder, showingAddAnother, changeShowAddAnother, id
}) => (
	<tbody ref={innerRef}>
		{cards.map((card, i) => <CardDraggable key={card.id} i={i} card={card} />)}
		{placeholder}
		<tr>
			<td>
				{showingAddAnother
					? (
						<Button className="btn-add-another-card" variant="link" onClick={() => changeShowAddAnother(false)}>
							<font size="4">＋</font>
							Add another card
						</Button>
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
