import { hot } from 'react-hot-loader/root'
import React, { Suspense } from 'react'
import { Provider } from 'react-redux'
import ListTable from './components/listTable'
const CardWindow = React.lazy(() => import('./components/cardWindow/cardWindow'))
import store from './redux/store/index'
import 'react-hot-loader/patch'
import Page from './components/Page'


const App = () => (
	<Provider store={store}>
		<Page>
			<div style={{ width: '100vw', overflow: 'auto', height: '100vh' }}>
				<ListTable />
			</div>
			<Suspense fallback={<div>Loading...</div>}>
				<CardWindow />
			</Suspense>
		</Page>
	</Provider>
)

export default hot(App)
