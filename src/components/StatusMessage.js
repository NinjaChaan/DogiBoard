/* eslint-disable indent */
/* eslint-disable implicit-arrow-linebreak */
import React from 'react'
import styled from 'styled-components'
import { RiCloseCircleLine, RiCheckboxCircleLine } from 'react-icons/ri'
import { IconContext } from 'react-icons'

const StatusMessageContainer = styled.div`
	width: 50%;
	display: flex;
	margin: auto;
	background-color: ${(props) =>
		(props.error && props.theme.colors.warning.backgroundColor)
		|| (props.success && props.theme.colors.success.backgroundColor)
	};
	color: white;
	border-radius: 4px;
	margin-bottom: 15px;
`

const StatusSpan = styled.span`
	text-align: center;
	width: 100%;
	font-weight: 600;
	padding: 15px 15px 15px 0px;
`

const StatusMessage = ({ statusMessage, statusType }) => (
	<StatusMessageContainer success={statusType === 'success'} error={statusType === 'error'}>
		<IconContext.Provider value={{ size: 40, style: { margin: '10px 5px 5px 15px' } }}>
			{statusType === 'error'
				? <RiCloseCircleLine />
				: <RiCheckboxCircleLine />}
		</IconContext.Provider>
		<StatusSpan>
			{statusMessage}
		</StatusSpan>
	</StatusMessageContainer>
)

export default StatusMessage
