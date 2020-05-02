import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Button from 'react-bootstrap/Button'
import CardTitle from './cardTitle'
import CardDescription from './cardDescription'
import CardAddTo from './cardAddTo'
import CardActions from './cardActions'
import Checklist from './checklist'

const mapStateToProps = (state) => {
	console.log('state at cardwindiw', state.selectedCard)
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
				<div className="card-window-header">
					<CardTitle
						listTitle={selectedCard.text}
						id={selectedCard.id}
						listId={selectedCard.listId}
					/>
				</div>
				<Button className="btn-close-card-window" variant="light" onClick={closeCardWindow}>✕</Button>
				<div className="container-lg">
					<div className="row">
						<div className="col-8 pl-4">
							<div style={{ display: 'flex' }}>
								<h6 style={{ fontWeight: '600' }}>Description</h6>
							</div>
							<CardDescription />
							{selectedCard.checklist
								? <Checklist selectedCard={selectedCard} />
								: null}
						</div>
						<div className="col">
							<CardAddTo selectedCard={selectedCard} />
							<CardActions card={selectedCard} closeCardWindow={closeCardWindow} />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default connect(mapStateToProps, null)(CardWindow)
