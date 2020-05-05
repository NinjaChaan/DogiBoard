import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import { connect } from 'react-redux'
import { addList } from '../redux/actions/index'
import './cardList.css'

const AddList = ({ changeShowAddAnother, dispatch }) => {
	const [cardText, setCardText] = useState('')
	const field = document.getElementById('listTitle')
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

		field.style.height = `${height - 14}px`

		if (height > 168) {
			field.style.overflow = 'auto'
			if (document.activeElement === field) {
				field.scrollTop = field.scrollHeight
			} else {
				field.scrollTop = 0
			}
		} else {
			field.style.overflow = 'hidden'
		}
	}

	const createItem = () => {
		if (cardText.length > 0) {
			let newCard = {}
			newCard = {
				text: cardText,
				cards: []
			}
			changeShowAddAnother(true)
			dispatch(addList(newCard))
		}
		setCardText('')
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
		<div className="btn-add-another-list">
			<form onSubmit={handleSubmit}>
				<div>
					<div className="add-list-text">
						<textarea
							id="listTitle"
							className="textarea-add-list"
							autoFocus
							spellCheck="false"
							maxLength="25"
							placeholder="Enter a title for this list"
							value={cardText}
							onKeyPress={handleKeyPress}
							onChange={handleTextChange}
							onBlur={() => { createItem() }}
						/>
					</div>
				</div>
				<div className="div-add-list">
					<Button className="btn-add-list" variant="success" type="submit">Add list</Button>
					<Button className="btn-close-add-card" variant="light" onMouseDown={() => changeShowAddAnother(true)}>✕</Button>
				</div>
			</form>
		</div>
	)
}

export default connect()(AddList)
