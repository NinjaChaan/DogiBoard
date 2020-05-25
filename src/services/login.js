import axios from 'axios'

const baseUrl = '/api/login'

const login = (user) => {
	const request = axios.post(baseUrl, user)
	return request.then((response) => response.data).catch((error) => {
		console.log(error.message)
	})
}

export default {
	login
}
