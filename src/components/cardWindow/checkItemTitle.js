import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { setSelectedCard, updateChecklist } from '../../redux/actions/index'

const InputField = styled.input`
	background-color: transparent;
	border: none;
	border-radius: 4px;
	width: 100%;
	pointer-events: none;
	word-break: break-word;
	word-wrap: break-word;
	overflow-wrap: break-word;
	overflow: auto !important;
`

const mapStateToProps = (state) => ({
	selectedCard: state.selectedCard
})


const CheckItemTitle = ({
	selectedCard, checkItem, setEditing, dispatch
}) => {
	const [listTitleClass, setListTitleClass] = useState('textarea-checkItem-title')
	const [title, setTitle] = useState(checkItem.text)
	const [editingTitle, setEditingTitle] = useState(false)

	const calculateHeight = () => {
		const field = document.getElementById(`checkItemTitleInput${checkItem.id}`)
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
			console.log('scrollHeight', field.scrollHeight)
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
	}, [checkItem])

	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault()
		}
	}

	const handleTextChange = (event) => {
		const titleElement = document.getElementById(`checkItemTitle${checkItem.id}`)
		setTitle(titleElement.text)
		calculateHeight()
		if (event.key === 'Enter') {
			event.preventDefault()
		}
	}

	const focusTitle = () => {
		setListTitleClass('textarea-checkItem-title-editing')
		const titleElement = document.getElementById(`checkItemTitleInput${checkItem.id}`)
		console.log('selected card', selectedCard)
		console.log('selected item', checkItem)
		console.log('selected text', checkItem.text)
		setTimeout(() => {
			titleElement.focus()
			titleElement.value = checkItem.text
			setEditingTitle(true)
		}, 0)
	}

	const blurTitle = () => {
		console.log('blurr item')
		setEditing(false)
		setListTitleClass('textarea-checkItem-title')
		setEditingTitle(false)
		const titleElement = document.getElementById(`checkItemTitleInput${checkItem.id}`)

		const list = selectedCard.checklist

		list.checkItems.map((item) => {
			if (item === checkItem) {
				console.log('blurr item text', titleElement.value)
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
	// if (editingTitle) {
	// 	return (
	// 		<textarea
	// 			value={title}
	// 			onChange={handleTextChange}
	// 			id={`checkItemTitle${checkItem.id}`}
	// 			onFocus={focusTitle}
	// 			onBlur={blurTitle}
	// 			maxLength="200"
	// 			className={listTitleClass}
	// 			spellCheck="false"
	// 			onKeyPress={handleKeyPress}
	// 			style={{
	// 				textDecoration: checkItem.done ? 'line-through' : 'none',
	// 				color: checkItem.done ? 'rgba(61, 61, 61, 0.6)' : 'black'
	// 			}}
	// 		/>
	// 	)
	// }
	return (
		<span
			text={title}
			onChange={handleTextChange}
			id={`checkItemTitle${checkItem.id}`}
			onFocus={focusTitle}
			className={listTitleClass}
			spellCheck="false"
			onKeyPress={handleKeyPress}
			onClick={focusTitle}
			style={{
				textDecoration: checkItem.done ? 'line-through' : 'none',
				color: checkItem.done ? 'rgba(61, 61, 61, 0.6)' : 'black',
				minHeight: '20px',
				marginBottom: '0px',
				alignSelf: 'center',
				flex: '1'
			}}
		>
			<InputField
				maxLength="80"
				id={`checkItemTitleInput${checkItem.id}`}
				onBlur={blurTitle}
				value={title}
			/>
		</span>
	)
}
export default connect(mapStateToProps, null)(CheckItemTitle)
