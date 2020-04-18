import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import './cardList.css'

const AddItem = ({ cards, addItem, changeShowAddAnother, buttonText, defaultText, classType }) => {
	const [cardText, setCardText] = useState('')
	const textArea = document.querySelector('textarea')
	const textRowCount = textArea ? textArea.value.split("\n").length : 0
	let textRowCountFinal = 0
	if (textArea && textArea.value.match(/(.|[\r\n]){1,26}/g)) {
		textRowCountFinal = textRowCount + textArea.value.match(/(.|[\r\n]){1,26}/g).length
	}
	const rows = textRowCountFinal - 1
	console.log(rows)

	const createItem = (event) => {
		event.preventDefault()
		if (cardText.length > 0) {
			let newCard = {}
			if (classType === 'card') {
				newCard = {
					text: cardText,
					id: Math.floor(Math.random() * 999999)
				}
			} else {
				newCard = {
					text: cardText,
					cards: []
				}
			}
			addItem(newCard)
			setCardText('')
		}
	}

	const handleTextChange = (event) => {
		console.log(event)
		if (event.key === 'Enter') {
			event.preventDefault()
		}
		setCardText(event.target.value)
	}

	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			//document.getElementById('listTitle').blur()
			createItem(event)
		}
	}

	return (
		<div className={`btn-add-another-${classType}`} >
			<form onSubmit={createItem}>
				<div>
					<br />
					<div className='add-card-text'>
						<textarea
							id='listTitle'
							autoFocus={true}
							className={`textarea-add-${classType}`}
							spellCheck='false'
							placeholder={defaultText}
							rows={cardText.length > 0 ? rows : 1}
							value={cardText}
							onKeyPress={handleKeyPress}
							onChange={handleTextChange}
						/>
					</div>
				</div>
				<div className={`div-add-${classType}`}>
					<Button className={`btn-add-${classType}`} variant='success' type="submit">{buttonText}</Button>
					<Button className='btn-close-add-card' variant='light' onClick={() => changeShowAddAnother(true)}>✕</Button>
				</div>
			</form>
		</div>
	)
}

export default AddItem