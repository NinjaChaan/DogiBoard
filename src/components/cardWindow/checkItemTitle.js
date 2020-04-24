import React, { useState } from 'react'
import { connect } from 'react-redux'
import { setSelectedCard, updateChecklist } from '../../actions/index'

const mapStateToProps = (state) =>
	// console.log('state at cardwindiw', state.selectedCard.text)
	({
		selectedCard: state.selectedCard
	})


const CheckItemTitle = ({ selectedCard, checkItem, setEditing, dispatch }) => {
	const [listTitleClass, setListTitleClass] = useState('textarea-checkItem-title')

	const calculateHeight = () => {
		const field = document.getElementById('checkItemTitle')
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
			document.getElementById('checkItemTitle').blur()
		}
	}

	const handleTextChange = (event) => {
		calculateHeight()
		const titleElement = document.getElementById('checkItemTitle')
		if (event.key === 'Enter') {
			event.preventDefault()
		}
		console.log(event.target.value)
		titleElement.value = event.target.value

		const list = selectedCard.checklist

		list.checkItems.map((item, i) => {
			if (item === checkItem) {
				item.text = titleElement.value
			}
		})

		console.log('list', list)
		const newCard = {
			text: selectedCard.text,
			description: selectedCard.description,
			checklist: list,
			id: selectedCard.id,
			listId: selectedCard.listId
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
		const titleElement = document.getElementById('checkItemTitle')
		const t = checkItem.text
		console.log('selected', t)
		titleElement.focus()
		//titleElement.value = ''
		titleElement.value = { t }
		setListTitleClass('textarea-checkItem-title-editing')
	}

	const blurTitle = () => {
		setEditing(false)
		//console.log('update card', dispatch(updateCardTitle({ text: document.getElementById('cardTitle').value, id, listId })))
	}

	//console.log('selected', selectedCard.text)
	return (
		<textarea
			autoFocus={true}
			value={checkItem.text}
			onChange={handleTextChange}
			id={'checkItemTitle'}
			onFocus={focusTitle}
			onBlur={blurTitle}
			maxLength="200"
			className={'textarea-checkItem-title-editing'}
			spellCheck="false"
			onKeyPress={handleKeyPress}
		/>
	)
}
export default connect(mapStateToProps, null)(CheckItemTitle)
