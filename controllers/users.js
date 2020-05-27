const bcrypt = require('bcrypt')
const _ = require('underscore')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Board = require('../models/board')
const getUserUtil = require('../src/utils/getUser')

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
	const users = await User
		.find({}).populate('boards')
	response.json(users.map((user) => user.toJSON()))
})

usersRouter.get('/:id', async (request, response) => {
	User.findById(request.params.id)
		.then((user) => {
			response.json(user.toJSON())
		})
})

usersRouter.get('/:id/boards', async (request, response) => {
	User.findById(request.params.id).populate('boards')
		.then((user) => {
			response.json(user.toJSON())
		})
})

usersRouter.put('/:id', async (request, response) => {
	const { body } = request

	const user = await getUserUtil.getUser(request, response)

	User.findById(request.params.id)
		.then((foundUser) => {
			if (foundUser) {
				if (_.isEqual(foundUser, user)) {
					const updatedUser = ({
						...foundUser.toJSON(),
						username: body.username || foundUser.username,
						email: body.email || foundUser.email,
						boards: body.boards || foundUser.boards
					})
					User.updateOne({ _id: request.params.id }, updatedUser).then(() => {
						response.json({ response: `${foundUser.username} updated` })
					})
				} else {
					response.status(401).json({ error: 'You are not authorized to edit this user' })
				}
			} else {
				response.status(404)
			}
		}).catch((error) => {
			response.status(404)
			next(error)
		})
})

usersRouter.put('/addBoard/:id', async (request, response) => {
	const { body } = request

	const user = await getUserUtil.getUser(request, response)

	User.findById(request.params.id)
		.then((foundUser) => {
			if (foundUser) {
				if (_.isEqual(foundUser, user)) {
					Board.findById(body.boardId).then((foundBoard) => {
						if (foundBoard) {
							const updatedUser = ({
								...foundUser.toJSON(),
								boards: foundUser.boards.concat(body.boardId)
							})
							User.updateOne({ _id: request.params.id }, updatedUser).then(() => {
								response.json({ response: `${foundBoard.name} added to ${foundUser.username}` })
							})
						} else {
							response.status(404).json({ error: 'Couldn\'t find such board' })
						}
					})
				} else {
					response.status(401).json({ error: 'You are not authorized to edit this user' })
				}
			} else {
				response.status(404)
			}
		}).catch((error) => {
			response.status(404)
			next(error)
		})
})

module.exports = usersRouter
