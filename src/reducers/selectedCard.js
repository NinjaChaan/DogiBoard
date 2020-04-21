const selectedCard = {
	text: 'henlo?',
	id: 0
}

const selectedCardReducer = (state = selectedCard, action) => {
	console.log('selected action: ', action.payload)
	switch (action.type) {
		case 'SET_SELECTED_CARD':
			return action.payload
		// ...state,
		// text: action.payload.text,
		// id: action.payload.id


		default: return state
	}
}

export default selectedCardReducer
