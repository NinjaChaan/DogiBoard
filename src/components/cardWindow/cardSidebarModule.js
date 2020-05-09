import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { setSelectedCard, updateChecklist, deleteCard } from '../../redux/actions/index'
import SidebarButton from './sidebarButton'
import { device } from '../../devices'

const SidebarModule = styled.div`	
    float: right;
    width: 100%;
    position: relative;
	flex: 0 0 50%;
	max-width: 50%;
	-ms-flex-preferred-size: 0;
	flex-basis: 0;
	-ms-flex-positive: 1;
	flex-grow: 1;
	max-width: 100%;
	padding-right: 15px;

	@media ${device.laptop} {
		padding-right: 0 !important;
  	}
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
		<>
			<SidebarModule className="col">
				<h6 style={{ fontWeight: '600' }}>Add to card</h6>
				{selectedCard.checklist
					? null
					: (
						<SidebarButton variant="light" className="btn-card-sidebar" func={addChecklistPressed} text="Checklist" iconName="RiCheckboxLine" />
					)}
				<SidebarButton variant="light" className="btn-card-sidebar" func={addChecklistPressed} text="Members" iconName="RiUserAddLine" />
				<SidebarButton variant="light" className="btn-card-sidebar" func={addChecklistPressed} text="Label" iconName="RiBookmark2Line" />
			</SidebarModule>
			<SidebarModule className="col">
				<h6 style={{ fontWeight: '600' }}>Actions</h6>
				<SidebarButton variant="light" className="btn-card-sidebar" text="Move" iconName="RiFileTransferLine" />
				<SidebarButton variant="light" className="btn-card-sidebar" text="Copy" iconName="RiFileCopy2Line" />
				<SidebarButton variant="warning_light" className="btn-card-sidebar" func={deleteCardPressed} text="Delete" iconName="RiDeleteBin2Line" />
			</SidebarModule>
		</>
	)
}

export default connect(null, null)(CardSidebarModule)
