import React, { Suspense } from 'react'
import Card from 'react-bootstrap/Card'
import { Draggable } from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import { setSelectedCard } from '../redux/actions/index'
const CardInfo = React.lazy(() => import('./cardInfo'))

const CardDraggable = ({ i, card, dispatch }) => {
	const openCardEditWindow = () => {
		const selectedCard = {
			name: card.name,
			description: card.description,
			checklist: card.checklist,
			id: card.id,
			listId: card.listId
		}
		document.getElementById('description').value = ''
		dispatch(setSelectedCard(selectedCard))
		setTimeout(() => {
			document.getElementById('window-overlay').style.display = 'flex'
			document.getElementById('card-window').focus()
		}, 10)
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
							<Card.Text style={{ marginBottom: '0px' }}>
								{card.name}
							</Card.Text>
							<Suspense fallback={<div>Loading...</div>}>
								<CardInfo card={card} />
							</Suspense>
						</Card>
					</td>
				</tr>
			)}
		</Draggable>
	)
}

export default connect(null, null)(CardDraggable)
