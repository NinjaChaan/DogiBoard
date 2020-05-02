import React, { useState } from 'react'
import { connect } from 'react-redux'
import { setSelectedCard, updateChecklist } from '../../actions/index'

const mapStateToProps = (state) =>
	// console.log('state at cardwindiw', state.selectedCard.text)
	({
		selectedCard: state.selectedCard
	})


const CheckItemTitle = ({
	selectedCard, checkItem, setEditing, editing, dispatch
}) => {
	const [listTitleClass, setListTitleClass] = useState('textarea-checkItem-title')

	const calculateHeight = () => {
		const field = document.getElementById(`checkItemTitle${checkItem.id}`)
		if (field) {
			field.style.height = '25px'
			// Get the computed styles for the element
			const computed = window.getComputedStyle(field)

			if (field.value === '[object Object]') {
				field.value = checkItem.text
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
		}
	}

	const handleTextChange = (event) => {
		calculateHeight()
		const titleElement = document.getElementById(`checkItemTitle${checkItem.id}`)
		if (event.key === 'Enter') {
			event.preventDefault()
		}

		const list = selectedCard.checklist

		list.checkItems.map((item, i) => {
			if (item === checkItem) {
				item.text = titleElement.value
			}
		})

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

	const focusTitle = () => {
		const titleElement = document.getElementById(`checkItemTitle${checkItem.id}`)
		console.log('selected', checkItem.text)
		titleElement.focus()
		titleElement.value = checkItem.text
		setListTitleClass('textarea-checkItem-title-editing')
	}

	const blurTitle = () => {
		setEditing(false)
		setListTitleClass('textarea-checkItem-title')
	}

	console.log('checkitem done?', checkItem.done)
	return (
		<textarea
			autoFocus={true}
			value={checkItem.text}
			onChange={handleTextChange}
			id={`checkItemTitle${checkItem.id}`}
			onFocus={focusTitle}
			onBlur={blurTitle}
			maxLength="200"
			className={listTitleClass}
			spellCheck="false"
			onKeyPress={handleKeyPress}
			style={{
				textDecoration: checkItem.done ? 'line-through' : 'none',
				color: checkItem.done ? 'rgba(61, 61, 61, 0.6)' : 'black'
			}}
		/>
	)
}
export default connect(mapStateToProps, null)(CheckItemTitle)
