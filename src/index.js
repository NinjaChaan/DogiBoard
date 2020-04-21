import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import store from './store/index'

import { setSelectedCard } from "./actions/index";
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

window.store = store
window.setSelectedCard = setSelectedCard
render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
)
