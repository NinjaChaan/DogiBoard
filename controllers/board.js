require('dotenv').config()
const _ = require('underscore')
const boardRouter = require('express').Router()
const User = require('../models/user')
const Board = require('../models/board')
const getUserUtil = require('../src/utils/getUser')


boardRouter.get('/stream/:id', async (request, response, next) => {
	const user = await getUserUtil.getUser(request, response)

	response.set({
		// needed for SSE!
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		Connection: 'keep-alive',

		// enabling CORS
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers':
			'Origin, X-Requested-With, Content-Type, Accept',
	})
	response.flush()

	let authorized = false

	let previousBoard

	const interValID = setInterval(() => {
		Board.findById(request.params.id)
			.then((board) => {
				if (board) {
					if (!authorized) {
						if (board.users) {
							if (board.users.includes(user._id)) {
								authorized = true
							} else {
								response.writeHead(401).json({ error: 'You are not authorized to look at this board' })
								response.flush()
								response.end()
							}
						} else {
							response.writeHead(404)
						}
					}
					if (_.isEqual(board, previousBoard)) {
						// console.log('no need to update')
					} else {
						console.log('updating')
						previousBoard = board
						response.write(`data: ${JSON.stringify(board)}`)
						response.write('\n\n')
						response.flush()
					}
				} else {
					console.log('stream error')
					response.writeHead(404)
					response.flush()
					response.end()
				}
			})
			.catch((error) => {
				console.log('error,', error)
				next(error)
			})
	}, 1000)

	// If client closes connection, stop sending events
	response.on('close', () => {
		console.log('client dropped me')
		clearInterval(interValID)
		response.end()
	})
})

boardRouter.get('/', (request, response, next) => {
	// TODO: this propably should exist or should be hidden behind admin auth
	Board.find({})
		.then((boards) => {
			response.json(boards.map((board) => board.toJSON()))
		})
		.catch((error) => next(error))
})

boardRouter.get('/:id', async (request, response, next) => {
	const user = await getUserUtil.getUser(request, response)

	Board.findById(request.params.id)
		.then((board) => {
			if (board) {
				if (board.users && board.users.includes(user._id)) {
					response.json(board.toJSON())
				} else {
					response.status(401).json({ error: 'You are not authorized to look at this board' })
					response.flush()
					response.end()
				}
			} else {
				response.status(404).end()
			}
		})
		.catch((error) => next(error))
})

boardRouter.post('/', async (request, response, next) => {
	const { body } = request

	const user = await getUserUtil.getUser(request, response)

	const board = new Board({
		name: body.name,
		lists: body.lists,
		users: [user._id],
		creator: user._id
	})

	const savedBoard = await board.save()

	user.boards = user.boards.concat(savedBoard._id)

	await user.save()

	response.json(savedBoard.toJSON())
})

boardRouter.put('/inviteUser/:id', async (request, response, next) => {
	const { body } = request

	const user = await getUserUtil.getUser(request, response)

	Board.findById(request.params.id)
		.then((foundBoard) => {
			if (foundBoard) {
				User.findById(body.userId).then((foundUser) => {
					if (foundUser) {
						const board = ({
							...foundBoard.toJSON(),
							users: foundBoard.users.concat(body.userId)
						})
						if (foundBoard.users.includes(user._id)) {
							Board.updateOne({ _id: request.params.id }, board).then(() => {
								const updatedUser = ({
									...foundUser.toJSON(),
									invites: foundUser.invites.concat(foundBoard.id)
								})
								User.updateOne({ _id: foundUser._id }, updatedUser).then(() => {
									response.json({ response: `${foundUser.username} invited to ${foundBoard.name}` })
								})
							})
						} else {
							response.status(401).json({ error: 'You are not authorized to edit this board' })
						}
					} else {
						response.status(404).json({ error: 'Couldn\'t find such user' })
					}
				}).catch((error) => {
					response.status(404)
					next(error)
				})
			} else {
				response.status(404)
			}
		}).catch((error) => next(error))
})

boardRouter.put('/:id', async (request, response, next) => {
	const { body } = request

	const user = await getUserUtil.getUser(request, response)

	Board.findById(request.params.id)
		.then((foundBoard) => {
			if (foundBoard) {
				const board = ({
					...foundBoard.toJSON(),
					name: body.name || foundBoard.name,
					lists: body.lists || foundBoard.lists
				})
				console.log('board', board)
				if (foundBoard.users.includes(user._id)) {
					Board.updateOne({ _id: request.params.id }, board).then(() => {
						response.json(body)
					})
				} else {
					response.status(401).json({ error: 'You are not authorized to edit this board' })
				}
			} else {
				console.log('foundboard not found', foundBoard)
				console.log('request.params', request.params)
				response.status(404)
			}
		}).catch((error) => {
			response.status(404)
			next(error)
		})
})

boardRouter.delete('/:id', async (request, response, next) => {
	const user = await getUserUtil.getUser(request, response)

	Board.findById(request.params.id)
		.then((foundBoard) => {
			if (foundBoard) {
				if (_.isEqual(foundBoard.creator, user._id)) {
					Board.deleteOne({ _id: request.params.id }).then(() => {
						response.status(200)
					})
				} else {
					response.status(401).json({ error: 'You are not authorized to remove this board' })
				}
			} else {
				console.log('foundboard not found', foundBoard)
				console.log('request.params', request.params)
				response.status(404)
			}
		})
})

module.exports = boardRouter
