import axios from 'axios'
import store from '../redux/store/index'

const baseUrl = '/api/users'

const getAll = () => {
	const request = axios.get(baseUrl)
	return request.then((response) => response.data).catch((error) => {
		console.log(error.message)
	})
}

const getWithToken = (token) => {
	const request = axios.get(`${baseUrl}/token`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	})
	return request.then((response) => response.data).catch((error) => {
		console.log(error.message)
	})
}

const getOne = (id) => {
	const request = axios.get(`${baseUrl}/${id}`, {
		headers: {
			Authorization: `Bearer ${store.getState().user.token}`
		}
	})
	return request.then((response) => response).catch((error) => (error.response))
}

const create = (newObject) => {
	const request = axios.post(baseUrl, newObject)
	return request.then((response) => response.data)
}

const update = (id, newObject) => {
	const request = axios.put(`${baseUrl}/${id}`, newObject, {
		headers: {
			Authorization: `Bearer ${store.getState().user.token}`
		}
	})
	return request.then((response) => response).catch((error) => {
		return error.response
	})
}

const updateAvatar = (id, newObject) => {
	const request = axios.put(`${baseUrl}/${id}/avatar`, newObject, {
		headers: {
			Authorization: `Bearer ${store.getState().user.token}`
		}
	})
	return request.then((response) => response).catch((error) => {
		return error.response
	})
}

const updateGravatar = (id, gravatarEmail) => {
	const request = axios.put(`${baseUrl}/${id}/gravatar`, gravatarEmail, {
		headers: {
			Authorization: `Bearer ${store.getState().user.token}`
		}
	})
	return request.then((response) => response).catch((error) => {
		return error.response
	})
}

const getGravatar = (email, size) => {
	const request = axios.get(`https://www.gravatar.com/avatar/${email}.png?s=${size}&d=404`, { responseType: 'blob' })
	return request.then((response) => response).catch((error) => {
		console.log('error', error.response.status)
		if (error.response.status === 404) {
			console.log('404 got', error.response.status)
			const req = axios.get(`https://www.gravatar.com/avatar/${email}.png?s=${size}&d=robohash`, { responseType: 'blob' })
			return req.then((response) => { response.status = 418; return response }).catch((err) => {
				console.log('deep error')
				return err.response
			})
		}
		console.log('shallow error')
		return error.response
	})
}

const getClosestMatches = (query) => {
	const request = axios.get(`${baseUrl}/search/${query}`, {
		headers: {
			Authorization: `Bearer ${store.getState().user.token}`
		}
	})
	return request.then((response) => response).catch((error) => (error.response))
}

const remove = (id) => {
	const request = axios.delete(`${baseUrl}/${id}`)
	return request.then((response) => response.data)
}

export default {
	getAll,
	create,
	update,
	remove,
	getWithToken,
	getOne,
	updateGravatar,
	updateAvatar,
	getGravatar,
	getClosestMatches
}
