import React from 'react'
import './card.css'

const Card = ({text}) => {
	return(
		<tr className={'card'}>
			<p className={'card-text'}>{text}</p>
		</tr>
	)
}

export default Card