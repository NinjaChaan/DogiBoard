import { combineReducers } from 'redux'

import cardReducer from './cards'
import selectedCard from './selectedCard'
import listReducer from './lists'

export default combineReducers({
	cardReducer,
	selectedCard,
	listReducer
})
