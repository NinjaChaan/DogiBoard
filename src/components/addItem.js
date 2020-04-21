import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import { connect } from 'react-redux'
import { addCard, addList } from '../actions/index'
import './cardList.css'

const AddItem = ({
	listId, changeShowAddAnother, buttonText, defaultText, classType, dispatch
}) => {
	const [cardText, setCardText] = useState('')
	const textArea = document.querySelector('textarea')
	const textRowCount = textArea ? textArea.value.split('\n').length : 0
	let textRowCountFinal = 0
	if (textArea && textArea.value.match(/(.|[\r\n]){1,26}/g)) {
		textRowCountFinal = textRowCount + textArea.value.match(/(.|[\r\n]){1,26}/g).length
	}
	const rows = textRowCountFinal - 1

	const createItem = () => {
		if (cardText.length > 0) {
			let newCard = {}
			if (classType === 'card') {
				newCard = {
					text: cardText,
					id: Math.floor(Math.random() * 999999),
					listId: listId
				}
				changeShowAddAnother(true)
				dispatch(addCard(newCard))
			} else {
				newCard = {
					text: cardText,
					cards: []
				}
				changeShowAddAnother(true)
				dispatch(addList(newCard))
			}
			setCardText('')
		}
	}

	const handleSubmit = (event) => {
		event.preventDefault()
		createItem()
		// dispatch({
		// 	type: 'ADD_TODO',
		// 	id: Math.floor(Math.random() * 999999),
		// 	text: cardText
		// })
	}

	const handleTextChange = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault()
		}
		setCardText(event.target.value)
	}

	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault()
			// document.getElementById('listTitle').blur()
			handleSubmit(event)
		}
	}

	return (
		<div className={`btn-add-another-${classType}`}>
			<form onSubmit={handleSubmit}>
				<div>
					<br />
					<div className="add-card-text">
						<textarea
							id="listTitle"
							autoFocus
							className={`textarea-add-${classType}`}
							spellCheck="false"
							placeholder={defaultText}
							rows={cardText.length > 0 ? rows : 1}
							value={cardText}
							onKeyPress={handleKeyPress}
							onChange={handleTextChange}
							onBlur={() => { createItem() }}
						/>
					</div>
				</div>
				<div className={`div-add-${classType}`}>
					<Button className={`btn-add-${classType}`} variant="success" type="submit">{buttonText}</Button>
					<Button className="btn-close-add-card" variant="light" onClick={() => changeShowAddAnother(true)}>✕</Button>
				</div>
			</form>
		</div>
	)
}

export default connect()(AddItem)
