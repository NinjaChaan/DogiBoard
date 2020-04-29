import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import Button from 'react-bootstrap/Button'
import CheckListDraggable from './checkListDraggable'
import AddChecklistItem from './addChecklistItem'
import ChecklistTitle from './checkListTitle'
import { setSelectedCard, updateChecklist } from '../../actions/index'

const Checklist = ({
	checkItems, createCard, innerRef, placeholder, showingAddAnother, changeShowAddAnother, id, calculateProgress
}) => {
	useEffect(() => {
		calculateProgress()
	}, [checkItems])

	if (checkItems) {
		return (
			<tbody ref={innerRef}>
				{checkItems.map((item, i) => (
					<CheckListDraggable key={item.id} i={i} checkItem={item} calculateProgress={calculateProgress} />
				))}
				{placeholder}
				<tr>
					<td>
						{showingAddAnother
							? (
								<Button className="btn-add-another-checklist" variant="link" onClick={() => changeShowAddAnother(false)}>
									<font size="4">＋</font>
									Add checklist item
								</Button>
							)
							: (
								<AddChecklistItem
									listId={id}
									changeShowAddAnother={changeShowAddAnother}
									clickFunction={createCard}
								/>
							)}
					</td>
				</tr>
			</tbody>
		)
	}
	return (<></>)
}

