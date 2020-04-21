let nextTodoId = 0
export const setSelectedCard = (payload) => ({
	type: 'SET_SELECTED_CARD',
	payload
})
export const addCard = ({ text }) => ({
	type: 'ADD_CARD',
	text,
	payload: {
		text,
		id: nextTodoId++
	}
})

export const setCards = ({ cards }) => ({
	type: 'SET_CARDS',
	payload: cards
})
