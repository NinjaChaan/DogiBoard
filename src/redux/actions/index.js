import store from '../store/index'

const nextCardId = () => store.getState().board.board.lists.reduce((prev, current) => Math.max(prev, current.cards.reduce((prevC, curC) => Math.max(prevC, curC.id), 0)), 0) + 1
const nextListId = () => store.getState().board.board.lists.reduce((prev, current) => Math.max(prev, current.id), 0) + 1

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

export const login = ({ loggedIn, token, user }) => ({
	type: 'LOGIN',
	payload: {
		loggedIn,
		token,
		user
	}
})

export const updateUser = (user) => ({
	type: 'UPDATE_USER',
	payload: {
		...user
	}
})

export const logout = () => ({
	type: 'LOGOUT'
})

export const setBoard = (board) => ({
	type: 'SET_BOARD',
	payload: {
		...board
	}
})

export const setRoute = (route) => ({
	type: 'SET_ROUTE',
	payload: {
		...route
	}
})

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
export const addCard = ({ card, listId }) => ({
	type: 'ADD_CARD',
	payload: {
		...card,
		id: nextCardId(),
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
		id: nextListId()
	}
})

export const deleteList = ({ id }) => ({
	type: 'DELETE_LIST',
	payload: {
		id
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
