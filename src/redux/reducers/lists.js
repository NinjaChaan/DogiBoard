const initialState = {
	lists: [
		// {
		// 	name: 'a',
		// 	cards: [{ name: 'kkk', id: 0, listId: 0 }],
		// 	id: 0
		// }, {
		// 	name: 'b',
		// 	cards: [{ name: 'lll', id: 1, listId: 1 }, { name: 'laa', id: 27, listId: 1 }],
		// 	id: 1
		// },
		// {
		// 	name: 'cards',
		// 	cards: [{ name: 'aa', id: 3, listId: 2 }, { name: 'bb', id: 4, listId: 2 }],
		// 	id: 2
		// }
	]
}

const updateCardInsideLists = (state, cardId, listId, updated) => {
	const updatedCardList = state.lists.map((list) => {
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

const replaceCardInsideLists = (state, cardId, listId, replaceCard) => {
	const updatedCardList = state.lists.map((list) => {
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

const listReducer = (state = initialState, action) => {
	let listToUpdate = null
	if (action.payload) {
		listToUpdate = state.lists.find((list) => list.id === action.payload.listId)
	}
	switch (action.type) {
		case 'ADD_LIST':
			return { ...state, lists: state.lists.concat(action.payload) }

		case 'UPDATE_CARD':
			console.log('update card', action.payload)
			return {
				...state,
				lists: replaceCardInsideLists(
					state,
					action.payload.id,
					action.payload.listId,
					action.payload
				)
			}
		// case 'UPDATE_CARD_TITLE':
		// 	console.log('update card title', action.payload)
		// 	return {
		// 		...state,
		// 		lists: updateCardInsideLists(
		// 			state,
		// 			action.payload.id,
		// 			action.payload.listId,
		// 			{ name: action.payload.name }
		// 		)
		// 	}
		// case 'UPDATE_CARD_DESCRIPTION':
		// 	console.log('update card description', action.payload)
		// 	return {
		// 		...state,
		// 		lists: updateCardInsideLists(
		// 			state,
		// 			action.payload.id,
		// 			action.payload.listId,
		// 			{ description: action.payload.description }
		// 		)
		// 	}
		// case 'UPDATE_CARD_LABEL':
		// 	console.log('update card description', action.payload)
		// 	return {
		// 		...state,
		// 		lists: updateCardInsideLists(
		// 			state,
		// 			action.payload.id,
		// 			action.payload.listId,
		// 			{ label: action.payload.label }
		// 		)
		// 	}
		case 'UPDATE_LIST_TITLE':
			console.log('update list title', action.payload)
			const titleUpdatedLists = state.lists.map((list) => {
				if (list.id === action.payload.listId) {
					return { ...list, name: action.payload.name }
				}
				return list
			})
			return { ...state, lists: titleUpdatedLists }
		case 'UPDATE_LIST_ORDER':
			return { ...state, lists: action.payload }
		case 'SET_LISTS':
			return { ...state, lists: action.payload }
		case 'ADD_CARD':
			const newCards = listToUpdate.cards.concat(action.payload)
			const addCardupdatedLists = state.lists.map((list) => {
				if (list.id === action.payload.listId) {
					return { ...list, cards: newCards }
				}
				return list
			})
			return { ...state, lists: addCardupdatedLists }
		case 'DELETE_CARD':
			const cardss = listToUpdate.cards.filter((c) => c.id !== action.payload.id)
			console.log('ccc', cardss)
			const newLists = state.lists.map((list) => {
				if (list.id === action.payload.listId) {
					return { ...list, cards: cardss }
				}
				return list
			})
			console.log('dcards', newLists)
			return { ...state, lists: newLists }
		case 'UPDATE_CHECKLIST':
			console.log('update checklist', action.payload)
			return {
				...state,
				lists: updateCardInsideLists(
					state,
					action.payload.id,
					action.payload.listId,
					{ checklist: action.payload.checklist }
				)
			}
		default:
			return state
	}
}

export default listReducer
