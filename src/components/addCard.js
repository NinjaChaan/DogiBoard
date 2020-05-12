import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import { connect } from 'react-redux'
import { addCard } from '../redux/actions/index'
import './cardList.css'

const AddCard = ({ listId, changeShowAddAnother, dispatch }) => {
	const [cardText, setCardText] = useState('')
	const field = document.getElementById('cardTitle')
	if (field) {
		field.style.height = 'inherit'

		// Get the computed styles for the element
		const computed = window.getComputedStyle(field)

		// Calculate the height
		const height = parseInt(computed.getPropertyValue('border-top-width'), 10)
			+ parseInt(computed.getPropertyValue('padding-top'), 10)
			+ field.scrollHeight
			+ parseInt(computed.getPropertyValue('padding-bottom'), 10)
			+ parseInt(computed.getPropertyValue('border-bottom-width'), 10)

		field.style.height = `${height - 16}px`

		// if (height > 168) {
		// 	field.style.overflow = 'auto'
		// 	if (document.activeElement === field) {
		// 		field.scrollTop = field.scrollHeight
		// 	} else {
		// 		field.scrollTop = 0
		// 	}
		// } else {
		// 	field.style.overflow = 'hidden'
		// }
	}

	const createItem = () => {
		if (cardText.length > 0) {
			let newCard = {}

			newCard = {
				name: cardText,
				listId
			}
			changeShowAddAnother(true)
			dispatch(addCard(newCard))
		}
		setCardText('')
	}

	const handleSubmit = (event) => {
		event.preventDefault()
		createItem()
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
			handleSubmit(event)
		}
	}

	return (
		<div className="btn-add-another-card">
			<form onSubmit={handleSubmit}>
				<div>
					<div className="add-card-text">
						<textarea
							id="cardTitle"
							className="textarea-add-card"
							autoFocus
							spellCheck="false"
							maxLength="200"
							placeholder="Enter a title for this card"
							value={cardText}
							onKeyPress={handleKeyPress}
							onChange={handleTextChange}
							onBlur={() => { createItem() }}
						/>
					</div>
				</div>
				<div className="div-add-card">
					<Button className="btn-add-card" variant="success" type="submit">Add card</Button>
					<Button className="btn-close-add-card" variant="light" onMouseDown={() => changeShowAddAnother(true)}>✕</Button>
				</div>
			</form>
		</div>
	)
}

export default connect()(AddCard)
