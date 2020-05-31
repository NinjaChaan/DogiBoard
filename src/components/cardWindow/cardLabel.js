import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import {
	RiCheckboxLine,
	RiBug2Line,
	RiStarLine,
	RiCloseLine,
	RiToolsLine
} from 'react-icons/ri'
import { MdBugReport, MdStar } from 'react-icons/md'

const LabelContainer = styled.div`
	/* margin-left: 1.5rem; */
	margin-bottom: -20px;
	font-weight: 600;
	display: inline-block;
	padding: 5px;
	padding-top: 8px;
	/* border-radius: 4px; */
	width: 110%;
	padding-left: 25px;

	background-color: ${(props) => (props.label === 'bug' && '#f43b3b')
		|| (props.label === 'feature' && '#ffd840')
		|| (props.label === 'chore' && '#5991f2')
};
`

const CardLabel = ({ label }) => {
	let riIcon
	let fillColor
	switch (label) {
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

	const LabelToUpper = () => label[0].toUpperCase() + label.slice(1)

	return (
		<LabelContainer label={label}>
			{React.createElement(riIcon, {
				size: 20, title: `This task is a ${label}`, /* fill: fillColor, */ style: { marginBottom: '5px', marginRight: '3px' }
			})}
			{LabelToUpper()}
		</LabelContainer>
	)
}

export default CardLabel
