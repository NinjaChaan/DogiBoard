const selectedCard = {}

const selectedCardReducer = (state = selectedCard, action) => {
	switch (action.type) {
		case 'SET_SELECTED_CARD':
			return {
				...action.payload
			}
		default:
			return state
	}
}

export default selectedCardReducer
