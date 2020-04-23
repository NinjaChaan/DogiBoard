import React from 'react'
import Card from 'react-bootstrap/Card'
import { Draggable } from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import { setSelectedCard } from '../actions/index'

const CardDraggable = ({
	text, i, card, dispatch
}) => {
	const openCardEditWindow = () => {
		const selectedCard = {
			text: card.text,
			description: card.description,
			id: card.id,
			listId: card.listId
		}

		console.log(dispatch(setSelectedCard(selectedCard)))

		document.getElementById('window-overlay').style.display = 'flex'
		document.getElementById('card-window').focus()
		document.getElementById('description').value = card.description || ''
		// document.getElementById('cardTitle').value = card.text || ''
	}

	return (
		<Draggable draggableId={card.id.toString()} index={i}>
			{(provided) => (
				<tr
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
				>
					<td>
						<Card
							className="cardBody"
							body
							padding="30px"
							onClick={openCardEditWindow}
						>
							<Card.Text>
								{card.text}
							</Card.Text>
						</Card>
					</td>
				</tr>
			)}
		</Draggable>
	)
}

export default connect(null, null)(CardDraggable)
