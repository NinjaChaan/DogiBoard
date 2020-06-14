import React from 'react'
import { ThemeProvider } from 'styled-components'
import { device } from './devices'

const theme = {
	colors: {
		primary: {
			backgroundColor: 'rgb(85, 125, 255)',
			color: 'rgb(255, 255, 255)',
			hover: {
				backgroundColor: 'rgb(70, 110, 240)',
				color: 'rgb(255, 255, 255)',
			},
			focus: {
				backgroundColor: 'rgb(60, 100, 230)',
				color: 'rgb(255, 255, 255)',
			},
		},
		success: {
			backgroundColor: 'rgb(40, 165, 70)',
			color: 'rgb(255, 255, 255)',
			hover: {
				backgroundColor: 'rgb(25, 150, 55)',
				color: 'rgb(255, 255, 255)',
			},
			focus: {
				backgroundColor: 'rgb(15, 140, 45)',
				color: 'rgb(255, 255, 255)',
			},
		},
		light: {
			backgroundColor: 'rgb(225, 225, 225)',
			color: 'rgb(0, 0, 0)',
			hover: {
				backgroundColor: 'rgb(210, 210, 210)',
				color: 'rgb(0, 0, 0)',
			},
			focus: {
				backgroundColor: 'rgb(200, 200, 200)',
				color: 'rgb(0, 0, 0)',
			},
		},
		link: {
			backgroundColor: 'rgba(210, 210, 210, 0.3)',
			color: 'rgb(0, 100, 255)',
			hover: {
				backgroundColor: 'rgb(210, 210, 210)',
				color: 'rgb(0, 85, 240)',
			},
			focus: {
				backgroundColor: 'rgb(200, 200, 200)',
				color: 'rgb(0, 75, 230)',
			},
		},
		link_transparent: {
			backgroundColor: 'rgba(0, 0, 0, 0)',
			color: 'rgb(0, 100, 255)',
			hover: {
				backgroundColor: 'rgba(210, 210, 210, 0.3)',
				color: 'rgb(0, 75, 230)',
			},
			focus: {
				backgroundColor: 'rgba(0, 0, 0, 0)',
				color: 'rgb(0, 55, 210)',
			},
		},
		warning: {
			backgroundColor: 'rgb(225, 0, 0)',
			color: 'rgb(255, 255, 255)',
			hover: {
				backgroundColor: 'rgb(210, 0, 0)',
				color: 'rgb(255, 255, 255)',
			},
			focus: {
				backgroundColor: 'rgb(200, 0, 0)',
				color: 'rgb(255, 255, 255)',
			}
		},
		warning_light: {
			backgroundColor: 'rgb(225, 225, 225)',
			color: 'rgb(0, 0, 0)',
			hover: {
				backgroundColor: 'rgb(225, 0, 0)',
				color: 'rgb(255, 255, 255)',
			},
			focus: {
				backgroundColor: 'rgb(200, 0, 0)',
				color: 'rgb(255, 255, 255)',
			}
		},
		disabled: {
			backgroundColor: 'rgba(200, 200, 200, 1)',
			color: 'rgb(100, 100, 100)',
			hover: {
				backgroundColor: 'rgba(200, 200, 200, 1)',
				color: 'rgb(100, 100, 100)',
			},
			focus: {
				backgroundColor: 'rgba(200, 200, 200, 1)',
				color: 'rgb(100, 100, 100)',
			},
		},
	},
	fonts: ['sans-serif', 'Roboto'],
	fontSizes: {
		small: '1em',
		medium: '2em',
		large: '3em'
	},
	device
}

const Theme = ({ children }) => (
	<ThemeProvider theme={theme}>{children}</ThemeProvider>
)

export default Theme
