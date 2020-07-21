import React, { useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

const DropdownMenu = styled.div`
	display: inline-table;
	position: absolute;
	z-index: 2000;
	background-color: ${(props) => props.bgColor || 'rgb(225, 225, 225)'};

	box-shadow: ${(props) => !props.noShadow && '0px 1px 5px 0px rgba(0,0,0,0.5)'};

	padding: ${(props) => props.padding || '10px'};
	border-radius: 4px;

	${(props) => props.position && css`
		top: ${props.position.top || null};
		right: ${props.position.right || null};
		left: ${props.position.left || null};
		bottom: ${props.position.bottom || null};
	`}

	${(props) => props.noTopBorder && css`
		border-top-left-radius: 0;
		border-top-right-radius: 0;
	`}

	position: ${(props) => props.relativePos && 'relative'};


	transform-origin: top center;
  
	transition: transform ease-out 0.2s, max-height ease-out 0.2s, opacity ease-out 0.1s 0.1s;
	-webkit-transition: transform ease-out 0.2s, max-height ease-out 0.2s, opacity ease-out 0.1s 0.1s;
	/* transition: ease-in 0.2s;
	-webkit-transition: ease-in 0.2s;*/
	opacity: 0;
	transform: scaleY(0);
	max-height: 0; 
	width: ${(props) => props.width}px;
	
	${(props) => props.maxContent && css`
		width: max-content;
		min-width: ${props.width}px;
	`}

	&.show{
		opacity: 1;
		-webkit-transition: all 0.2s cubic-bezier(.39,.45,.7,1.5);
		-moz-transition: all 0.2s cubic-bezier(.39,.45,.7,1.5);
		-o-transition: all 0.2s cubic-bezier(.39,.45,.7,1.5);
		transition: all 0.2s cubic-bezier(.39,.45,.7,1.5);
		height: auto;
		max-height: 100%;
		transform: scaleY(1);
		
	}

	@keyframes grow {
	from {
		height: 0;
		max-height: 0%;
		transform: scaleY(0);
	}

	75% {
		height: auto;
		max-height: 120%;
		transform: scaleY(1.2);
	}

	to {
		height: auto;
		max-height: 100%;
		transform: scaleY(1);
	}
	}
`

const Dropdown = ({
	children, show, setShowMenu, parentId, ids, width, padding, position, relativePos, bgColor, noTopBorder, noShadow, maxContent
}) => {
	const menu = useRef()
	const [menuWidth, setWidth] = useState(0)

	const handleChildClick = (e) => {
		e.stopPropagation()
	}

	// check if any provided ids element clicked
	const idsContain = (target) => {
		for (let i = 0; i < ids.length; i++) {
			if (document.getElementById(ids[i]).contains(target)) {
				return true
			}
		}
		return false
	}

	const handleClick = (e) => {
		const parent = document.getElementById(parentId)

		if (width === undefined) {
			setWidth(parent.scrollWidth)
		} else {
			setWidth(width)
		}
		// check if menu itself, parent of menu or any provided element clicked
		if (menu.current.contains(e.target) || parent.contains(e.target) || (ids && idsContain(e.target))) {
			return
		}
		setShowMenu(false)
	}

	useEffect(() => {
		if (width !== undefined) {
			setWidth(width)
		}
	}, [width])

	useEffect(() => {
		// setShowMenu(true)
		// setTimeout(()=>setShowMenu(false), 50)

		if (parentId) {
			// add when mounted
			document.addEventListener('mousedown', handleClick) // return function to be called when unmounted
			return () => {
				document.removeEventListener('mousedown', handleClick)
			}
		}
	}, [parentId])
	return (
		<DropdownMenu maxContent={maxContent} padding={padding} noShadow={noShadow} noTopBorder={noTopBorder} bgColor={bgColor} width={menuWidth} position={position} relativePos={relativePos} className={show && 'show'} ref={menu} onClick={handleChildClick}>
			{children}
		</DropdownMenu>
	)
}

export default Dropdown
