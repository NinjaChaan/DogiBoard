import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { RiCheckboxLine } from 'react-icons/ri'

const ChecklistArea = styled.div`
	display: inline-block;
	max-height: 25px;
	border-radius: 4px;
	background-color: #f7f5f5;
	border: 2px solid transparent;
	${(props) => props.allChecksDone && css`
		border: 2px #3cbc3c solid;
		`
	}
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

	useEffect(() => {
		if (card.checklist) {
			setChecksCount(card.checklist.checkItems.length)
			setDoneChecksCount(card.checklist.checkItems.filter((item) => item.done).length)
			setAllChecksDone(card.checklist.checkItems.length === card.checklist.checkItems.filter((item) => item.done).length || false)
		}
	}, [card.checklist])

	const Checklist = () => {
		if (card.checklist) {
			return (
				<ChecklistArea allChecksDone={allChecksDone}>
					<RiCheckboxLine style={{ marginBottom: '5px' }} />
					<ChecklistText>
						{`${doneChecksCount}/${checksCount}`}
					</ChecklistText>
				</ChecklistArea>
			)
		}
		return (null)
	}

	return (
		<div style={{ marginBottom: '-5px', marginTop: '2px' }}>
			<Checklist />
		</div>
	)
}

export default CardInfo
