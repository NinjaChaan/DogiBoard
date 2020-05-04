import 'react-hot-loader/patch'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import Theme from './theme'

ReactDOM.render(
	<AppContainer>
		<Theme>
			<App />
		</Theme>
	</AppContainer>,
	document.getElementById('root')
)
