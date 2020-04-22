import React, { useState } from 'react'
import { connect } from 'react-redux'
import { updateCard, setSelectedCard } from '../actions/index'

const mapStateToProps = (state) => {
	//console.log('state at cardwindiw', state.selectedCard.text)
	return { selectedCard: state.selectedCard.text }
}

const CardTitle = ({ selectedCard, id, dispatch, listId }) => {
	const [listTitleClass, setListTitleClass] = useState('textarea-list-title')

	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault()
			document.getElementById(`listTitle${id.toString()}`).blur()
		}
	}

	const handleTextChange = (event) => {
		const titleElement = document.getElementById(`listTitle${id.toString()}`)
		if (event.key === 'Enter') {
			event.preventDefault()
		}
		titleElement.value = event.target.value
		const text = titleElement.value
		const newSelection = {
			text,
			id,
			listId
		}

		console.log(dispatch(setSelectedCard(newSelection)))
	}

	const focusTitle = () => {
		const titleElement = document.getElementById(`listTitle${id.toString()}`)
		titleElement.focus()
		titleElement.value = ''
		titleElement.value = { selectedCard }
		setListTitleClass('textarea-list-title-editing')
	}

	const blurTitle = () => {
		setListTitleClass('textarea-list-title')
		console.log('update card', dispatch(updateCard({ text: document.getElementById(`listTitle${id.toString()}`).value, id, listId })))
	}

	return (
		<textarea
			value={selectedCard}
			onChange={handleTextChange}
			id={`listTitle${id.toString()}`}
			onFocus={focusTitle}
			onBlur={blurTitle}
			className={listTitleClass}
			maxLength={25}
			spellCheck="false"
			onKeyPress={handleKeyPress}
		/>
	)
}
export default connect(mapStateToProps, null)(CardTitle)
