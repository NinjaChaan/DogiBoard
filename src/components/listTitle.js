import React, { useState } from 'react'
import { connect } from 'react-redux'
import { updateListTitle } from '../actions/index'

const ListTitle = ({ listTitle, id, dispatch, classType, updateFunction, autoFocus }) => {
	const [listTitleClass, setListTitleClass] = useState(`textarea-${classType}-title`)
	const [title, setTitle] = useState(listTitle)

	const field = document.getElementById(`${classType}Title${id.toString()}`)
	if (field) {
		field.style.height = '30px'

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


	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault()
			document.getElementById(`${classType}Title${id.toString()}`).blur()
		}
	}

	const handleTextChange = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault()
		}
		setTitle(event.target.value)
	}

	const focusTitle = () => {
		const titleElement = document.getElementById(`${classType}Title${id.toString()}`)
		titleElement.focus()
		titleElement.value = ''
		titleElement.value = { listTitle }
		setListTitleClass(`textarea-${classType}-title-editing`)
	}

	const blurTitle = () => {
		setListTitleClass(`textarea-${classType}-title`)
		if (classType === 'list') {
			console.log('update list ', title, dispatch(updateListTitle({ text: title, id })))
		} else {
			const titleElement = document.getElementById(`${classType}Title${id.toString()}`)
			console.log('updating', titleElement.value)
			updateFunction(titleElement.value)
		}
	}

	return (
		<textarea
			autoFocus={autoFocus}
			value={title}
			onChange={handleTextChange}
			id={`${classType}Title${id.toString()}`}
			onFocus={focusTitle}
			onBlur={blurTitle}
			className={listTitleClass}
			maxLength={25}
			spellCheck="false"
			onKeyPress={handleKeyPress}
		/>
	)
}
export default connect(null, null)(ListTitle)
