import { hot } from 'react-hot-loader/root'
import React, { Suspense } from 'react'
import { Provider } from 'react-redux'
import store from './redux/store/index'
import 'react-hot-loader/patch'
const Page = React.lazy(() => import('./components/Page'))
const ListTable = React.lazy(() => import('./components/listTable'))
const CardWindow = React.lazy(() => import('./components/cardWindow/cardWindow'))


const App = () => (
	<Provider store={store}>
		<Suspense fallback={<div>Loading...</div>}>
			<Page>
				<div style={{ width: '100vw', overflow: 'auto', height: '100vh' }}>
					<ListTable />
				</div>
				<CardWindow />
			</Page>
		</Suspense>
	</Provider>
)

export default hot(App)
