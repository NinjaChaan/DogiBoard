import axios from 'axios'

const baseUrl = '/api/login'

const login = (user) => {
	const request = axios.post(baseUrl, user)
	return request.then((response) => response).catch((error) => {
		return error.response
	})
}

export default {
	login
}
