import React, { useState, useEffect } from 'react'
import CardList from './components/cardList.js'
//import Card from './components/card.js'
import Button from 'react-bootstrap/Button'
const App = () => {
	

	return (
		<div className="App">
			<header className="App-header">
				<CardList title='To do' />
			</header>
		</div>
	)
}

export default App
