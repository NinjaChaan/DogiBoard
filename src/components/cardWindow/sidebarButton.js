import React from 'react'
import styled from 'styled-components'
import {
	RiCheckboxLine,
	RiUserAddLine,
	RiBookmark2Line,
	RiFileTransferLine,
	RiFileCopy2Line,
	RiDeleteBin2Line
} from 'react-icons/ri'
import Button from '../Button'

const ButtonContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: left;
`

const SidebarButton = ({
	iconName, func, text, hoverColor, hoverText, variant
}) => {
	let riIcon
	switch (iconName) {
		case 'RiCheckboxLine':
			riIcon = RiCheckboxLine
			break
		case 'RiUserAddLine':
			riIcon = RiUserAddLine
			break
		case 'RiBookmark2Line':
			riIcon = RiBookmark2Line
			break
		case 'RiFileTransferLine':
			riIcon = RiFileTransferLine
			break
		case 'RiFileCopy2Line':
			riIcon = RiFileCopy2Line
			break
		case 'RiDeleteBin2Line':
			riIcon = RiDeleteBin2Line
			break
		default:
			break
	}
	return (
		<Button warning={variant === 'warning'} warning_light={variant === 'warning_light'} primary={variant === 'primary'} light={variant === 'light'} onClick={func} hoverColor={hoverColor} hoverText={hoverText}>
			<ButtonContainer>
				{React.createElement(riIcon, { size: '18', style: { marginTop: '3px', marginLeft: '5px', marginRight: '5px' } })}
				{text}
			</ButtonContainer>
		</Button>
	)
}

export default SidebarButton
