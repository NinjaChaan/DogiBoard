import React, { useEffect } from 'react'
import { connect } from 'react-redux'
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
	const getAllHook = () => {
		boardService.getAll().then((response) => {
			console.log(dispatch(setLists(response[0].lists)))
		})
	}
	useEffect(getAllHook, [])
	return (
		<PageStyle>
			{children}
		</PageStyle>
	)
}

export default connect(null, null)(Page)
