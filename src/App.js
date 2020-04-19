import React, { useState, useEffect } from 'react'
import ListTable from './components/listTable.js'

const App = () => {

	function downHandler({ key }) {
		console.log(key)
		if (key === 'Escape') {
			document.getElementById("window-overlay").style.display = 'none'
		}
	}

	useEffect(() => {
		window.addEventListener('keydown', downHandler);
		return () => {
			window.removeEventListener('keydown', downHandler);
		};

	}, []);

	return (
		<div className="App">
			<header className="App-header">
				<ListTable />
				<div id='window-overlay' className='window-overlay' />
			</header>
		</div>
	)
}

export default App
