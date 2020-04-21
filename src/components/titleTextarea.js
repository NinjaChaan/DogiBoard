import React, { useState } from 'react'

const TitleTextarea = ({ listTitle, id }) => {
	const [listTitleClass, setListTitleClass] = useState('textarea-list-title')



	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault()
			document.getElementById(`listTitle${id.toString()}`).blur()
		}
	}

	const handleTextChange = (event) => {
		console.log(event)
		if (event.key === 'Enter') {
			event.preventDefault()
		}
		//setTitle(event.target.value)
	}

	const focusTitle = () => {
		const titleElement = document.getElementById(`listTitle${id.toString()}`)
		titleElement.focus()
		titleElement.value = ''
		titleElement.value = { listTitle }
		console.log(listTitleClass)
		setListTitleClass('textarea-list-title-editing')
	}

	const blurTitle = () => {
		console.log('blurred')
		setListTitleClass('textarea-list-title')
		console.log('class ' + listTitleClass)
	}

	return (
		<textarea
			value={listTitle}
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

export default TitleTextarea
