import React, { useState } from 'react'
//import Card from './card'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import AddCard from './addCard'
import './cardList.css'

const CardList = ({ title }) => {
	const [showingAddAnother, setShowingAddAnother] = useState(true)
	const [cards, setCards] = useState([])

	const [listTitleClass, setListTitleClass] = useState('textarea-list-title')

	const addCard = (card) => {
		setCards(cards.concat(card))
	}

	const changeShowAddAnother = (show) => {
		setShowingAddAnother(show)
	}

	const handleKeyPress = (event) => {
		event.preventDefault();
		if (event.key === 'Enter') {
			document.getElementById('cardTitle').blur()
		}
	}

	return (
		<div>
			<table className='cardList'>
				<thead>
					<tr>
						<textarea
							id='cardTitle'
							onBlur={() => setListTitleClass('textarea-list-title')}
							className={listTitleClass}
							maxLength={25}
							onKeyPress={handleKeyPress}
							onClick={() => setListTitleClass('textarea-list-title-editing')}
						>
							{title}
						</textarea>
					</tr>
				</thead>
				<tbody>
					{
						cards.map((card) =>
							<Card body padding={'30px'}>
								<Card.Text>
									{card.text}
								</Card.Text>
							</Card>
						)
					}
					{showingAddAnother
						? <Button className='btn-add-another-card' variant='link' onClick={() => changeShowAddAnother(false)}>
							<font size='4'>＋</font>Add another card
				 			</Button>
						: <AddCard addCard={addCard} changeShowAddAnother={changeShowAddAnother} />
					}

				</tbody>
			</table>
		</div>
	)
}

export default CardList