const CheckListContainer = ({ selectedCard, id, dispatch }) => {
	const [showingAddAnother, setShowingAddAnother] = useState(true)
	const [dragging, setDragging] = useState(false)
	const [progress, setProgress] = useState(0)

	const changeShowAddAnother = (show) => {
		setShowingAddAnother(show)
	}
	const createCard = (newCheckItem) => {
		console.log('add list item', newCheckItem)
		selectedCard.checklist.checkItems.concat(newCheckItem)
		console.log('selected card checklist', selectedCard)
		const list = { text: selectedCard.checklist.text, checkItems: selectedCard.checklist.checkItems.concat(newCheckItem) }
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
		if (document.getElementById('checkListTitle')) {
			setTimeout(() => {
				console.log(document.getElementById('checkListTitle'))
				document.getElementById('checkListTitle').focus()
			}, 10)
		}
	}

	const onDragStart = () => {
		if (!dragging) {
			// setDragging(true)
			// lists.map((list) => document.getElementById(`listTitle${list.id.toString()}`).blur())
		}
	}

	const onDragEnd = (result) => {
		const {
			destination, source, draggableId, type
		} = result

		if (dragging) {
			setDragging(false)
		}

		if (!destination) {
			return
		}

		if (destination.droppableId === source.droppableId
			&& destination.index === source.index) {
			return
		}
		if (source.droppableId === destination.droppableId) {
			const listItem = selectedCard.checklist.checkItems[source.index]
			const newItems = Array.from(selectedCard.checklist.checkItems)

			newItems.splice(source.index, 1)
			newItems.splice(destination.index, 0, listItem)

			const newList = {
				text: selectedCard.checklist.text,
				checkItems: newItems
			}
			const newChecklist = {
				checklist: newList,
				id: selectedCard.id,
				listId: selectedCard.listId
			}
			const newCard = {
				text: selectedCard.text,
				description: selectedCard.description,
				checklist: newList,
				id: selectedCard.id,
				listId: selectedCard.listId
			}

			console.log('new lists', newChecklist)
			console.log('new card', newCard)
			console.log('sendind select', dispatch(setSelectedCard(newCard)))
			console.log('sendind list', dispatch(updateChecklist(newChecklist)))
		}
	}

	const updateChecklistFunc = (text) => {
		const newList = {
			text,
			checkItems: selectedCard.checklist.checkItems
		}
		const newChecklist = {
			checklist: newList,
			id: selectedCard.id,
			listId: selectedCard.listId
		}
		const newCard = {
			text: selectedCard.text,
			description: selectedCard.description,
			checklist: newList,
			id: selectedCard.id,
			listId: selectedCard.listId
		}

		console.log('new lists', newChecklist)
		console.log('new card', newCard)
		console.log('sendind select', dispatch(setSelectedCard(newCard)))
		console.log('sendind list', dispatch(updateChecklist(newChecklist)))
	}

	const deleteChecklist = () => {
		const newChecklist = {
			checklist: null,
			id: selectedCard.id,
			listId: selectedCard.listId
		}
		const newCard = {
			text: selectedCard.text,
			description: selectedCard.description,
			checklist: null,
			id: selectedCard.id,
			listId: selectedCard.listId
		}

		console.log('new card', newCard)
		console.log('sendind select', dispatch(setSelectedCard(newCard)))
		console.log('sendind list', dispatch(updateChecklist(newChecklist)))
	}

	const calculateProgress = () => {
		let finished = 0
		selectedCard.checklist.checkItems.map((item) => {
			if (item.done) {
				finished += 1
			}
		})
		setProgress(((finished / selectedCard.checklist.checkItems.length) * 100).toFixed(0))
	}

	const rgb2hsl = (color) => {
		const r = color[0] / 255
		const g = color[1] / 255
		const b = color[2] / 255

		const max = Math.max(r, g, b)
		const min = Math.min(r, g, b)
		let h = 0
		let s = 0
		const l = (max + min) / 2

		if (max === min) {
			h = 0
			s = 0 // achromatic
		} else {
			const d = max - min
			s = (l > 0.5 ? d / (2 - max - min) : d / (max + min))
			switch (max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break
				case g: h = (b - r) / d + 2; break
				case b: h = (r - g) / d + 4; break
				default: break
			}
			h /= 6
		}

		return [h, s, l]
	}

	const hsl2rgb = (color) => {
		let l = color[2]

		if (color[1] === 0) {
			l = Math.round(l * 255)
			return [l, l, l]
		}
		function hue2rgb(p, q, t) {
			if (t < 0) t += 1
			if (t > 1) t -= 1
			if (t < 1 / 6) return p + (q - p) * 6 * t
			if (t < 1 / 2) return q
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
			return p
		}

		const s = color[1]
		const q = (l < 0.5 ? l * (1 + s) : l + s - l * s)
		const p = 2 * l - q
		const r = hue2rgb(p, q, color[0] + 1 / 3)
		const g = hue2rgb(p, q, color[0])
		const b = hue2rgb(p, q, color[0] - 1 / 3)
		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
	}

	const _interpolateHSL = (color1, color2, factor) => {
		const hsl1 = rgb2hsl(color1)
		const hsl2 = rgb2hsl(color2)
		for (let i = 0; i < 3; i += 1) {
			hsl1[i] += factor * (hsl2[i] - hsl1[i])
		}
		return hsl2rgb(hsl1)
	}

	function perc2color(perc) {
		let r; let g; let b = 0
		// if (perc < 50) {
		// 	r = 255
		// 	g = Math.round(5.1 * perc)
		// } else {
		// 	g = 255
		// 	r = Math.round(510 - 5.10 * perc)
		// }
		// r = Math.round(255 - 2.55 * perc)
		// g = Math.round(2.55 * perc)
		const res = _interpolateHSL([255, 0, 0], [0, 255, 0], perc / 100)
		r = res[0]
		g = res[1]
		b = res[2]
		const h = r * 0x10000 + g * 0x100 + b * 0x1
		return `#${(`000000${h.toString(16)}`).slice(-6)}`
	}
	return (
		<table className="cardList" style={{ backgroundColor: 'transparent', marginLeft: '0px' }}>
			<thead>
				<tr>
					<td style={{ width: '500px' }}>
						<ChecklistTitle
							listTitle={selectedCard.checklist.text}
							id="0"
							card={false}
							classType="checklist"
							updateFunction={updateChecklistFunc}
							autoFocus={true}
						/>
						<Button className="btn-delete-checklist" variant="danger" onMouseDown={deleteChecklist}>✕</Button>
						<div style={{ height: '20px', marginTop: '-15px' }}>
							<span style={{ fontSize: '0.8rem' }}>
								{`${progress !== 'NaN' ? progress : 0}%`}
							</span>
							<div className="div-checklist-progressbar-background">
								<div
									// className={['div-checklist-progressbar', progress > 25 && progress < 100 && 'div-checklist-progressbar-midway', progress === 100 && 'div-checklist-progressbar-complete']
									// 	.filter((e) => !!e)
									// 	.join(' ')}
									className="div-checklist-progressbar"
									style={{ width: `${progress}%`, backgroundColor: perc2color(progress).toString() }}
								/>
							</div>

						</div>
					</td>
				</tr>
			</thead>

			<DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
				<Droppable droppableId="0" type="card">
					{(provided) => (
						<Checklist
							id={id}
							checkItems={selectedCard.checklist.checkItems}
							createCard={createCard}
							showingAddAnother={showingAddAnother}
							changeShowAddAnother={changeShowAddAnother}
							calculateProgress={calculateProgress}
							innerRef={provided.innerRef}
							placeholder={provided.placeholder}
							{...provided.droppableProps}
						/>
					)}
				</Droppable>
			</DragDropContext>
		</table>
	)
}

export default connect(null, null)(CheckListContainer)
