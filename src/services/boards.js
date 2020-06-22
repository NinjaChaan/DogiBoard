import axios from 'axios'
import store from '../redux/store/index'

const baseUrl = '/api/boards'
// console.log('token at service', store.getState().user.token)
// axios.defaults.headers.common.Authorization = store.getState().user.token
// console.log('config headers?', config.headers)

const getOne = (id) => {
	const request = axios.get(`${baseUrl}/${id}`, {
		headers: {
			Authorization: `Bearer ${store.getState().user.token}`
		}
	})
	return request.then((response) => response).catch((error) => (error.response))
}
const getUserRole = (id, userId) => {
	const request = axios.get(`${baseUrl}/${id}/userRole/${userId}`, {
		headers: {
			Authorization: `Bearer ${store.getState().user.token}`
		}
	})
	return request.then((response) => response).catch((error) => (error.response))
}

const getAll = () => {
	const request = axios.get(baseUrl)
	return request.then((response) => response.data).catch((error) => (error.message))
}

const create = (newObject) => {
	const request = axios.post(baseUrl, newObject)
	return request.then((response) => response.data).catch((error) => (error.message))
}

const update = (id, newObject) => {
	const request = axios.put(`${baseUrl}/${id}`, newObject, {
		headers: {
			Authorization: `Bearer ${store.getState().user.token}`
		}
	})
	return request.then((response) => response.data).catch((error) => (error.message))
}

const inviteUser = (id, userId) => {
	const request = axios.put(`${baseUrl}/inviteUser/${id}`, userId, {
		headers: {
			Authorization: `Bearer ${store.getState().user.token}`
		}
	})
	return request.then((response) => response.data).catch((error) => (error.message))
}

const respondToInvitation = (id, newObject) => {
	const request = axios.put(`${baseUrl}/invitationResponse/${id}`, newObject, {
		headers: {
			Authorization: `Bearer ${store.getState().user.token}`
		}
	})
	return request.then((response) => response.data).catch((error) => (error.message))
}

const remove = (id) => {
	const request = axios.delete(`${baseUrl}/${id}`)
	return request.then((response) => response.data).catch((error) => (error.message))
}

export default {
	getOne,
	getAll,
	create,
	update,
	remove,
	inviteUser,
	respondToInvitation,
	getUserRole
}
