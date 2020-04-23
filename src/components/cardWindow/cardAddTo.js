import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'

const CardAddTo = () => {
	return (
		<div className="card-sidebar-module">
			<h6 style={{ fontWeight: '600' }}>Add to card</h6>
			<Button className="btn-card-sidebar" variant="light">Checklist</Button>
			<Button className="btn-card-sidebar" variant="light">Members</Button>
			<Button className="btn-card-sidebar" variant="light">Label</Button>
		</div>
	)
}

export default CardAddTo
