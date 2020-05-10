import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { setSelectedCard, updateChecklist } from '../../redux/actions/index'

const mapStateToProps = (state) => ({
	selectedCard: state.selectedCard
})


const CheckItemTitle = ({
	selectedCard, checkItem, setEditing, dispatch
}) => {
	const [listTitleClass, setListTitleClass] = useState('textarea-checkItem-title')
	const [title, setTitle] = useState(checkItem.text)

	const calculateHeight = () => {
		const field = document.getElementById(`checkItemTitle${checkItem.id}`)
		if (field) {
			field.style.height = 'inherit'
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

			field.style.height = `${height}px`
			console.log('scrollHeight', field.offsetHeight)
			console.log('height', field.style.height)
			console.log('text', field.value)

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
	useEffect(() => {
		calculateHeight()
	}, [selectedCard])
	calculateHeight()

	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault()
		}
	}

	const handleTextChange = (event) => {
		const titleElement = document.getElementById(`checkItemTitle${checkItem.id}`)
		setTitle(titleElement.value)
		calculateHeight()
		if (event.key === 'Enter') {
			event.preventDefault()
		}
	}

	const focusTitle = () => {
		const titleElement = document.getElementById(`checkItemTitle${checkItem.id}`)
		console.log('selected', checkItem.text)
		titleElement.focus()
		titleElement.value = checkItem.text
		setListTitleClass('textarea-checkItem-title-editing')
	}

	const blurTitle = () => {
		const titleElement = document.getElementById(`checkItemTitle${checkItem.id}`)

		const list = selectedCard.checklist

		list.checkItems.map((item) => {
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
		setEditing(false)
		setListTitleClass('textarea-checkItem-title')
	}

	return (
		<textarea
			value={title}
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
