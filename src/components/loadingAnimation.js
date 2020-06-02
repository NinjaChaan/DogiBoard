import React from 'react'
import styled, { keyframes } from 'styled-components'


const raise = keyframes`
	/* 20%, 100% {
		transform: translateY(-33px);
	} */
	0% { transform: translate3d(0, 123px, 0); }
	10% { transform: translate3d(0, 123px, 0); }
	20% { transform: translate3d(0, 93px, 0);}
	30% { transform: translate3d(0, 93px, 0);}
	40% { transform: translate3d(0, 63px, 0);}
	50% { transform: translate3d(0, 63px, 0);}
	60% { transform: translate3d(0, 33px, 0);}
	70% { transform: translate3d(0, 33px, 0);}
	80% { transform: translate3d(0, 3px, 0);}
	90% { transform: translate3d(0, 3px, 0);}
	100% { transform: translate3d(0, -27px, 0);}
	/* 100% { transform: translate(0, 133px); } */
`

const LoadBox = styled.div`
	width: 20px;
	height: 20px;
	background-color: white;
	border: 2px solid black;
	border-radius: 4px;
`

const color = keyframes`
	0% { color: transparent }
	23% { color: transparent }
	25% { color: black }
	100% { color: black }
`

const CheckMark = styled.div`
	position: relative;
	top: -3px;
	padding-left: 2px;
	font-weight: 600;
	color: transparent;
	animation: ${color} 5s ease-out infinite;
	animation-delay: ${(props) => props.animDelay}s;
`

const LoadItem = styled.div`
	padding: 2px;
	padding-left: 3px;
	width: 95px;
	height: 25px;
	display: -ms-flexbox;
	display: flex;
	-ms-flex-wrap: wrap;
	flex-wrap: wrap;

	position: fixed;

	animation: ${raise} 5s linear infinite;
`
const LoadBackground = styled.div`
	margin: 0 auto;
	width: 100px;
	height: 125px;
	background-color: white;
	border: 2px solid black;
	border-radius: 4px;
	overflow: hidden;

	/* position: fixed;
	top: 50%;
	left: 50%; */
	/* bring your own prefixes */
	transform: translate(0, -0);

	${LoadItem}:nth-child(5) {animation-delay: 0s};
	${LoadItem}:nth-child(4) {animation-delay: -1s};
	${LoadItem}:nth-child(3) {animation-delay: -2s};
	${LoadItem}:nth-child(2) {animation-delay: -3s};
	${LoadItem}:nth-child(1) {animation-delay: -4s};
`

const LoadLine = styled.div`
	margin-top: 10px;
	margin-left: 5px;
	width: 60px;
	height: 1px;
	border: 2px solid black;
	border-radius: 4px;
`

const LoadingAnimation = () => (
	<LoadBackground>
		<LoadItem>
			<LoadBox><CheckMark animDelay={-4}>✓</CheckMark></LoadBox>
			<LoadLine />
		</LoadItem>
		<LoadItem>
			<LoadBox><CheckMark animDelay={-3}>✓</CheckMark></LoadBox>
			<LoadLine />
		</LoadItem>
		<LoadItem>
			<LoadBox><CheckMark animDelay={-2}>✓</CheckMark></LoadBox>
			<LoadLine />
		</LoadItem>
		<LoadItem>
			<LoadBox><CheckMark animDelay={-1}>✓</CheckMark></LoadBox>
			<LoadLine />
		</LoadItem>
		<LoadItem>
			<LoadBox><CheckMark animDelay={0}>✓</CheckMark></LoadBox>
			<LoadLine />
		</LoadItem>
	</LoadBackground>
)

export default LoadingAnimation
