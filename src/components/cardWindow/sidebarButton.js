import React from 'react'
import styled from 'styled-components'
import * as RI from 'react-icons/ri'
import Button from '../Button'

const ButtonContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: left;
`

const SidebarButton = ({
	iconName, func, text, hoverColor, hoverText, variant
}) => {
	const riIcon = RI[iconName]
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
