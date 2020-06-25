const bcrypt = require('bcrypt')
const _ = require('underscore')
const usersRouter = require('express').Router()
const stringSimilarity = require('string-similarity')
const User = require('../models/user')
const Board = require('../models/board')
const getUserUtil = require('../src/utils/getUser')

const hashPassword = async (password) => {
	const saltRounds = 10
	passwordHash = await bcrypt.hash(password, saltRounds)
	return passwordHash
}

usersRouter.post('/', async (request, response, next) => {
	const { body } = request

	if (body.password.length < 7) {
		response.status(400).json({ error: 'Password is too short' })
	}

	const passwordHash = await hashPassword(body.password)

	const matches = body.username.match(/\b(\w)/g)
	let initials = matches.join('')
	console.log(initials)

	if (initials.length > 2) {
		initials = initials[0] + initials[1]
	}

	const user = new User({
		username: body.username,
		email: body.email,
		passwordHash,
		avatar: {
			color: body.color || {
				r: Math.floor(Math.random() * 256),
				g: Math.floor(Math.random() * 256),
				b: Math.floor(Math.random() * 256)
			},
			initials,
			gravatarEmail: body.email
		}
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

usersRouter.get('/search/:query', async (request, response) => {
	const user = await getUserUtil.getUser(request, response)

	const users = await User.find({})
	console.log('query?', request.params.query)

	const dict = users.map((u) => {
		return { key: stringSimilarity.compareTwoStrings(request.params.query.toLowerCase(), u.username.toLowerCase()), value: u }
	})
	keys = Object.keys(dict)

	dict.sort((a, b) => b.key - a.key)

	const sorted = []

	for (let index = 0; index < dict.length; index++) {
		const element = dict[index]
		if (sorted.length < 10) {
			if (element.key > 0) {
				sorted.push(element.value)
			}
		}
	}

	response.json(sorted)
})

usersRouter.get('/token', async (request, response) => {
	const user = await getUserUtil.getUser(request, response)

	User.findById(user.id).populate('boards').populate('invites')
		.then((u) => {
			response.json(u.toJSON())
		})
})

usersRouter.get('/:id', async (request, response, next) => {
	const user = await getUserUtil.getUser(request, response)

	User.findById(request.params.id).populate('boards').populate('invites')
		.then((u) => {
			if (u === null) {
				return response.status(404)
			}
			response.json(u.toJSON())
		})
		.catch((error) => {
			next(error)
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

	console.log('user update', request)
	console.log('oldpass', body.currentPassword)

	const user = await getUserUtil.getUser(request, response)

	const passwordCorrect = await bcrypt.compare(body.currentPassword, user.passwordHash)
	if (!passwordCorrect) {
		return response.status(401).json({
			error: 'Wrong password'
		})
	}

	let passwordHash

	if (body.password) {
		if (body.password.length < 7) {
			response.status(400).json({ error: 'Password is too short (min 7 characters)' })
		}

		passwordHash = await hashPassword(body.password)
	}

	User.findById(request.params.id)
		.then((foundUser) => {
			if (foundUser) {
				if (_.isEqual(foundUser, user)) {
					const updatedUser = ({
						...foundUser.toJSON(),
						username: body.username || foundUser.username,
						email: body.email || foundUser.email,
						passwordHash: body.password ? passwordHash : foundUser.passwordHash,
						boards: body.boards || foundUser.boards,
					})
					User.updateOne({ _id: request.params.id }, updatedUser).then(() => {
						response.json({ response: `${foundUser.username} updated` })
					})
				} else {
					response.status(401).json({ error: 'You are not authorized to edit this user' })
				}
			} else {
				response.status(404).json({ error: 'User not found' })
			}
		}).catch((error) => {
			response.status(404)
			next(error)
		})
})

usersRouter.put('/:id/avatar', async (request, response, next) => {
	const { body } = request

	const user = await getUserUtil.getUser(request, response)

	User.findById(request.params.id)
		.then((foundUser) => {
			if (foundUser) {
				if (_.isEqual(foundUser, user)) {
					const updatedUser = ({
						...foundUser.toJSON(),
						avatar: {
							avatarType: (body.avatar && body.avatar.avatarType) || (foundUser.avatar && foundUser.avatar.avatarType),
							color: (body.avatar && body.avatar.color) || (foundUser.avatar && foundUser.avatar.color) || {
								r: Math.floor(Math.random() * 256),
								g: Math.floor(Math.random() * 256),
								b: Math.floor(Math.random() * 256)
							},
							initials: (body.avatar && body.avatar.initials) || (foundUser.avatar && foundUser.avatar.initials) || foundUser.username[0],
							gravatarEmail: (body.avatar && body.avatar.gravatarEmail) || (foundUser.avatar && foundUser.avatar.gravatarEmail) || foundUser.email
						}
					})
					User.updateOne({ _id: request.params.id }, updatedUser).then(() => {
						response.json({ response: `${foundUser.username} gravatar updated` })
					})
				} else {
					response.status(401).json({ error: 'You are not authorized to edit this user' })
				}
			} else {
				response.status(404).json({ error: 'User not found' })
			}
		}).catch((error) => {
			response.status(404)
			next(error)
		})
})

usersRouter.put('/:id/gravatar', async (request, response) => {
	const { body } = request

	console.log('gravatar update', request)

	const user = await getUserUtil.getUser(request, response)

	User.findById(request.params.id)
		.then((foundUser) => {
			if (foundUser) {
				if (_.isEqual(foundUser, user)) {
					const updatedUser = ({
						...foundUser.toJSON(),
						gravatarEmail: body.gravatarEmail || foundUser.gravatarEmail
					})
					User.updateOne({ _id: request.params.id }, updatedUser).then(() => {
						response.json({ response: `${foundUser.username} gravatar updated` })
					})
				} else {
					response.status(401).json({ error: 'You are not authorized to edit this user' })
				}
			} else {
				response.status(404).json({ error: 'User not found' })
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
