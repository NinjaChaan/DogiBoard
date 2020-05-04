const selectedCard = {
	text: 'henlo?',
	description: '',
	id: 0,
	listId: 0
}

const selectedCardReducer = (state = selectedCard, action) => {
	switch (action.type) {
		case 'SET_SELECTED_CARD':
			console.log('set selected', action.payload)
			return {
				...state,
				text: action.payload.text,
				id: action.payload.id,
				listId: action.payload.listId,
				description: action.payload.description,
				checklist: action.payload.checklist
			}
		default:
			return state
	}
}

export default selectedCardReducer
