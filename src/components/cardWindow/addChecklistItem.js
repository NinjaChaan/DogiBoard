import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import '../cardList.css'

const AddChecklistItem = ({ changeShowAddAnother, clickFunction }) => {
	const [cardText, setCardText] = useState('')
	const field = document.getElementById('checkListTitle')
	if (field) {
		field.style.height = 'inherit'

		if (field.value.length === 0) {
			field.style.height = 64
		}

		// Get the computed styles for the element
		const computed = window.getComputedStyle(field)

		// Calculate the height
		const height = parseInt(computed.getPropertyValue('border-top-width'), 10)
			+ parseInt(computed.getPropertyValue('padding-top'), 10)
			+ field.scrollHeight
			+ parseInt(computed.getPropertyValue('padding-bottom'), 10)
			+ parseInt(computed.getPropertyValue('border-bottom-width'), 10)

		field.style.height = `${height - 12}px`

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
			let newCheckItem = {}

			newCheckItem = {
				text: cardText,
				id: Math.floor(Math.random() * 99999),
				done: false
			}
			clickFunction(newCheckItem)
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

	const blur = () => {
		console.log('blurred')
		document.getElementById('checkListTitle').style.height = '64px !important'
		createItem()
	}

	return (
		<div className="btn-add-another-checkList">
			<div>
				<div className="add-checkList-text">
					<textarea
						id="checkListTitle"
						className="textarea-add-checkList"
						autoFocus
						spellCheck="false"
						maxLength="200"
						placeholder="Enter a description for this item"
						value={cardText}
						onKeyPress={handleKeyPress}
						onChange={handleTextChange}
						onBlur={blur}
					/>
				</div>
			</div>
			<div className="div-add-checkList">
				<Button className="btn-add-checkList" variant="success">Add item</Button>
				<Button className="btn-close-add-checkList" variant="light" onMouseDown={() => changeShowAddAnother(true)}>✕</Button>
			</div>
		</div>
	)
}

export default AddChecklistItem
