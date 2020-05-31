const initialState = {
	route: ''
}

const routeReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_ROUTE':
			console.log('route reduce', action.payload)
			return {
				route: action.payload.route
			}
		default:
			return state
	}
}

export default routeReducer
