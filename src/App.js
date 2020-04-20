import React, { useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import ListTable from './components/listTable'

const App = () => {
	const closeCardWindow = () => {
		document.getElementById('window-overlay').style.display = 'none'
	}

	function downHandler({ key }) {
		console.log(key)
		if (key === 'Escape') {
			closeCardWindow()
		}
	}

	useEffect(() => {
		window.addEventListener('keydown', downHandler)
		return () => {
			window.removeEventListener('keydown', downHandler)
		}
	}, [])

	return (
		<div className="App">
			<header className="App-header">
				<ListTable />
				<div id="window-overlay" className="window-overlay">
					<div className="window" style={{ display: 'block' }}>
						<div className="card-window">
							<Button className="btn-close-card-window" variant="light" onClick={closeCardWindow}>✕</Button>
						</div>
					</div>
				</div>
			</header>
		</div>
	)
}

export default App
