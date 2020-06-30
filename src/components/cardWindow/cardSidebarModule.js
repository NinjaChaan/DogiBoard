import React, { useState, useEffect } from 'react'
import { connect, useSelector } from 'react-redux'
import styled, { css } from 'styled-components'
import { darken } from 'polished'
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
import AvatarStyle from '../UserAvatar'
import { device } from '../../devices'
import userService from '../../services/users'

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

const CategoryTitle = styled.h6`
	font-weight: 600;
	user-select: none;
`

const LabelDropdownButton = styled(Button)`
	padding-top: 3px;
	border: 3px solid transparent;

	background-color: ${(props) => props.backgroundColor || Button.backgroundColor};

	&:hover{
		background-color: ${(props) => darken(0.1, props.backgroundColor) || Button.backgroundColor};
		/* ${(props) => props.backgroundColor && css`filter: brightness(90%);`} */
		border: 3px solid transparent;
	}

	&.selected{
		border: 3px solid #fff;
	}
`

const UsersContainer = styled.div`
	/* display: -ms-flexbox;
	display: flex;
	-ms-flex-wrap: wrap;
	flex-wrap: wrap; */
	overflow-y: auto;
	/* max-height: 90px; */
	/* -ms-flex-preferred-size: 0;
	flex-basis: 0;
	-ms-flex-positive: 1;
	flex-grow: 1; */
	min-width: 0;
	max-width: 100%;
`

const UsersDropdownStyle = styled(Dropdown)`
	margin: 0 auto;
	@media ${(props) => props.theme.device.mobileL} {	
		margin: none;
	}
`

const UserButton = styled(Button)`
	display: contents;
	padding-top: 0px;
	background-color: transparent;
	width: 45px;
	height: 45px;
	margin: 5.5px 5.5px 0px 5.5px;
	margin-left: 0px;

	&:hover{
		background-color: transparent;
	}
`

const UserName = styled.span`
	/* margin: auto auto auto 10px; */
	font-weight: 600;
	/* display: -ms-flexbox;
	display: flex;
	-ms-flex-wrap: wrap;
	flex-wrap: wrap; */
	/* text-overflow: ellipsis;
	overflow: hidden; */
	white-space: nowrap;
	/* display: block; */
	display: inline-block;
	user-select: none;
	
	${(props) => (props.userOnBoard) && css`
		margin-bottom: -5px;
		margin-top: 5px;
	`}
`

const MatchedUsersContainer = styled.div`
	display: -ms-flexbox;
	display: -webkit-box;
	display: -webkit-flex;
	display: -ms-flexbox;
	display: flex;
	-ms-flex-wrap: wrap;
	-webkit-flex-wrap: wrap;
	-ms-flex-wrap: wrap;
	flex-wrap: wrap;
	margin-bottom: 5px;
	cursor: default;
	border: 2px solid transparent;
	max-width: 280px;
	padding: 2px 5px;
	border-radius: 4px;
	width: 100%;

	${(props) => props.selected && css`
		border: 2px solid #557dff;
		border-radius: 4px;
	`}	

	&:hover{
		${(props) => !props.userOnBoard && css`
			cursor: pointer;
			background-color: rgba(0, 0, 0, 0.07);
		`}		
	}
`

const UserInfoContainer = styled.div`
	/* -ms-flex-preferred-size: 0;
	flex-basis: 0;
	-ms-flex-positive: 1;
	flex-grow: 1;
	min-width: 0;
	flex: 0 0 75%;
	max-width: 75%; */
	display: inline-block;
	padding-left: 10px;
	${(props) => !props.userOnBoard && css`
		display: flex;
		align-items: center;
	`}
`

const UserInfo = styled.span`
	font-size: smaller;
`

