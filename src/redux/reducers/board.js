const initialState = {
	board: {

	}
}


const updateCardInsideLists = (board, cardId, listId, updated) => {
	const updatedCardList = board.lists.map((list) => {
		if (list.id === listId) {
			const updatedCards = list.cards.map((card) => {
				if (card.id === cardId) {
					return { ...card, ...updated }
				}
				return card
			})
			console.log('updated cards', updatedCards)
			return { ...list, cards: updatedCards }
		}
		return list
	})

	return updatedCardList
}

const replaceCardInsideLists = (board, cardId, listId, replaceCard) => {
	const updatedCardList = board.lists.map((list) => {
		if (list.id === listId) {
			const updatedCards = list.cards.map((card) => {
				if (card.id === cardId) {
					return replaceCard
				}
				return card
			})
			console.log('updated cards', updatedCards)
			return { ...list, cards: updatedCards }
		}
		return list
	})

	return updatedCardList
}


const boardReducer = (state = initialState, action) => {
	let board = state.board
	let listToUpdate = null
	if (action.payload && board && board.lists) {
		listToUpdate = board.lists.find((list) => list.id === action.payload.listId)
	}

	switch (action.type) {
		case 'SET_BOARD':
			return {
				...state,
				board: action.payload.board
			}
		case 'ADD_LIST':
			board = { ...board, lists: board.lists.concat(action.payload) }
			break
		case 'UPDATE_CARD':
			console.log('update card', action.payload)
			board = {
				...board,
				lists: replaceCardInsideLists(
					board,
					action.payload.id,
					action.payload.listId,
					action.payload
				)
			}
			break
		case 'UPDATE_LIST_TITLE':
			console.log('update list title', action.payload)
			const titleUpdatedLists = board.lists.map((list) => {
				if (list.id === action.payload.listId) {
					return { ...list, name: action.payload.name }
				}
				return list
			})
			board = { ...board, lists: titleUpdatedLists }
			break
		case 'UPDATE_LIST_ORDER':
			board = { ...board, lists: action.payload }
			break
		case 'SET_LISTS':
			board = { ...board, lists: action.payload }
			break
		case 'ADD_CARD':
			const newCards = listToUpdate.cards.concat(action.payload)
			const addCardupdatedLists = board.lists.map((list) => {
				if (list.id === action.payload.listId) {
					return { ...list, cards: newCards }
				}
				return list
			})
			board = { ...board, lists: addCardupdatedLists }
			break
		case 'DELETE_CARD':
			const cardss = listToUpdate.cards.filter((c) => c.id !== action.payload.id)
			console.log('ccc', cardss)
			const newLists = board.lists.map((list) => {
				if (list.id === action.payload.listId) {
					return { ...list, cards: cardss }
				}
				return list
			})
			console.log('dcards', newLists)
			board = { ...board, lists: newLists }
			break
		case 'UPDATE_CHECKLIST':
			console.log('update checklist', action.payload)
			board = {
				...board,
				lists: updateCardInsideLists(
					board,
					action.payload.id,
					action.payload.listId,
					{ checklist: action.payload.checklist }
				)
			}
			break
		default:
			return state
	}

	return {
		...state,
		board
	}
}

export default boardReducer
