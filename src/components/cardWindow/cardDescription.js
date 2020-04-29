import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import { connect } from 'react-redux'
import { updateCardDescription } from '../../actions/index'

const mapStateToProps = (state) => {
	console.log('state at cardwindiw', state.selectedCard)
	const description = state.selectedCard.description || ''
	return (
		({
			selectedCard: state.selectedCard,
			description
		})
	)
}

const CardDescription = ({ selectedCard, description, dispatch }) => {
	const [descriptionText, setDescriptionText] = useState('')
	const [oldText, setOldText] = useState(selectedCard.description)
	const [showButtons, setShowButtons] = useState(false)

	useEffect(() => {
		setDescriptionText(description)
	}, [selectedCard])

	const field = document.getElementById('description')
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


	const handleTextChange = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault()
		}
		setDescriptionText(event.target.value)
	}

	const submitCardDescription = () => {
		const updatedCard = {
			text: selectedCard.text,
			description: document.getElementById('description').value,
			id: selectedCard.id,
			listId: selectedCard.listId
		}
		setShowButtons(false)
		console.log('update card DESC', dispatch(updateCardDescription(updatedCard)))
	}

	const focus = () => {
		setOldText(field.value)
		setShowButtons(true)
	}

	const xButton = () => {
		console.log('X')
		field.value = oldText
		setShowButtons(false)
	}
	return (
		<div>
			<textarea
				value={descriptionText}
				id="description"
				className="textarea-card-description"
				onFocus={focus}
				onBlur={submitCardDescription}
				placeholder="Enter a description"
				spellCheck="false"
				maxLength="1000"
				onChange={handleTextChange}
			/>

			{showButtons
				? (
					<div>
						<Button className="btn-save-description" variant="success" onClick={submitCardDescription}>Save</Button>
						<Button className="btn-close-description" variant="light" onMouseDown={xButton}>✕</Button>
					</div>
				)
				: null}

		</div>
	)
}

export default connect(mapStateToProps, null)(CardDescription)
