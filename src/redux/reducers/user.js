const initialState = {
	user: {

	},
	loggedIn: false,
	loggedOut: false,
	token: ''
}

const userReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'LOGIN':
			return {
				loggedIn: action.payload.loggedIn,
				token: action.payload.token,
				user: action.payload.user,
				loggedOut: false
			}
		case 'LOGOUT':
			return {
				loggedIn: false,
				token: null,
				user: null,
				loggedOut: true
			}
		case 'UPDATE_USER':
			return {
				...state,
				user: action.payload
			}
		default:
			return state
	}
}

export default userReducer
