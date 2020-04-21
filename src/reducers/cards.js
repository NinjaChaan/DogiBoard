const initialState = []

const cards = (state = initialState, action) => {
	switch (action.type) {
		case 'ADD_CARD':
			return state.concat(action.payload)
		case 'SET_CARDS':
			console.log('set action: ', action.payload)
			return state.concat(action.payload)
		default:
			return state
	}
}

export default cards

//store.dispatch(setCards({cards:[{ text: 'aa', id: 2 }, { text: 'bb', id: 66 }]}));
