import React, { useState } from 'react'
import Card from 'react-bootstrap/Card'
import { Draggable } from 'react-beautiful-dnd'
import CheckItemTitle from './checkItemTitle'

const CheckListDraggable = ({ text, i, card }) => {
	const [editing, setEditing] = useState(false)
	return (
		<Draggable draggableId={card.id.toString()} index={i}>
			{(provided) => (
				<tr
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
				>
					<td>
						{editing
							? <CheckItemTitle selectedCard={card} checkItem={card} setEditing={setEditing} />
							: (
								<Card
									className="card-body-checklist"
									body
									padding="30px"
									onClick={() => { setEditing(true) }}
									style={{ marginLeft: '0px !important' }}
								>

									<Card.Text>
										{card.text}
									</Card.Text>

								</Card>
							)}
					</td>
				</tr>
			)}
		</Draggable>
	)
}

export default CheckListDraggable
