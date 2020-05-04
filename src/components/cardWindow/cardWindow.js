import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Button from 'react-bootstrap/Button'
import styled from 'styled-components'
import CardTitle from './cardTitle'
import CardDescription from './cardDescription'
import CardAddTo from './cardAddTo'
import CardActions from './cardActions'
import Checklist from './checklist'
import { device } from '../../devices'

const CardWindowMain = styled.div`
	display: flex;
	flex-direction: column;

	@media ${device.mobileL} {
    flex-direction: row;
  	}
`

const CardWindow = styled.div`
	display: block;
	width: 100%;
	
	@media ${device.laptop} {
    width: 80%;
	max-width: 1024px;
  	}

`

const WindowOverlay = styled.div`
	display: none;
	width: 100vw;
	position: fixed;
	-webkit-backface-visibility: hidden;
	left: 0;
	top: 0;
	/* max-width: 320px; */

	@media ${device.laptop} {
	/* max-width: 1024px; */
  	}
`

const SideBar = styled.div`
	/* If screen is max mobileL */
	@media ${device.mobileLMAX} {
	display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    margin-right: 8px;
	margin-left: 8px;
	margin-top: 15px;
	}
	
	/* If screen is at least mobileL */
	@media ${device.mobileL} {
	-ms-flex-preferred-size: 0;
	flex-basis: 0;
	-ms-flex-positive: 1;
	flex-grow: 1;
	max-width: 100%;
	position: relative;
	width: 100%;
	padding-right: 15px;
	padding-left: 15px;
	margin-top: 0px;
  	}
`

const MainContainerLeft = styled.div`
	position: relative;
	width: 100%;
	padding-right: 15px;
	padding-left: 15px;
	flex: 0 0 100%;
	max-width: 100%;
	padding-left: 1.5rem !important;

	/* If screen is at least mobileL */
	@media ${device.mobileL} {
		flex: 0 0 66.666667%;
		max-width: 66.666667%;
	}
`

const mapStateToProps = (state) => {
	console.log('state at cardwindiw', state.selectedCard)
	return { selectedCard: state.selectedCard }
}

const CardWindowContainer = ({ selectedCard }) => {
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
		<WindowOverlay id="window-overlay" className="window-overlay" onClick={closeCardWindow}>
			<CardWindow id="card-window" className="window row" tabIndex="0" onClick={handleChildClick}>
				<div className="card-window-header col-10">
					<CardTitle
						listTitle={selectedCard.text}
						id={selectedCard.id}
						listId={selectedCard.listId}
					/>
				</div>
				<Button className="btn-close-card-window" variant="light" onClick={closeCardWindow}>✕</Button>
				<div className="container-lg">
					<CardWindowMain className="row">
						<MainContainerLeft>
							<div style={{ display: 'flex' }}>
								<h6 style={{ fontWeight: '600' }}>Description</h6>
							</div>
							<CardDescription />
							{selectedCard.checklist
								? <Checklist selectedCard={selectedCard} />
								: null}
						</MainContainerLeft>
						<SideBar>
							<CardAddTo selectedCard={selectedCard} />
							<CardActions card={selectedCard} closeCardWindow={closeCardWindow} />
						</SideBar>
					</CardWindowMain>
				</div>
			</CardWindow>
		</WindowOverlay>
	)
}

export default connect(mapStateToProps, null)(CardWindowContainer)
