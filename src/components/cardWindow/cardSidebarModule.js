import React, { useState } from 'react'
import { connect } from 'react-redux'
import styled, { css } from 'styled-components'
import {
	RiBug2Line,
	RiStarLine,
	RiCloseLine,
	RiToolsLine
} from 'react-icons/ri'
import { MdBugReport, MdStar } from 'react-icons/md'
import { IconContext } from 'react-icons'
import {
	setSelectedCard, updateChecklist, updateCard, deleteCard
} from '../../redux/actions/index'
import SidebarButton from './sidebarButton'
import Dropdown from '../Dropdown'
import Button from '../Button'
import { device } from '../../devices'

const ButtonContainer = styled.div`
width: 100%;
display: flex;
justify-content: left;
`

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

const LabelDropdownButton = styled(Button)`
	padding-top: 3px;
	border: 3px solid transparent;

	background-color: ${(props) => props.backgroundColor || Button.backgroundColor};

	&:hover, &:focus, &:active{
		background-color: ${(props) => props.backgroundColor || Button.backgroundColor};
		${(props) => props.backgroundColor && css`filter: brightness(90%);`}
		border: 3px solid transparent;
	}

	&.selected{
		border: 3px solid #fff;
	}
`

const CardSidebarModule = ({ selectedCard, closeCardWindow, dispatch }) => {
	const [showLabelMenu, setShowLabelMenu] = useState(false)

	console.log('selected label', selectedCard)

	const deleteCardPressed = () => {
		dispatch(deleteCard(selectedCard))
		closeCardWindow()
	}

	const updateCardLabelPressed = (label) => {
		const newCard = {
			...selectedCard,
			label
		}
		console.log(dispatch(updateCard(newCard)))
		console.log(dispatch(setSelectedCard(newCard)))
	}

	const addChecklistPressed = () => {
		const checklist = { name: 'Checklist', checkItems: [] }
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
				<SidebarButton id="labelButton" variant="light" className="btn-card-sidebar" func={() => { setShowLabelMenu(!showLabelMenu) }} text="Label" iconName="RiBookmark2Line" />

				<Dropdown show={showLabelMenu || false} setShowMenu={setShowLabelMenu} parentId="labelButton">
					<IconContext.Provider value={{ size: 18, style: { marginTop: '3px', marginLeft: '5px', marginRight: '5px' } }}>
						<LabelDropdownButton className={selectedCard.label || 'selected'} light onClick={() => updateCardLabelPressed(null)}>
							<ButtonContainer>
								{React.createElement(RiCloseLine, { size: 20, style: { marginLeft: '3px' } })}
								No label
							</ButtonContainer>
						</LabelDropdownButton>
						<LabelDropdownButton className={selectedCard.label === 'feature' && 'selected'} light backgroundColor="#ffd840" onClick={() => updateCardLabelPressed('feature')}>
							<ButtonContainer>
								{React.createElement(MdStar, { /* fill: '#fab000' */ })}
								Feature
							</ButtonContainer>
						</LabelDropdownButton>
						<LabelDropdownButton className={selectedCard.label === 'bug' && 'selected'} light backgroundColor="#f43b3b" onClick={() => updateCardLabelPressed('bug')}>
							<ButtonContainer>
								{React.createElement(MdBugReport, { size: 22, /* fill: 'crimson', */ style: { marginTop: '2px', marginLeft: '3px', marginRight: '3px' } })}
								Bug
							</ButtonContainer>
						</LabelDropdownButton>
						<LabelDropdownButton className={selectedCard.label === 'chore' && 'selected'} light backgroundColor="#5991f2" style={{ marginBottom: '0px' }} onClick={() => updateCardLabelPressed('chore')}>
							<ButtonContainer>
								{React.createElement(RiToolsLine, {})}
								Chore
							</ButtonContainer>
						</LabelDropdownButton>
					</IconContext.Provider>
				</Dropdown>

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
