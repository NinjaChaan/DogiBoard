let nextTodoId = 0
export const setSelectedCard = (payload) => ({
	type: 'SET_SELECTED_CARD',
	payload
})
export const addCard = ({ text, listId }) => ({
	type: 'ADD_CARD',
	payload: {
		text,
		id: nextTodoId++,
		listId: listId
	}
})

export const addList = ({ text }) => ({
	type: 'ADD_LIST',
	payload: {
		text,
		cards: [],
		id: nextTodoId++
	}
})

export const updateListOrder = (lists) => ({
	type: 'UPDATE_LIST_ORDER',
	payload: lists
})

export const setCards = (cards) => ({
	type: 'SET_CARDS',
	payload: cards
})
