import axios from 'axios'

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

const create = (newObject) => {
	const request = axios.post(baseUrl, newObject)
	return request.then((response) => response.data)
}

const update = (id, newObject) => {
	const request = axios.put(`${baseUrl}/${id}`, newObject)
	return request.then((response) => response.data).catch((error) => {
		console.log(error.message)
	})
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
	getWithToken
}
