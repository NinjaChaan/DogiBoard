import React, { useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import _ from 'underscore'
import styled from 'styled-components'
import EventSourcePoly from 'eventsource'
import Cookies from 'js-cookie'
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect
} from 'react-router-dom'
import userService from '../services/users'
import BoardsPage from './boardsPage'
import TopBar from './TopBar'
import LoginPage from './loginPage/loginPage'
import { device } from '../devices'
import BoardPage from './boardPage'
import ProfilePage from './ProfilePage'
import { login } from '../redux/actions/index'
import LoadingAnimation from './loadingAnimation'

const mapStateToProps = (state) => {
	console.log('state at page', state)
	const user = state.user
	return (
		({
			user
		})
	)
}

const PageStyle = styled.div`
	display: flex;
	position: relative;

	height: 100%;
	max-width: 200px;

	@media ${device.mobileS}{
		max-width: 100%;
	}
	@media ${device.mobileM}{
		max-width: 100%;
	}
	@media ${device.mobileL}{
		max-width: 100%;
	}

	@media ${device.laptop} { 
		max-width: 100%;
	}

	@media ${device.desktop} {
		max-width: 100%;
	}
`
const Page = ({ dispatch, user }) => {
	const [tokenChecked, setTokenChecked] = useState(false)

	useEffect(() => {
		const token = Cookies.get('token')
		const stayLogged = Cookies.get('stayLogged')
		console.log('token?', token)
		console.log('cookies', Cookies.get())
		if (stayLogged === 'true') {
			if (token) {
				userService.getWithToken(token)
					.then((response) => {
						console.log('user', response)
						dispatch(login({ loggedIn: true, token, user: response }))
						setTokenChecked(true)
					})
			} else {
				setTokenChecked(true)
			}
		}
		setTimeout(() => {
			setTokenChecked(true)
		}, 1000)
	}, [])

	console.log('loggedIn', user.loggedIn)
	console.log('tokenChecked', tokenChecked)
	return (
		<div>
			<Router>
				<TopBar />
				{/* if token checked, show routed stuff */}
				{tokenChecked
					&& (
						<>
							{!user.loggedIn && <Redirect to="/login" />}
							<Switch>
								<Route exact path="/">
									{!user.loggedIn
										? <Redirect to="/login" />
										: <Redirect to="/boards" />}
								</Route>
								<Route path="/login">
									{(user.loggedIn && tokenChecked)
										? <Redirect to="/boards" />
										: <LoginPage />}
								</Route>

								{user.loggedIn && <Route path="/profile/:id" component={ProfilePage} />}

								{user.loggedIn && <Route path="/board/:id" component={BoardPage} />}
								<Route path="/boards">
									{(user.loggedIn && tokenChecked)
										? <BoardsPage />
										: <Redirect to="/login" />}
								</Route>
							</Switch>
						</>
					)}
				{!tokenChecked && <LoadingAnimation />}
			</Router>
		</div>
	)
}

export default connect(mapStateToProps, null)(Page)
