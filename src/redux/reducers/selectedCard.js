const selectedCard = {}

const selectedCardReducer = (state = selectedCard, action) => {
	switch (action.type) {
		case 'SET_SELECTED_CARD':
			return {
				...state,
				...action.payload
			}
		default:
			return state
	}
}

export default selectedCardReducer