const CardSidebarModule = ({ closeCardWindow, dispatch }) => {
	const currentUser = useSelector((state) => state.user.user)
	const board = useSelector((state) => state.board.board)
	const selectedCard = useSelector((state) => state.selectedCard)
	const [showLabelMenu, setShowLabelMenu] = useState(false)
	const [showUsersMenu, setShowUsersMenu] = useState(false)
	const [users, setUsers] = useState([])

	const memberOnTask = (member) => {
		if (selectedCard.members) {
			return selectedCard.members.findIndex((u) => (u === member.id)) > -1
		}
		return false
	}

	useEffect(() => {
		if (board && board.users) {
			const userArray = []
			const promises = board.users.map((user) => {
				if (user.id !== currentUser.id) {
					return userService.getOne(user.id)
				}
			}).filter((x) => x !== undefined)
			Promise.all(promises).then((responses) => {
				responses.map((response) => {
					if (response && response.data) {
						userArray.push(response.data)
					}
				})
				for (let i = 0; i < userArray.length; i++) {
					if (memberOnTask(userArray[i])) {
						userArray.splice(0, 0, userArray.splice(i, 1)[0])
					}
				}

				userArray.splice(0, 0, currentUser)
				setUsers(userArray)
			})
		}
	}, [board])

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

		dispatch(setSelectedCard(newCard))
		dispatch(updateChecklist(newChecklist))
	}

	const toggleMember = (member) => {
		const members = selectedCard.members || []

		const findIndex = members.findIndex((u) => (u === member.id))

		if (findIndex > -1) {
			members.splice(findIndex, 1)
		} else {
			members.push(member.id)
		}

		const updatedCard = {
			...selectedCard,
			members
		}
		dispatch(updateCard(updatedCard))
		dispatch(setSelectedCard(updatedCard))
	}

	return (
		<>
			<SidebarModule className="col">
				<CategoryTitle>Add to card</CategoryTitle>
				{selectedCard.checklist
					? null
					: (
						<SidebarButton variant="light" className="btn-card-sidebar" func={addChecklistPressed} text="Checklist" iconName="RiCheckboxLine" />
					)}
				<SidebarButton id="memberButton" variant="light" className="btn-card-sidebar" func={() => { setShowUsersMenu(!showUsersMenu) }} text="Members" iconName="RiUserAddLine" />
				{board && users && users.length > 0 && (
					<UsersDropdownStyle maxContent padding="5px" bgColor="rgb(228, 225, 225)" show={showUsersMenu || false} setShowMenu={setShowUsersMenu} parentId="memberButton">
						<UsersContainer id="usersContainer">
							{users.map((user) => (
								<div key={user.id} style={{ width: '100%' }}>
									{/* <UserButton link_transparent id={`userButton-${user.id}`} key={user.id} onClick={() => { openUserInfoMenu(user) }}><AvatarStyle user={user} size="40" noBorder /></UserButton> */}
									<MatchedUsersContainer className="col" key={user.id} onMouseDown={() => { toggleMember(user) }}>
										<UserButton link_transparent><AvatarStyle user={user} title={false} size="30" noMargin /></UserButton>
										<UserInfoContainer>
											<UserName>{user.username}</UserName>
											{memberOnTask(user) && <UserName style={{ right: '5px', position: 'absolute' }}>✓</UserName>}
										</UserInfoContainer>
									</MatchedUsersContainer>
								</div>
							))}
						</UsersContainer>
					</UsersDropdownStyle>
				)}
				<SidebarButton id="labelButton" variant="light" className="btn-card-sidebar" func={() => { setShowLabelMenu(!showLabelMenu) }} text="Label" iconName="RiBookmark2Line" />

				<Dropdown show={showLabelMenu || false} setShowMenu={setShowLabelMenu} parentId="labelButton">
					<IconContext.Provider value={{ size: 18, style: { marginTop: '3px', marginLeft: '5px', marginRight: '5px' } }}>
						<LabelDropdownButton className={selectedCard.label || 'selected'} light backgroundColor="#ffffff" onClick={() => updateCardLabelPressed(null)}>
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
				<CategoryTitle>Actions</CategoryTitle>
				<SidebarButton variant="light" className="btn-card-sidebar" text="Move" iconName="RiFileTransferLine" />
				<SidebarButton variant="light" className="btn-card-sidebar" text="Copy" iconName="RiFileCopy2Line" />
				<SidebarButton variant="warning_light" className="btn-card-sidebar" func={deleteCardPressed} text="Delete" iconName="RiDeleteBin2Line" />
			</SidebarModule>
		</>
	)
}

export default connect(null, null)(CardSidebarModule)
