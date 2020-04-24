const initialState = {
	lists: [{
		text: 'a',
		cards: [{ text: 'kkk', id: 0, listId: 0 }],
		id: 0
	}, {
		text: 'b',
		cards: [{ text: 'lll', id: 1, listId: 1 }, { text: 'laa', id: 27, listId: 1 }],
		id: 1
	},
	{
		text: 'cards',
		cards: [{ text: 'aa', id: 3, listId: 2 }, { text: 'bb', id: 4, listId: 2 }],
		id: 2
	}
	]
}
const listReducer = (state = initialState, action) => {
	let listToUpdate = null
	if (action.payload) {
		listToUpdate = state.lists.find((list) => list.id === action.payload.listId)
	}
	switch (action.type) {
		case 'ADD_LIST':
			return { ...state, lists: state.lists.concat(action.payload) }
		case 'UPDATE_CARD_TITLE':
			console.log('update card title', action.payload)
			const updatedCardListT = state.lists.map((list, i) => {
				if (list.id === action.payload.listId) {
					const updatedCards = list.cards.map((card) => {
						if (card.id === action.payload.id) {
							return { ...card, text: action.payload.text }
						}
						return card
					})
					console.log('updated cards', updatedCards)
					return { ...list, cards: updatedCards }
				}
				return list
			})
			return { ...state, lists: updatedCardListT }
		case 'UPDATE_CARD_DESCRIPTION':
			console.log('update card description', action.payload)
			const updatedCardListD = state.lists.map((list, i) => {
				if (list.id === action.payload.listId) {
					const updatedCards = list.cards.map((card) => {
						if (card.id === action.payload.id) {
							return { ...card, description: action.payload.description }
						}
						return card
					})
					console.log('updated cards', updatedCards)
					return { ...list, cards: updatedCards }
				}
				return list
			})
			return { ...state, lists: updatedCardListD }
		case 'UPDATE_LIST_TITLE':
			console.log('update list title', action.payload)
			const titleUpdatedLists = state.lists.map((list, i) => {
				if (list.id === action.payload.listId) {
					return { ...list, text: action.payload.text }
				}
				return list
			})
			return { ...state, lists: titleUpdatedLists }
		case 'UPDATE_LIST_ORDER':
			return { ...state, lists: action.payload }
		case 'ADD_CARD':
			const newCards = listToUpdate.cards.concat(action.payload)
			const addCardupdatedLists = state.lists.map((list, i) => {
				if (list.id === action.payload.listId) {
					return { ...list, cards: newCards }
				}
				return list
			})
			return { ...state, lists: addCardupdatedLists }
		case 'DELETE_CARD':
			const cardss = listToUpdate.cards.filter((c) => c.id !== action.payload.id)
			console.log('ccc', cardss)
			const newLists = state.lists.map((list, i) => {
				if (list.id === action.payload.listId) {
					return { ...list, cards: cardss }
				}
				return list
			})
			console.log('dcards', newLists)
			return { ...state, lists: newLists }
		case 'UPDATE_CHECKLIST':
			console.log('update checklist', action.payload)
			const checklistUpdatedLists = state.lists.map((list, i) => {
				if (list.id === action.payload.listId) {
					const updatedChecklist = list.cards.map((card) => {
						if (card.id === action.payload.id) {
							return { ...card, checklist: action.payload.checklist }
						}
						return card
					})
					return { ...list, cards: updatedChecklist }
				}
				return list
			})
			return { ...state, lists: checklistUpdatedLists }
		default:
			return state
	}
}

export default listReducer
