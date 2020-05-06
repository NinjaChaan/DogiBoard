import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { setSelectedCard, updateChecklist, deleteCard } from '../../redux/actions/index'
import SidebarButton from './sidebarButton'

const SidebarModule = styled.div`	
    float: right;
    width: 100%;
    position: relative;
`

const CardSidebarModule = ({ selectedCard, closeCardWindow, dispatch }) => {
	const deleteCardPressed = () => {
		dispatch(deleteCard(selectedCard))
		closeCardWindow()
	}

	const addChecklistPressed = () => {
		const checklist = { text: 'Checklist', checkItems: [] }
		const newCard = {
			...selectedCard,
			checklist
		}

		const newChecklist = {
			checklist,
			id: selectedCard.id,
			listId: selectedCard.listId
		}

		console.log(dispatch(setSelectedCard(newCard)))
		console.log(dispatch(updateChecklist(newChecklist)))
	}
	return (
		<div>
			<SidebarModule className="col">
				<h6 style={{ fontWeight: '600' }}>Add to card</h6>
				{selectedCard.checklist
					? null
					: (
						<SidebarButton className="btn-card-sidebar" variant="light" func={addChecklistPressed} text="Checklist" iconName="RiCheckboxLine" />
					)}
				<SidebarButton className="btn-card-sidebar" variant="light" func={addChecklistPressed} text="Members" iconName="RiUserAddLine" />
				<SidebarButton className="btn-card-sidebar" variant="light" func={addChecklistPressed} text="Label" iconName="RiBookmark2Line" />
			</SidebarModule>
			<SidebarModule className="col">
				<h6 style={{ fontWeight: '600' }}>Actions</h6>
				<SidebarButton className="btn-card-sidebar" variant="light" text="Move" iconName="RiFileTransferLine" />
				<SidebarButton className="btn-card-sidebar" variant="light" text="Copy" iconName="RiFileCopy2Line" />
				<SidebarButton className="btn-card-sidebar" variant="light" func={deleteCardPressed} text="Delete" iconName="RiDeleteBin2Line" hoverColor="crimson" hoverText="white" />
			</SidebarModule>
		</div>
	)
}

export default connect(null, null)(CardSidebarModule)
