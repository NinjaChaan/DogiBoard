import React, { useState, useEffect } from 'react'
import { connect, useSelector } from 'react-redux'
import styled, { css } from 'styled-components'
import {
	RiCheckboxLine,
	// RiBug2Line,
	// RiStarLine,
	// RiCloseLine,
	RiToolsLine
} from 'react-icons/ri'
import { MdBugReport, MdStar } from 'react-icons/md'
import { toTitleCase } from '../utils/stringUtils'
import { setSelectedCard, updateCard } from '../redux/actions/index'
import Dropdown from './Dropdown'
import userService from '../services/users'
import UserAvatar from './UserAvatar'
import Button from './Button'

const ChecklistArea = styled.div`
	display: inline-block;
	max-height: 25px;
	border-radius: 4px;
	background-color: #f7f5f5;
	border: 2px solid transparent;
`
const ChecklistText = styled.span`
	position: relative;
	top: -2px;
	display: inline-block;
	font-size: 0.8rem;
	padding-right: 2px;
`

const UsersUserButton = styled(Button)`
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

const UsersContainer = styled.div`
	display: -ms-flexbox;
	display: flex;
	-ms-flex-wrap: wrap;
	flex-wrap: wrap;
	/* overflow-y: auto; */
	max-height: 90px;
	margin-left: auto;
`
const RemoveUser = styled.span`
	color: rgb(100, 100, 100) !important;
	user-select: none;

	&:hover{
		text-decoration: underline;
		cursor: pointer;
	}
`

const UserName = styled.span`
	/* margin: auto auto auto 10px; */
	font-weight: 600;
	/* display: -ms-flexbox;
	display: flex;
	-ms-flex-wrap: wrap;
	flex-wrap: wrap; */
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	display: block;
	user-select: none;
	
	${(props) => (props.userOnBoard) && css`
		margin-bottom: -5px;
		margin-top: 5px;
	`}
`

const InfoContainer = styled.div`
	display: -ms-flexbox;
	display: flex;
	-ms-flex-wrap: wrap;
	flex-wrap: wrap;
	margin-bottom: -5px;
	margin-top: 2px;
`

const UserButtonContainer = styled.div`
	margin: 0 3px;
	${(props) => (props.initials) && css`
		padding-top: 2px;
	`}
`

const CardInfo = ({ card, dispatch }) => {
	const [allChecksDone, setAllChecksDone] = useState(false)
	const [checksCount, setChecksCount] = useState(0)
	const [doneChecksCount, setDoneChecksCount] = useState(0)
	const [showUserMenu, setShowUserMenu] = useState(false)
	const [clickedUser, setClickedUser] = useState()
	const [userInfoId, setUserInfoId] = useState('')
	const [userInfoPos, setUserInfoPos] = useState({})
	const [members, setMembers] = useState([])

	let riIcon
	let fillColor
	switch (card.label) {
		case 'bug':
			riIcon = MdBugReport
			fillColor = 'crimson'
			break
		case 'feature':
			riIcon = MdStar
			fillColor = '#fab000'
			break
		case 'chore':
			riIcon = RiToolsLine
			fillColor = 'black'
			break
		default:
			break
	}

	useEffect(() => {
		if (card.checklist) {
			setChecksCount(card.checklist.checkItems.length)
			setDoneChecksCount(card.checklist.checkItems.filter((item) => item.done).length)
			setAllChecksDone(card.checklist.checkItems.length === card.checklist.checkItems.filter((item) => item.done).length || false)
		}
		console.log('card', card)
		if (card && card.members) {
			userService.getMany(card.members).then((userArray) => {
				if (userArray.map((x) => x.id).join('') !== members.map((x) => x.id).join('')) {
					console.log('members change', userArray.map((x) => x.id).join(''), members.map((x) => x.id).join(''))
					setMembers(userArray)
				}
			})
		}
	}, [card])

	const Checklist = () => {
		if (card.checklist && checksCount > 0) {
			return (
				<ChecklistArea allChecksDone={allChecksDone}>
					<RiCheckboxLine scale="1.1" color={allChecksDone ? '#02c102' : 'black'} style={{ marginBottom: '5px' }} />
					<ChecklistText>
						{`${doneChecksCount}/${checksCount}`}
					</ChecklistText>
				</ChecklistArea>
			)
		}
		return (null)
	}

	const Label = () => (
		<>
			{React.createElement(riIcon, {
				size: 20, title: toTitleCase(card.label), fill: fillColor, style: { marginTop: '3px', marginRight: '3px' }
			})}
		</>
	)

	const removeMember = (member) => {
		setShowUserMenu(false)

		const newMembers = card.members.filter((u) => (u !== member.id))

		const updatedCard = {
			...card,
			members: newMembers
		}

		dispatch(updateCard(updatedCard))
		dispatch(setSelectedCard(updatedCard))
	}

	const openUserInfoMenu = (member) => {
		// const index = members.indexOf(member)
		// setClickedUser(member)
		// setUserInfoId(`userButton-${member.id}`)
		// const rect = document.getElementById(`userButton-${member.id}`).getBoundingClientRect()
		// if (window.matchMedia('(min-width: 425px)').matches) {
		// 	setUserInfoPos({ top: '155px', left: `${index * 46 + 20}px` })
		// } else {
		// 	setUserInfoPos({ top: `${rect.top - 50}px`, left: '0' })
		// }
		// setShowUserMenu(true)
	}

	const handleChildClick = (e) => {
		e.stopPropagation()
	}
	// <UserButtonContainer key={member.id} initials={member.avatar && member.avatar.avatarType === 'initials'} onClick={handleChildClick}>
	// 						<UsersUserButton link_transparent id={`userButton-${member.id}`} key={member.id} onClick={() => { openUserInfoMenu(member) }}><UserAvatar user={member} size="25" noBorder /></UsersUserButton>
	// 					</UserButtonContainer>

	const Members = () => {
		console.log('members', members)
		if (members && members.length > 0) {
			return (
				<UsersContainer id="usersContainer">
					{members.map((member) => (
						<UserButtonContainer key={member.id} initials={member.avatar && member.avatar.avatarType === 'initials'} >
							<UsersUserButton link_transparent id={`userButton-${member.id}`} key={member.id} onClick={() => { openUserInfoMenu(member) }}><UserAvatar user={member} size="25" noBorder /></UsersUserButton>
						</UserButtonContainer>
					))}
					<Dropdown show={showUserMenu || false} setShowMenu={setShowUserMenu} parentId={userInfoId} width={300} position={userInfoPos}>
						{clickedUser && (
							<UsersContainer>
								<UserAvatar user={clickedUser} size="50" quality={4} />
								<div className="col">
									<UserName>{(clickedUser && clickedUser.username) || 'Default username'}</UserName>
									<RemoveUser onClick={() => removeMember(clickedUser)}> Remove from task </RemoveUser>
								</div>
							</UsersContainer>
						)}
					</Dropdown>
				</UsersContainer>
			)
		}
		return (null)
	}

	return (
		<InfoContainer>
			{card.label
				? <Label />
				: null}
			<Checklist />
			<Members />
		</InfoContainer>
	)
}

export default connect(null, null)(CardInfo)
