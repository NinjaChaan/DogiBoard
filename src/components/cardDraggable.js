import React from 'react'
import Card from 'react-bootstrap/Card'
import { Draggable } from 'react-beautiful-dnd'

const CardDraggable = ({ text, i, id }) => {
	const openCardEditWindow = () => {
		document.getElementById('window-overlay').style.display = 'flex'
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

export default CardDraggable
