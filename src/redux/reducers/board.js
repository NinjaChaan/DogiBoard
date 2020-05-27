const initialState = {
	board: {

	}
}

const boardReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_BOARD':
			return {
				...state,
				board: action.payload.board
			}
		default:
			return state
	}
}

export default boardReducer
