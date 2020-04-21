import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Button from 'react-bootstrap/Button'
import TitleTextarea from './titleTextarea'

const mapStateToProps = (state) => {
	return { selectedCard: state.selectedCard }
}


const CardWindow = ({ selectedCard }) => {
	const closeCardWindow = () => {
		document.getElementById('window-overlay').style.display = 'none'
	}

	function downHandler({ key }) {
		if (key === 'Escape') {
			closeCardWindow()
			console.log(key)
		}
	}

	useEffect(() => {
		window.addEventListener('keydown', downHandler)
		return () => {
			window.removeEventListener('keydown', downHandler)
		}
	}, [])


	const handleChildClick = (e) => {
		e.stopPropagation()
	}

	return (
		<div id="window-overlay" className="window-overlay" onClick={closeCardWindow}>
			<div id="card-window" className="window" style={{ display: 'block' }} tabIndex="0" onClick={handleChildClick}>
				<TitleTextarea
					listTitle={selectedCard.text}
					id={selectedCard.id}
				/>
				<div className="card-window">
					<Button className="btn-close-card-window" variant="light" onClick={closeCardWindow}>✕</Button>
				</div>
			</div>
		</div>
	)
}

export default connect(mapStateToProps, null)(CardWindow)
