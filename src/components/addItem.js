import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import { connect } from 'react-redux'
import { addCard, addList } from '../actions/index'
import './cardList.css'

const AddItem = ({
	listId, changeShowAddAnother, buttonText, defaultText, classType, dispatch
}) => {
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

		field.style.height = `${height}px`

		if (field.scrollHeight > 168) {
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
			if (classType === 'card') {
				newCard = {
					text: cardText,
					listId
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
							className={`textarea-add-${classType}`}
							autoFocus
							spellCheck="false"
							maxLength={classType === 'card' ? '200' : '25'}
							placeholder={defaultText}
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
