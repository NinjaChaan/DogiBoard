import React, { useState } from 'react'
import { connect, useSelector } from 'react-redux'
import { updateCard, setSelectedCard } from '../../redux/actions/index'

// const mapStateToProps = (state) => ({
// 	selectedCard: state.selectedCard
// })


const CardTitle = ({ id, dispatch, listId }) => {
	const selectedCard = useSelector((state) => state.selectedCard)
	const [listTitleClass, setListTitleClass] = useState('textarea-card-title')

	const calculateHeight = () => {
		const field = document.getElementById('cardTitle')
		if (field) {
			field.style.height = '25px'
			// Get the computed styles for the element
			const computed = window.getComputedStyle(field)

			if (field.value === '[object Object]') {
				field.value = selectedCard.name
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
		const name = titleElement.value
		const newSelection = {
			...selectedCard,
			name
		}
		console.log('set', dispatch(setSelectedCard(newSelection)))
	}

	const focusTitle = () => {
		const titleElement = document.getElementById('cardTitle')
		titleElement.focus()
		titleElement.value = selectedCard.name
		setListTitleClass('textarea-card-title-editing')
	}

	const blurTitle = () => {
		setListTitleClass('textarea-card-title')
		const name = document.getElementById('cardTitle').value
		const newSelection = {
			...selectedCard,
			name
		}
		console.log('update card', dispatch(updateCard(newSelection)))
	}
	return (
		<textarea
			value={selectedCard.name}
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
export default connect(null, null)(CardTitle)
