import React, { useEffect, Suspense } from 'react'
import { connect } from 'react-redux'
import { setSelectedCard } from '../../redux/actions/index'
import Button from 'react-bootstrap/Button'
import CardLabel from './cardLabel'
import styled from 'styled-components'
import CardTitle from './cardTitle'
import CardDescription from './cardDescription'
import CardSidebarModule from './cardSidebarModule'
import { device } from '../../devices'
import LoadingAnimation from '../loadingAnimation'
const Checklist = React.lazy(() => import('./checklist'))

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
	flex: 0 0 30%;
	max-width: 30%;
  	}
	/* If screen is at least laptop */
	@media ${device.laptop} {
		flex: 0 0 20%;
		max-width: 20%;
	}
`

const MainContainerLeft = styled.div`
	position: relative;
	width: 100%;
	flex: 0 0 100%;
	max-width: 100%;
	padding-right: 1.5rem !important;
	padding-left: 1.5rem !important;
	
	/* If screen is at least mobileL */
	@media ${device.mobileL} {
		padding-right: 0px !important;
		flex: 0 0 70%;
		max-width: 70%;
	}
	/* If screen is at least laptop */
	@media ${device.laptop} {
		flex: 0 0 80%;
		max-width: 80%;
	}
`

const CardHeader = styled.div`
	min-height: 24px;
    padding: 0 8px 0px 0px;
    position: relative;
    width: 100%;
`

const mapStateToProps = (state) => {
	// console.log('state at cardwindiw', state.selectedCard)
	return { selectedCard: state.selectedCard }
}

const CardWindowContainer = ({ selectedCard, dispatch }) => {
	const closeCardWindow = () => {
		document.getElementById('window-overlay').style.display = 'none'
		const selectedCard = {
		}
		dispatch(setSelectedCard(selectedCard))
	}

	function downHandler({ key }) {
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

	const handleChildClick = (e) => {
		e.stopPropagation()
	}
	return (
		<WindowOverlay id="window-overlay" className="window-overlay" onClick={closeCardWindow}>
			<CardWindow id="card-window" className="window row" tabIndex="0" onClick={handleChildClick}>
				{selectedCard.label
					? <CardLabel label={selectedCard.label} />
					: null}
				<CardHeader className="col-10">
					<CardTitle
						listTitle={selectedCard.name}
						id={selectedCard.id}
						listId={selectedCard.listId}
					/>
				</CardHeader>
				<Button className="btn-close-card-window" variant="light" onMouseDown={closeCardWindow}>✕</Button>
				<div className="container-lg">
					<CardWindowMain className="row">
						<MainContainerLeft>
							<div style={{ display: 'flex' }}>
								<h6 style={{ fontWeight: '600' }}>Description</h6>
							</div>
							<CardDescription />
							{selectedCard.checklist
								? <Suspense fallback={<></>}>
									<Checklist selectedCard={selectedCard} />
								</Suspense>
								: null}
						</MainContainerLeft>
						<SideBar>
							<CardSidebarModule selectedCard={selectedCard} closeCardWindow={closeCardWindow} />
						</SideBar>
					</CardWindowMain>
					<div style={{ height: '200px' }} />
				</div>
			</CardWindow>
		</WindowOverlay>
	)
}

export default connect(mapStateToProps, null)(CardWindowContainer)
