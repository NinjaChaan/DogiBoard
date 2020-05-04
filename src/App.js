import { hot } from 'react-hot-loader/root'
import React from 'react'
import { Provider } from 'react-redux'
import ListTable from './components/listTable'
import CardWindow from './components/cardWindow/cardWindow'
import store from './store/index'
import 'react-hot-loader/patch'
import Page from './components/Page'


const App = () => (
	<Provider store={store}>
		<Page>
			<div style={{width: '100vw', overflow: 'auto', height: '100vh' }}>
				<ListTable />
			</div>
			<CardWindow />
		</Page>
	</Provider>
)

export default hot(App)
