import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Button from 'react-bootstrap/Button'
import CardTitle from './cardTitle'
import CardDescription from './cardDescription'
import cardDescription from './cardDescription'

const mapStateToProps = (state) => {
	console.log('state at cardwindiw', state.selectedCard)
	return { selectedCard: state.selectedCard }
}

const CardWindow = ({ selectedCard, dispatch }) => {
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
	console.log('render desc', selectedCard.description)
	return (
		<div id="window-overlay" className="window-overlay" onClick={closeCardWindow}>
			<div id="card-window" className="window" style={{ display: 'block' }} tabIndex="0" onClick={handleChildClick}>
				<div className="card-window-header">
					<CardTitle
						listTitle={selectedCard.text}
						id={selectedCard.id}
						listId={selectedCard.listId}
					/>
				</div>
				<div className="card-window">
					<Button className="btn-close-card-window" variant="light" onClick={closeCardWindow}>✕</Button>
					<div className="card-window-main">
						<div style={{ display: 'flex' }}>
							<h6 style={{ fontWeight: '600' }}>Description</h6>
						</div>
						<CardDescription />
					</div>
				</div>
			</div>
		</div>
	)
}

export default connect(mapStateToProps, null)(CardWindow)
