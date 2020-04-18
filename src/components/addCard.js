import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import './cardList.css'

const AddCard = ({ cards, addCard, changeShowAddAnother }) => {
	const [cardText, setCardText] = useState('')
	const textArea = document.querySelector('textarea')
	const textRowCount = textArea ? textArea.value.split("\n").length : 0
	let textRowCountFinal = 0
	if(textArea && textArea.value.match(/(.|[\r\n]){1,26}/g)){
		textRowCountFinal = textRowCount + textArea.value.match(/(.|[\r\n]){1,26}/g).length
	}
	const rows = textRowCountFinal-1
	console.log(rows)
	const createCard = (event) => {
		event.preventDefault()
		const newCard = {
			text: cardText
		}
		console.log(newCard.text)
		addCard(newCard)
	}

	const handleTextChange = (event) => {
		setCardText(event.target.value)
	}
	return (
		<div>
			<form onSubmit={createCard}>
				<div>
					<br />
					<div contenteditable className='add-card-text'>
						<textarea
							className='textarea-add-card'
							placeholder='Enter a title for this card'
							rows={cardText.length > 0 ? rows : 1}
							value={cardText}
							onChange={handleTextChange}
						/>
					</div>
				</div>
				<div>
					<Button className='btn-add-card' variant='success' type="submit">Add card</Button>
					<Button className='btn-close-add-card' variant='light' onClick={() => changeShowAddAnother(true)}>✕</Button>
				</div>
			</form>

		</div>
	)
}

export default AddCard