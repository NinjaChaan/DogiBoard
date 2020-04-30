import React, { useState } from 'react'
import { connect } from 'react-redux'
import { updateCardTitle, setSelectedCard } from '../../actions/index'

const mapStateToProps = (state) =>
	// console.log('state at cardwindiw', state.selectedCard.text)
	({
		selectedCard: state.selectedCard
	})


const CardTitle = ({
	selectedCard, id, dispatch, listId
}) => {
	const [titleText, setTitleText] = useState('')
	const [listTitleClass, setListTitleClass] = useState('textarea-card-title')

	const calculateHeight = () => {
		const field = document.getElementById('cardTitle')
		if (field) {
			field.style.height = '25px'
			// Get the computed styles for the element
			const computed = window.getComputedStyle(field)

			if (field.value === '[object Object]') {
				field.value = selectedCard.text
			}

			// Calculate the height
			const height = parseInt(computed.getPropertyValue('border-top-width'), 10)
				+ parseInt(computed.getPropertyValue('padding-top'), 10)
				+ field.scrollHeight
				+ parseInt(computed.getPropertyValue('padding-bottom'), 10)
				+ parseInt(computed.getPropertyValue('border-bottom-width'), 10)

			field.style.height = `${height - 10}px`

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
	}
	calculateHeight()


	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault()
			document.getElementById('cardTitle').blur()
		}
	}

	const handleTextChange = (event) => {
		calculateHeight()
		const titleElement = document.getElementById('cardTitle')
		if (event.key === 'Enter') {
			event.preventDefault()
		}
		titleElement.value = event.target.value
		const text = titleElement.value
		const newSelection = {
			...selectedCard,
			text
		}
		console.log('set', dispatch(setSelectedCard(newSelection)))
	}

	const focusTitle = () => {
		const titleElement = document.getElementById('cardTitle')
		titleElement.focus()
		titleElement.value = selectedCard.text
		setListTitleClass('textarea-card-title-editing')
	}

	const blurTitle = () => {
		setListTitleClass('textarea-card-title')
		console.log('update card', dispatch(updateCardTitle({ text: document.getElementById('cardTitle').value, id, listId })))
	}
	return (
		<textarea
			value={selectedCard.text}
			onChange={handleTextChange}
			id="cardTitle"
			onFocus={focusTitle}
			onBlur={blurTitle}
			maxLength="200"
			className={listTitleClass}
			spellCheck="false"
			onKeyPress={handleKeyPress}
		/>
	)
}
export default connect(mapStateToProps, null)(CardTitle)
