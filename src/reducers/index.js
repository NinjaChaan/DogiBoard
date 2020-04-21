import { combineReducers } from 'redux'

import cards from './cards'
import selectedCard from './selectedCard'

export default combineReducers({
	cards,
	selectedCard
})
