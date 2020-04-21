const cards = []

const cardReducer = (state = cards, action) => {
	switch (action.type) {
		case 'ADD_CARD':
			return state.concat(action.payload)
		case 'SET_CARDS':
			return state.concat(action.payload)
		default:
			return state
	}
}

export default cardReducer
