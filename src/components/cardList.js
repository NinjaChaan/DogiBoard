import React, { useState } from 'react'
import {Droppable, Draggable } from 'react-beautiful-dnd'
//import Card from './card'
import CardDraggable from './cardDraggable'
import Button from 'react-bootstrap/Button'
import AddItem from './addItem'
import './cardList.css'

const CardList = ({ cards, innerRef, placeholder, showingAddAnother, changeShowAddAnother, createCard }) => {
	return (
		<tbody ref={innerRef}>
			{cards.map((card, i) =>
				<CardDraggable key={card.id} text={card.text} i={i} id={card.id} />
			)}
			{placeholder}
			<tr>
				<td>
					{showingAddAnother
						? <Button className='btn-add-another-card' variant='link' onClick={() => changeShowAddAnother(false)}>
							<font size='4'>＋</font>Add another card
				 			</Button>
						: <AddItem addItem={createCard} changeShowAddAnother={changeShowAddAnother} buttonText='Add card' defaultText='Enter a title for this card' classType='card' />
					}
				</td>
			</tr>
		</tbody>
	)
}

const CardListContainer = ({ listTitle, cards, index, setCards, id, dragging}) => {
	const [showingAddAnother, setShowingAddAnother] = useState(true)
	//const [cards, setCards] = useState(cardList ?? [])
	const [title, setTitle] = useState(listTitle)
	const [listTitleClass, setListTitleClass] = useState('textarea-list-title')

	const createCard = (newCard) => {
		setCards(cards.concat(newCard))
	}

	const changeShowAddAnother = (show) => {
		setShowingAddAnother(show)
	}

	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			document.getElementById('listTitle'+id.toString()).blur()
		}
	}

	const handleTextChange = (event) => {
		console.log(event)
		if (event.key === 'Enter') {
			event.preventDefault()
		}
		setTitle(event.target.value)
	}

	const focusTitle = () => {
		const title = document.getElementById('listTitle'+id.toString())
		title.focus()
		title.value=''
		title.value={title}
		setListTitleClass('textarea-list-title-editing')
	}

	const unFocusTitle = () => {
		document.getElementById('listTitle'+id.toString()).blur()
		setListTitleClass('textarea-list-title')
	}

	if(dragging){
		unFocusTitle()
	}

	return (
		<Draggable draggableId={'list-'+id.toString()} index={index}>
			{(provided) => (
				<td 
				ref={provided.innerRef}
					{...provided.draggableProps}>
					
					<table className='cardList'>
						<thead >
							<tr>
								<td>
									<div 
									className='dragHandle' 
									{...provided.dragHandleProps}
									onClick={()=> focusTitle()}
									onMouseDown={()=> unFocusTitle()}
									>

									</div>
									<textarea
									
										value={title}
										onChange={handleTextChange}
										id={'listTitle'+id.toString()}
										onBlur={() => setListTitleClass('textarea-list-title')}
										className={listTitleClass}
										maxLength={25}
										spellCheck='false'
										onKeyPress={handleKeyPress}
										onClick={() => focusTitle}
									>
									</textarea>
								</td>
							</tr>
						</thead>

						{
							<Droppable droppableId={index.toString()} type="card">
								{provided => (
									<CardList cards={cards}
										showingAddAnother={showingAddAnother}
										changeShowAddAnother={changeShowAddAnother}
										createCard={createCard}
										innerRef={provided.innerRef}
										placeholder={provided.placeholder}
										{...provided.droppableProps}>


									</CardList>
								)}
							</Droppable>
						}
					</table>
				</td >
			)}</Draggable>
	)
}

export default CardListContainer