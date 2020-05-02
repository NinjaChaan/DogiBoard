import React from 'react'
import styled from 'styled-components'
import perc2color from '../../utils/colorFunctions'

const ProgressBarBackground = styled.div`
	position: relative;
    left: 35px;
    top: -15px;
    height: 10px;
    width: -webkit-calc(100% - 35px);
    width: -moz-calc(100% - 35px);
    width: calc(100% - 35px);
	background-color: rgba(228, 227, 227, 0.616);
    border-radius: 4px;
`

const Slider = styled.div`
	position: relative;
    min-height: 10px;
    background-color: rgb(255, 0, 0);
    border-radius: 4px;
	border: 2px solid;
    transition: width .2s ease-in, background-color .0s ease-in;
`

const ProgressPercentage = styled.span`
	font-size: 0.8rem;
	width: 30px;
	display: inline-block;
	position: relative;
	right: 2px;
	text-align: center;
`

const ProgressBar = ({ progress }) => (
	<div style={{ height: '25px', marginTop: '0px' }}>
		<ProgressPercentage className="perc">
			{`${progress !== 'NaN' ? progress : 0}%`}
		</ProgressPercentage>
		<ProgressBarBackground>
			<Slider
				style={{ width: `${progress}%`, backgroundColor: perc2color(progress).bg.toString(), borderColor: perc2color(progress).border.toString() }}
			/>
		</ProgressBarBackground>
	</div>
)

export default ProgressBar
