import React, { useState, useEffect } from 'react'
import ListTable from './components/listTable.js'

const App = () => {

	return (
		<div className="App">
			<header className="App-header">
				<table>
					<tbody>
						<ListTable />
					</tbody>
				</table>

			</header>
		</div>
	)
}

export default App
