import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { setSelectedCard, updateChecklist } from '../../redux/actions/index'

const mapStateToProps = (state) => ({
	selectedCard: state.selectedCard,
	title: state.selectedCard.checklist.name
})


const ChecklistTitle = ({ selectedCard, title, dispatch }) => {
	const [titleText, setTitleText] = useState('Checklist')
	const [listTitleClass, setListTitleClass] = useState('textarea-checklist-title')

	useEffect(() => {
		setTitleText(title)
	}, [selectedCard])

	const calculateHeight = () => {
		const field = document.getElementById('checlistTitle')
		if (field) {
			field.style.height = '30px'
			// Get the computed styles for the element
			const computed = window.getComputedStyle(field)

			if (field.value === '[object Object]') {
				field.value = title
			}

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
	}
	calculateHeight()

	const submitChecklistTitle = () => {
		const titleElement = document.getElementById('checlistTitle')
		const list = selectedCard.checklist
		list.name = titleElement.value
		console.log('list', list)
		const newCard = {
			...selectedCard,
			checklist: list
		}

		const newChecklist = {
			checklist: list,
			id: selectedCard.id,
			listId: selectedCard.listId
		}

		console.log(dispatch(setSelectedCard(newCard)))
		console.log(dispatch(updateChecklist(newChecklist)))
	}

	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault()
			submitChecklistTitle()
			document.getElementById('checlistTitle').blur()
		}
	}

	const handleTextChange = (event) => {
		calculateHeight()
		if (event.key === 'Enter') {
			event.preventDefault()
		}
		console.log(event.target.value)
		setTitleText(event.target.value)
	}

	const focusTitle = () => {
		const titleElement = document.getElementById('checlistTitle')
		const t = selectedCard.checklist.name
		console.log('selected', t)
		titleElement.focus()
		titleElement.value = { t }
		setListTitleClass('textarea-checklist-title-editing')
	}

	const blurTitle = () => {
		setListTitleClass('textarea-checklist-title')
		submitChecklistTitle()
	}

	return (
		<textarea
			value={titleText}
			onChange={handleTextChange}
			id="checlistTitle"
			onFocus={focusTitle}
			onBlur={blurTitle}
			maxLength="200"
			className={`${listTitleClass} col pl-0`}
			spellCheck="false"
			onKeyPress={handleKeyPress}
		/>
	)
}
export default connect(mapStateToProps, null)(ChecklistTitle)
