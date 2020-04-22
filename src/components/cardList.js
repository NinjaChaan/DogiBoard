import React, { useState } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import Button from 'react-bootstrap/Button'
import CardDraggable from './cardDraggable'
import AddItem from './addItem'
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
					: <AddItem listId={id} changeShowAddAnother={changeShowAddAnother} buttonText="Add card" defaultText="Enter a title for this card" classType="card" />}
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
	// console.log('list ', id, ' cards: ', cards)
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
									/>
									{/* <textarea

										value={title}
										onChange={handleTextChange}
										id={`listTitle${id.toString()}`}
										onBlur={() => setListTitleClass('textarea-list-title')}
										className={listTitleClass}
										maxLength={25}
										spellCheck="false"
										onKeyPress={handleKeyPress}
										onClick={() => focusTitle}
									/> */}
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
