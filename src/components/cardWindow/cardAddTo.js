import React from 'react'
import Button from 'react-bootstrap/Button'
import { connect } from 'react-redux'
import { setSelectedCard, updateChecklist } from '../../redux/actions/index'

const CardAddTo = ({ selectedCard, dispatch }) => {
	const addChecklistPressed = () => {
		const checklist = { text: 'Checklist', checkItems: [] }
		const newCard = {
			...selectedCard,
			checklist
		}

		const newChecklist = {
			checklist,
			id: selectedCard.id,
			listId: selectedCard.listId
		}

		console.log(dispatch(setSelectedCard(newCard)))
		console.log(dispatch(updateChecklist(newChecklist)))
	}
	return (
		<div className="card-sidebar-module col">
			<h6 style={{ fontWeight: '600' }}>Add to card</h6>
			{selectedCard.checklist
				? null
				: <Button className="btn-card-sidebar" variant="light" onClick={addChecklistPressed}>Checklist</Button>}
			<Button className="btn-card-sidebar" variant="light">Members</Button>
			<Button className="btn-card-sidebar" variant="light">Label</Button>
		</div>
	)
}

export default connect(null, null)(CardAddTo)
