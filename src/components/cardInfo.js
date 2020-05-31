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
import { IconContext } from 'react-icons'

const ChecklistArea = styled.div`
	display: inline-block;
	max-height: 25px;
	border-radius: 4px;
	background-color: #f7f5f5;
	border: 2px solid transparent;
	/* ${(props) => props.allChecksDone && css`
		border: 2px #3cbc3c solid;
		`
} */
`
const ChecklistText = styled.span`
	position: relative;
	top: -2px;
	display: inline-block;
	font-size: 0.8rem;
	padding-right: 2px;
`

const CardInfo = ({ card }) => {
	const [allChecksDone, setAllChecksDone] = useState(false)
	const [checksCount, setChecksCount] = useState(0)
	const [doneChecksCount, setDoneChecksCount] = useState(0)

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
	}, [card.checklist])

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

	const Label = () => {
		console.log('label', card.label)
		return (
			<>
				{React.createElement(riIcon, {
					size: 20, title: `This task is a ${card.label}`, fill: fillColor, style: { marginBottom: '5px', marginRight: '3px' }
				})}
			</>
		)
	}

	return (
		<div style={{ marginBottom: '-5px', marginTop: '2px' }}>
			{card.label
				? <Label />
				: null}
			<Checklist />
		</div>
	)
}

export default CardInfo
