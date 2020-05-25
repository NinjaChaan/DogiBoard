const initialState = {
	user: {

	},
	loggedIn: false,
	token: ''
}

const userReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'LOGIN':
			return {
				...state,
				loggedIn: action.payload.loggedIn,
				token: action.payload.token
			}
		default:
			return state
	}
}

export default userReducer
