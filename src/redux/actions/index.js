import store from '../store/index'

let nextTodoId = store.getState().listReducer.lists.reduce((prev, current) => Math.max(prev, current.cards.reduce((prevC, curC) => Math.max(prevC, curC.id), 0)), 0) + 1
console.log(nextTodoId)

// export const setSelectedCard = ({
// 	name, id, listId, description, checklist, label
// }) => ({
// 	type: 'SET_SELECTED_CARD',
// 	payload: {
// 		name,
// 		description,
// 		checklist,
// 		id,
// 		listId,
// 		label
// 	}
// })

export const setSelectedCard = (selectedCard) => ({
	type: 'SET_SELECTED_CARD',
	payload: {
		...selectedCard
	}
})
export const updateCard = (updatedCard) => ({
	type: 'UPDATE_CARD',
	payload: {
		...updatedCard
	}
})
export const addCard = ({ name, listId }) => ({
	type: 'ADD_CARD',
	payload: {
		name,
		id: nextTodoId++,
		listId
	}
})
// export const updateCardTitle = ({ name, id, listId }) => ({
// 	type: 'UPDATE_CARD_TITLE',
// 	payload: {
// 		name,
// 		id,
// 		listId
// 	}
// })
export const deleteCard = ({ id, listId }) => ({
	type: 'DELETE_CARD',
	payload: {
		id,
		listId
	}
})
// export const updateCardDescription = ({ description, id, listId }) => ({
// 	type: 'UPDATE_CARD_DESCRIPTION',
// 	payload: {
// 		description,
// 		id,
// 		listId
// 	}
// })
// export const updateCardLabel = ({ label, id, listId }) => ({
// 	type: 'UPDATE_CARD_LABEL',
// 	payload: {
// 		label,
// 		id,
// 		listId
// 	}
// })

export const updateChecklist = ({ checklist, id, listId }) => ({
	type: 'UPDATE_CHECKLIST',
	payload: {
		checklist,
		id,
		listId
	}
})

export const addList = ({ name }) => ({
	type: 'ADD_LIST',
	payload: {
		name,
		cards: [],
		id: nextTodoId++
	}
})

export const updateListTitle = ({ name, id }) => ({
	type: 'UPDATE_LIST_TITLE',
	payload: {
		name,
		listId: id
	}
})

export const updateListOrder = (lists) => ({
	type: 'UPDATE_LIST_ORDER',
	payload: lists
})

export const setLists = (lists) => ({
	type: 'SET_LISTS',
	payload: lists
})

export const setCards = (cards) => ({
	type: 'SET_CARDS',
	payload: cards
})
