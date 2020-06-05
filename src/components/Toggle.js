import React, { useState } from 'react'
import styled from 'styled-components'

const Input = styled.input`
	opacity: 0;
	width: 0;
	height: 0;
`

const Slider = styled.span`
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #ccc;
	-webkit-transition: .4s;
	transition: .4s;
  	border-radius: 34px;

	&:before {
	position: absolute;
	content: "";
	height: 26px;
	width: 26px;
	left: 4px;
	bottom: 4px;
	background-color: white;
	-webkit-transition: .4s;
	transition: .4s;
 	 border-radius: 50%;
	}
`

const Switch = styled.label`
	margin-left: -5px;
	position: relative;
	display: inline-block;
	width: 60px;
	height: 34px;

	scale: ${(props) => props.scale};

	${Input}:checked + ${Slider} {
		background-color: #2196F3;
	}

	${Input}:focus + ${Slider} {
		box-shadow: 0 0 1px #2196F3;
	}

	${Input}:checked + ${Slider}:before {
		-webkit-transform: translateX(26px);
		-ms-transform: translateX(26px);
		transform: translateX(26px);
	}
`

const ToggleContainer = styled.div`
	text-align: left;
`

const TextSpan = styled.span`
	vertical-align: middle;
	font-weight: 500;
	margin-left: 10px;
`

const Toggle = ({
	scale, text, onChange, checked
}) => {
	const [checkedIn, setCheckedIn] = useState(checked)
	const handleInputChange = (event) => {
		const target = event.target
		const value = target.checked
		setCheckedIn(value)
		onChange(value)
	}

	return (
		<ToggleContainer>
			<Switch scale={scale}>
				<Input type="checkbox" checked={checkedIn} onChange={handleInputChange} />
				<Slider />
			</Switch>
			<TextSpan>{text}</TextSpan>
		</ToggleContainer>
	)
}

export default Toggle
