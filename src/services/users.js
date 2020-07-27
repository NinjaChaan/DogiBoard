import axios from 'axios'
import store from '../redux/store/index'

const baseUrl = '/api/users'

const userCache = []
let gravatarCache = []

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

const getOneCached = (id) => {
	if (userCache[id]) {
		return Promise.resolve(userCache[id])
	}
	return getOne(id).then((result) => {
		userCache[id] = result
		return result
	})
}


const getMany = (ids) => Promise.all(ids.map((id) => getOneCached(id))
	.filter((x) => x !== undefined)).then((results) => results.map(
	(result) => result.data
))


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
	return request.then((response) => response).catch((error) => error.response)
}

const updateBoards = (id, newObject) => {
	const request = axios.put(`${baseUrl}/${id}/boards`, newObject, {
		headers: {
			Authorization: `Bearer ${store.getState().user.token}`
		}
	})
	return request.then((response) => response).catch((error) => error.response)
}

const updateAvatar = (id, newObject) => {
	const request = axios.put(`${baseUrl}/${id}/avatar`, newObject, {
		headers: {
			Authorization: `Bearer ${store.getState().user.token}`
		}
	})
	gravatarCache = []
	return request.then((response) => response).catch((error) => error.response)
}

const updateGravatar = (id, gravatarEmail) => {
	const request = axios.put(`${baseUrl}/${id}/gravatar`, gravatarEmail, {
		headers: {
			Authorization: `Bearer ${store.getState().user.token}`
		}
	})
	gravatarCache = []
	return request.then((response) => response).catch((error) => error.response)
}


const getGravatar = (email, size, type) => {
	const key = `${email}-${size}-${type}`

	if (gravatarCache[key]) {
		return Promise.resolve(gravatarCache[key])
	}

	const request = axios.get(`https://www.gravatar.com/avatar/${email}.png?s=${size}${type === 'robo' ? '&f=y&d=robohash' : '&d=404'}&r=pg`, { responseType: 'blob' })
	return request.then((response) => {
		if (response.status === 200) {
			const fileReaderInstance = new FileReader()
			fileReaderInstance.readAsDataURL(response.data)
			fileReaderInstance.onload = () => {
				const base64data = fileReaderInstance.result
				gravatarCache[key] = { cached: true, data: base64data }
			}
		}
		return response
	}).catch((error) => {
		if (error.response.status === 404) {
			const req = axios.get(`https://www.gravatar.com/avatar/${email}.png?s=${size}&d=${type === 'robo' ? 'robohash' : 'mp'}`, { responseType: 'blob' })
			return req.then((response) => {
				if (response.status === 200) {
					const fileReaderInstance = new FileReader()
					fileReaderInstance.readAsDataURL(response.data)
					fileReaderInstance.onload = () => {
						const base64data = fileReaderInstance.result
						gravatarCache[key] = { cached: true, data: base64data }
					}
				}
				response.status = 418
				return response
			}).catch((err) => err.response)
		}
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
	getMany,
	updateGravatar,
	updateAvatar,
	getGravatar,
	getClosestMatches,
	updateBoards
}
