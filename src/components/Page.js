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
	const [firstGot, setFirstGot] = useState(false)

	const getAllHook = () => {
		boardService.getAll().then((response) => {
			console.log(dispatch(setLists(response[0].lists)))
			setFirstGot(true)
		})
	}
	useEffect(getAllHook, [])

	useEffect(() => {
		if (firstGot) {
			console.log('sending lists', lists)

			const updatedBoard = {
				name: 'TestBoard',
				lists
			}

			boardService.update('5ebab8e68a214a322436bfe9', updatedBoard).then((response) => {
				console.log(response)
			})
		}
	}, [lists])

	return (
		<PageStyle>
			{children}
		</PageStyle>
	)
}

export default connect(null, null)(Page)
