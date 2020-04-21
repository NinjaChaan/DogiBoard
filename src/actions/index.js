import store from '../store/index'

let nextTodoId = store.getState().listReducer.lists.reduce((prev, current) => 
	Math.max(prev, current.cards.reduce((prevC, curC) => Math.max(prevC, curC.id), 0)), 0) + 1
console.log(nextTodoId)

export const setSelectedCard = (payload) => ({
	type: 'SET_SELECTED_CARD',
	payload
})
export const addCard = ({ text, listId }) => ({
	type: 'ADD_CARD',
	payload: {
		text,
		id: nextTodoId++,
		listId
	}
})
export const updateCard = ({ text, id, listId }) => ({
	type: 'UPDATE_CARD',
	payload: {
		text,
		id,
		listId
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

export const updateListTitle = ({ text, id }) => ({
	type: 'UPDATE_LIST_TITLE',
	payload: {
		text,
		listId: id
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
