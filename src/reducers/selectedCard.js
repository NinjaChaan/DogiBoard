const selectedCard = {
	text: 'henlo?',
	id: 0
}

const selectedCardReducer = (state = selectedCard, action) => {
	switch (action.type) {
		case 'SET_SELECTED_CARD':
			console.log('set selected', action.payload)
			return action.payload
		default: return state
	}
}

export default selectedCardReducer
