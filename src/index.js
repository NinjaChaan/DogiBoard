import 'react-hot-loader/patch'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import styled, { ThemeProvider } from 'styled-components'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import Theme from './theme'

ReactDOM.render(
	<AppContainer>
		<Theme mode="ligth">
			<App />
		</Theme>
	</AppContainer>,
	document.getElementById('root')
)
