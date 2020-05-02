import 'react-hot-loader/patch'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

ReactDOM.render(
	<AppContainer>
		<App />
	</AppContainer>,
	document.getElementById('root')
)
