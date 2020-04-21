import React from 'react'
import Card from 'react-bootstrap/Card'
import { Draggable } from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import { setSelectedCard } from '../actions/index'

const CardDraggable = ({ text, i, id, dispatch }) => {
	const openCardEditWindow = () => {
		const selectedCard = {
			text,
			id
		}

		dispatch(setSelectedCard(selectedCard))

		document.getElementById('window-overlay').style.display = 'flex'
		document.getElementById('card-window').focus()
	}

	return (
		<Draggable draggableId={id.toString()} index={i}>
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
								{text}
							</Card.Text>
						</Card>
					</td>
				</tr>
			)}
		</Draggable>
	)
}


export default connect(null, null)(CardDraggable)
