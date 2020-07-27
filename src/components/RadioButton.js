import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'

const RadioButtonLabel = styled.label`
	position: absolute;
	top: 10%;
	width: 24px;
	height: 24px;
	/* border-radius: 50%;
	background: white;
	border: 1px solid #bebebe; */
	background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3C!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ --%3E%3Cg%3E%3Ctitle%3Ebackground%3C/title%3E%3Crect fill='%23ffffff' id='canvas_background' height='26' width='26' y='-1' x='-1'/%3E%3Cg display='none' overflow='visible' y='0' x='0' height='100%25' width='100%25' id='canvasGrid'%3E%3Crect fill='url(%23gridpattern)' stroke-width='0' y='0' x='0' height='100%25' width='100%25'/%3E%3C/g%3E%3C/g%3E%3Cg%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cellipse ry='12' rx='12' id='svg_2' cy='12' cx='12' stroke-width='0' stroke='%23000' fill='%23b7b7b7'/%3E%3Cellipse ry='11' rx='11' id='svg_3' cy='12' cx='12' stroke-opacity='null' stroke-width='0' stroke='%23000' fill='%23fcfcfc'/%3E%3C/g%3E%3C/svg%3E");

`

const Radio = styled.input`
	opacity: 0;
	z-index: 1;
	border-radius: 50%;
	width: 24px;
	height: 24px;
	margin-right: 5px;

	${(props) => props.checked && css` 
		&:checked ~ ${RadioButtonLabel} {
		/* background: #557dff; */
		background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3C!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ --%3E%3Cg%3E%3Ctitle%3Ebackground%3C/title%3E%3Crect fill='%23ffffff' id='canvas_background' height='26' width='26' y='-1' x='-1'/%3E%3Cg display='none' overflow='visible' y='0' x='0' height='100%25' width='100%25' id='canvasGrid'%3E%3Crect fill='url(%23gridpattern)' stroke-width='0' y='0' x='0' height='100%25' width='100%25'/%3E%3C/g%3E%3C/g%3E%3Cg%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cellipse ry='12' rx='12' id='svg_2' cy='12' cx='12' stroke-width='0' stroke='%23000' fill='%23557dff'/%3E%3Cellipse ry='6' rx='6' id='svg_3' cy='12' cx='12' stroke-opacity='null' stroke-width='0' stroke='%23000' fill='%23fcfcfc'/%3E%3C/g%3E%3C/svg%3E");
		/* border: 1px solid #4568da; */
		/* &::after {
			content: "";
			display: block;
			border-radius: 50%;
			width: 12px;
			height: 12px;
			margin: 5.2px 5px;
			box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.1);
			background: white;
	} */
		}
	`}

	&:hover + ${RadioButtonLabel} {
		/* background: #bebebe; */
		background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3C!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ --%3E%3Cg%3E%3Ctitle%3Ebackground%3C/title%3E%3Crect fill='%23ffffff' id='canvas_background' height='26' width='26' y='-1' x='-1'/%3E%3Cg display='none' overflow='visible' y='0' x='0' height='100%25' width='100%25' id='canvasGrid'%3E%3Crect fill='url(%23gridpattern)' stroke-width='0' y='0' x='0' height='100%25' width='100%25'/%3E%3C/g%3E%3C/g%3E%3Cg%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cellipse ry='12' rx='12' id='svg_2' cy='12' cx='12' stroke-width='0' stroke='%23000' fill='%23b7b7b7'/%3E%3Cellipse ry='6' rx='6' id='svg_3' cy='12' cx='12' stroke-opacity='null' stroke-width='0' stroke='%23000' fill='%23fcfcfc'/%3E%3C/g%3E%3C/svg%3E");
		/* &::after {
		content: "";
		display: block;
		border-radius: 50%;
		width: 12px;
		height: 12px;
		margin: 5.2px 5px;
		background: #eeeeee; */
	/* } */
	}
`

const Item = styled.div`
	display: flex;
	align-items: center;
	height: 30px;
	position: relative;
`

const RadioText = styled.span`
	display: inline-block;
	margin: 0 10px 0 5px;
	user-select: none;
`

const RadioButton = ({
	id, name, value, checked, callBack
}) => (
	<Item>
		<Radio type="radio" name={name} value={value} onChange={() => callBack(id)} checked={checked} />
		<RadioButtonLabel />
		<RadioText>{value}</RadioText>
	</Item>
)

export default RadioButton
