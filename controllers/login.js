const isEmail = require('validator/lib/isEmail')

require('dotenv').config()

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
	const body = request.body
	let data
	if (isEmail(body.username)) {
		data = {
			email: body.username
		}
	} else {
		data = {
			username: body.username
		}
	}

	const user = await User.findOne(data).populate('boards')
	const passwordCorrect = user === null
		? false
		: await bcrypt.compare(body.password, user.passwordHash)
	if (!(user && passwordCorrect)) {
		return response.status(401).json({
			error: 'Invalid username/email or password'
		})
	}

	const userForToken = {
		username: user.username,
		id: user._id,
	}

	const token = jwt.sign(userForToken, process.env.SECRET)

	response
		.status(200)
		.send({ token, user })
})

module.exports = loginRouter
