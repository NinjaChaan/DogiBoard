import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import { connect } from 'react-redux'
import { deleteCard } from '../../actions/index'

const CardActions = ({ card, closeCardWindow, dispatch }) => {

	const deleteCardPressed = () => {
		dispatch(deleteCard(card))
		closeCardWindow()
	}

	return (
		<div className="card-sidebar-module">
			<h6 style={{ fontWeight: '600' }}>Actions</h6>
			<Button className="btn-card-sidebar" variant="light">Move</Button>
			<Button className="btn-card-sidebar" variant="light">Copy</Button>
			<Button className="btn-card-sidebar" variant="light" onClick={deleteCardPressed}>Delete</Button>
		</div>
	)
}

export default connect()(CardActions)
