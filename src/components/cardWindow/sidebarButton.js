import React from 'react'
import styled, { css } from 'styled-components'
import * as RI from 'react-icons/ri'

const ButtonContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: left;
`

const ButtonSidebar = styled.button`
    display: flex;
	justify-content: center;
	vertical-align: middle;
	padding: .375rem .75rem;
	height: 35px;
	width: 100%;
    background-color: rgb(228, 227, 227);
	margin-bottom: 10px;
	color: black;
	border: transparent;
	border-radius: 4px;
    outline:none;
	
	&:hover {
		background-color: rgb(212, 211, 211);
		outline:none;
		${(props) => props.hoverColor && css`
		background-color: ${props.hoverColor};
		`}
		${(props) => props.hoverText && css`
		color: ${props.hoverText};
		`}
	}
	}
	&:focus {
		border: transparent;
    	outline:none;
	}
	&:active {
		border: transparent;
    	outline:none;
	}
	&:visited {
		border: transparent;
    	outline:none;
	}
`

const SidebarButton = ({ iconName, func, text, hoverColor, hoverText }) => {
	const riIcon = RI[iconName]
	return (
		<ButtonSidebar onClick={func} hoverColor={hoverColor} hoverText={hoverText}>
			<ButtonContainer>
				{React.createElement(riIcon, { size: '18', style: { marginTop: '3px', marginLeft: '5px', marginRight: '5px' } })}
				{text}
			</ButtonContainer>
		</ButtonSidebar>
	)
}

export default SidebarButton
