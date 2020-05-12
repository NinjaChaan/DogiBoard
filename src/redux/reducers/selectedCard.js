const selectedCard = {
	name: 'henlo?',
	description: '',
	id: 0,
	listId: 0
}

const selectedCardReducer = (state = selectedCard, action) => {
	switch (action.type) {
		case 'SET_SELECTED_CARD':
			return {
				...state,
				name: action.payload.name,
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
