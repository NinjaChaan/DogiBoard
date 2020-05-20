import React, { useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import styled from 'styled-components'
import boardService from '../services/boards'
import { device } from '../devices'
import { setLists } from '../redux/actions/index'

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
const Page = ({ children, dispatch }) => {
	const lists = useSelector((state) => state.listReducer.lists)
	const [firstStateGotten, setFirstStateGotten] = useState(false)
	const [ignoreNextUpdate, setIgnoreNextUpdate] = useState(true)

	// Listen to server events (someone else changed something on their client)
	React.useEffect(() => {
		console.log('Conncting to event stream:', '/stream/5ebae66d8e142057446007d7')
		const eventSource = new EventSource('/stream/5ebae66d8e142057446007d7')
		eventSource.onopen = (m) => {
			console.log('Connected!', m)
		}
		eventSource.onerror = (e) => console.log(e)
		eventSource.onmessage = (e) => {
			const data = JSON.parse(e.data)
			console.log(data)
			setIgnoreNextUpdate(true)
			dispatch(setLists(data.lists))
		}
	}, [])

	// Get all data from mongodb at the start
	const getAllHook = () => {
		boardService.getAll().then((response) => {
			dispatch(setLists(response[0].lists))
			// console.log(dispatch(setLists(response[0].lists)))
			console.log('loaded lists', response[0].lists)
			setFirstStateGotten(true)
		})
	}
	useEffect(getAllHook, [])

	// If lists change in store, and first state has been loaded, send changes to mongodb
	useEffect(() => {
		if (firstStateGotten && !ignoreNextUpdate) {

			console.log('sending lists', lists)

			const updatedBoard = {
				name: 'TestBoard',
				lists
			}

			boardService.update('5ebae66d8e142057446007d7', updatedBoard).then((response) => {
				console.log(response)
			})
		} else if (ignoreNextUpdate) {
			setIgnoreNextUpdate(false)
		}
	}, [lists])

	return (
		<PageStyle>
			{children}
		</PageStyle>
	)
}

export default connect(null, null)(Page)
