const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../../models/user')

const getTokenFrom = (request) => {
	const authorization = request.get('authorization')
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		return authorization.substring(7)
	}
	return null
}

const getDecodedToken = (request, response) => {
	const token = getTokenFrom(request)
	const decodedToken = jwt.verify(token, process.env.SECRET)
	if (!token || !decodedToken || !decodedToken.id) {
		return response.status(401).json({ error: 'token missing or invalid' })
	}
	return decodedToken
}

async function getUser(request, response) {
	const decodedToken = getDecodedToken(request, response)

	const user = await User.findById(decodedToken.id)

	return user
}
module.exports = {
	getUser
}
