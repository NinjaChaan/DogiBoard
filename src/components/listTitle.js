import React, { useState } from 'react'
import { connect } from 'react-redux'
import { updateListTitle } from '../actions/index'

const ListTitle = ({ listTitle, id, dispatch }) => {
	const [listTitleClass, setListTitleClass] = useState('textarea-list-title')
	const [title, setTitle] = useState(listTitle)
	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault()
			document.getElementById(`listTitle${id.toString()}`).blur()
		}
	}

	const handleTextChange = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault()
		}
		setTitle(event.target.value)
	}

	const focusTitle = () => {
		const titleElement = document.getElementById(`listTitle${id.toString()}`)
		titleElement.focus()
		titleElement.value = ''
		titleElement.value = { listTitle }
		setListTitleClass('textarea-list-title-editing')
	}

	const blurTitle = () => {
		setListTitleClass('textarea-list-title')
		console.log('update list ', title, dispatch(updateListTitle({ text: title, id })))
	}

	return (
		<textarea
			value={title}
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
export default connect(null, null)(ListTitle)
