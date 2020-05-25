import React, { useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import styled from 'styled-components'
import boardService from '../services/boards'
import LoginPage from './loginPage/loginPage'
import { device } from '../devices'
import { setLists } from '../redux/actions/index'
import EventSourcePoly from 'eventsource'

const mapStateToProps = (state) => {
	console.log('state at page', state)
	const user = state.user
	return (
		({
			user
		})
	)
}

const PageStyle = styled.div`
display: flex;
position: relative;

height: 100%;
max-width: 200px;

@media ${device.mobileS}{
	max-width: 100%;
}
@media ${device.mobileM}{
	max-width: 100%;
}
@media ${device.mobileL}{
	max-width: 100%;
}

@media ${device.laptop} { 
	max-width: 100%;
}

@media ${device.desktop} {
	max-width: 100%;
}
`
const Page = ({ children, dispatch, user }) => {
	const lists = useSelector((state) => state.listReducer.lists)
	const [firstStateGotten, setFirstStateGotten] = useState(false)
	const [ignoreNextUpdate, setIgnoreNextUpdate] = useState(true)
	const [loggedIn, setLoggedIn] = useState(false)

	// Listen to server events (someone else changed something on their client)
	React.useEffect(() => {
		if (user.loggedIn) {
			setLoggedIn(true)
		}
		if (user.loggedIn) {
			console.log('Conncting to event stream:', '/api/boards/stream/5eca9eb8ac8fb5275c45e1c5')
			console.log('evt poly:', EventSourcePoly)
			const eventSourceInitDict = {
				headers: {
					Authorization: `Bearer ${user.token}`
				}
			}
			const eventSource = new EventSourcePoly('/api/boards/stream/5eca9eb8ac8fb5275c45e1c5', eventSourceInitDict)
			console.log('events', eventSource)
			eventSource.onopen = (m) => {
				console.log('Connected!', m)
			}
			eventSource.onerror = (e) => console.log(e)
			eventSource.onmessage = (e) => {
				const data = JSON.parse(e.data)
				setFirstStateGotten(true)
				setIgnoreNextUpdate(true)
				dispatch(setLists(data.lists))
			}
		}
	}, [user])

	// Get all data from mongodb at the start
	const getAllHook = () => {
		if (loggedIn) {
			boardService.getOne('5eca9eb8ac8fb5275c45e1c5').then((response) => {
				console.log('response', response)
				dispatch(setLists(response[0].lists))
				// console.log(dispatch(setLists(response[0].lists)))
				console.log('loaded lists', response[0].lists)
				setFirstStateGotten(true)
			})
		}
	}
	useEffect(getAllHook, [])

	// If lists change in store, and first state has been loaded, send changes to mongodb
	useEffect(() => {
		console.log('list change', lists)
		if (firstStateGotten && !ignoreNextUpdate) {
			console.log('sending lists', lists)

			const updatedBoard = {
				name: 'TestBoard',
				lists
			}

			boardService.update('5eca9eb8ac8fb5275c45e1c5', updatedBoard).then((response) => {
				console.log(response)
			})
		} else if (ignoreNextUpdate) {
			setIgnoreNextUpdate(false)
		}
	}, [lists])

	if (loggedIn) {
		return (
			<PageStyle>
				{children}
			</PageStyle>
		)
	}
	return (
		<LoginPage />
	)
}

export default connect(mapStateToProps, null)(Page)
