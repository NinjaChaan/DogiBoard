import React from 'react'
import { ThemeProvider } from 'styled-components'
import device from './devices'

const Theme = ({ children }) => (
	<ThemeProvider
		theme={{
			primaryFont: 'Arial',
			primaryColor: '#666',
			...device
		}}
	>
		{children}
	</ThemeProvider>
)
export default Theme
