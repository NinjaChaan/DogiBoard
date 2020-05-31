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
			console.log('login reduce', action.payload)
			return {
				loggedIn: action.payload.loggedIn,
				token: action.payload.token,
				user: action.payload.user,
				loggedOut: false
			}
		case 'LOGOUT':
			console.log('logout reduce', action.payload)
			return {
				loggedIn: false,
				token: null,
				user: null,
				loggedOut: true
			}
		default:
			return state
	}
}

export default userReducer
