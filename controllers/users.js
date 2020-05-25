const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
	const { body } = request

	const saltRounds = 10
	const passwordHash = await bcrypt.hash(body.password, saltRounds)

	const user = new User({
		username: body.username,
		email: body.email,
		passwordHash,
	})

	user.save()
		.then((savedUser) => savedUser.toJSON())
		.then((formattedUser) => {
			response.json(formattedUser)
		})
		.catch((error) => next(error))
})

usersRouter.get('/', async (request, response) => {
	const users = await User.find({})
	response.json(users.map((user) => user.toJSON()))
})

module.exports = usersRouter
