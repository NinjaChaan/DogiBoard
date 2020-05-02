import { hot } from 'react-hot-loader/root'
import React from 'react'
import { Provider } from 'react-redux'
import ListTable from './components/listTable'
import CardWindow from './components/cardWindow/cardWindow'
import store from './store/index'
import 'react-hot-loader/patch'


const App = () => (
	<Provider store={store}>
		<div className="App">
			<header className="App-header">
				<ListTable />
				<CardWindow />
			</header>
		</div>
	</Provider>
)

export default hot(App)
