const initialState = {
	lists: [
		{
			text: 'a',
			cards: [{ text: 'kkk', id: 8998 }],
			id: 8778
		}, {
			text: 'b',
			cards: [{ text: 'lll', id: 9987 }, { text: 'laa', id: 97 }],
			id: 8645
		},
		{
			text: 'cards',
			cards: [{ text: 'aa', id: 2 }, { text: 'bb', id: 66 }],
			id: 43
		}
	]
}
const listReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'ADD_LIST':
			return { ...state, lists: state.lists.concat(action.payload) }
		case 'UPDATE_LIST_ORDER':
			return { ...state, lists: action.payload }
		case 'ADD_CARD':
			const listToUpdate = state.lists.find((list) => list.id === action.payload.listId)
			const newCards = listToUpdate.cards.concat(action.payload)
			const updatedCards = state.lists.map((list, i) => {
				if (list.id === action.payload.listId) {
					return { ...list, cards: newCards }
				}
				return list
			})
			return { ...state, lists: updatedCards }
		default:
			return state
	}
}

export default listReducer
