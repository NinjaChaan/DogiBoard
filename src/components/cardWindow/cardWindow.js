import React, { useEffect, useState, Suspense } from 'react'
import { connect, useSelector } from 'react-redux'
import { setSelectedCard, updateCard } from '../../redux/actions/index'
import Button from 'react-bootstrap/Button'
import CardLabel from './cardLabel'
import styled from 'styled-components'
import CardTitle from './cardTitle'
import CardDescription from './cardDescription'
import CardSidebarModule from './cardSidebarModule'
import { device } from '../../devices'
import AvatarStyle from '../UserAvatar'
import LoadingAnimation from '../loadingAnimation'
import userService from '../../services/users'
import Dropdown from '../Dropdown'
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

const CardWindowContainer = ({ dispatch }) => {
	const currentUser = useSelector((state) => state.user.user)
	const selectedCard = useSelector((state) => state.selectedCard)
	const [members, setMembers] = useState([])
	const [showUserMenu, setShowUserMenu] = useState(false)
	const [clickedUser, setClickedUser] = useState()
	const [userInfoId, setUserInfoId] = useState('')
	const [userInfoPos, setUserInfoPos] = useState({})

	useEffect(() => {
		if (selectedCard && selectedCard.members) {
			const userArray = []
			const promises = selectedCard.members.map((user) => {
				if (user !== currentUser.id) {
					return userService.getOne(user)
				} else {
					userArray.splice(0, 0, currentUser)
				}
			}).filter((x) => x !== undefined)
			Promise.all(promises).then((responses) => {
				responses.map((response) => {
					if (response && response.data) {
						userArray.push(response.data)
					}
				})
				setMembers(userArray)
			})
		}
	}, [selectedCard])

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

	const removeMember = (member) => {
		setShowUserMenu(false)
		const members = selectedCard.members || []

		const findIndex = members.findIndex((u) => (u === member.id))

		members.splice(findIndex, 1)

		const updatedCard = {
			...selectedCard,
			members
		}
		dispatch(updateCard(updatedCard))
		dispatch(setSelectedCard(updatedCard))
	}

	const openUserInfoMenu = (member) => {
		const index = members.indexOf(member)
		setClickedUser(member)
		setUserInfoId(`userButton-${member.id}`)
		const rect = document.getElementById(`userButton-${member.id}`).getBoundingClientRect()
		console.log(rect)
		if (window.matchMedia('(min-width: 425px)').matches) {
			setUserInfoPos({ top: '155px', left: `${index * 46 + 20}px` })
		} else {
			setUserInfoPos({ top: `${rect.top + 50}px`, left: '0' })
		}
		setShowUserMenu(true)
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
								<h6 style={{ fontWeight: '600', userSelect: 'none' }}>Description</h6>
							</div>
							<CardDescription />
							{selectedCard.members && members.length > 0
								&& (
									<>
										<h6 style={{ userSelect: 'none', margin: '5px 0 5px 0' }}>Members</h6>
										<UsersContainer id="usersContainer">
											{members.map((member) => (
												<div key={member.id} style={{ margin: '0 3px' }}>
													<UsersUserButton link_transparent id={`userButton-${member.id}`} key={member.id} onClick={() => { openUserInfoMenu(member) }}><AvatarStyle user={member} size="40" noBorder /></UsersUserButton>
												</div>
											))}
											<Dropdown show={showUserMenu || false} setShowMenu={setShowUserMenu} parentId={userInfoId} width={300} position={userInfoPos}>
												{clickedUser && (
													<UsersContainer>
														<AvatarStyle update user={clickedUser} size={'50'} quality={4} />
														<div className="col">
															<UserName>{(clickedUser && clickedUser.username) || 'Default username'}</UserName>
															<RemoveUser onClick={() => removeMember(clickedUser)}> Remove from task </RemoveUser>
														</div>
													</UsersContainer>
												)}
											</Dropdown>
										</UsersContainer>
									</>
								)}
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

export default connect(null, null)(CardWindowContainer)
