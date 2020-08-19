require('dotenv').config()
const _ = require('underscore')
const boardRouter = require('express').Router()
const User = require('../models/user')
const Board = require('../models/board')
const getUserUtil = require('../src/utils/getUser')
const boardIncludesUser = require('../src/utils/boardIncludesUser')

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
							if (boardIncludesUser(board, user._id)) {
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
				if (board.users && boardIncludesUser(board, user._id)) {
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

boardRouter.get('/:id/userRole/:userId', async (request, response, next) => {
	const user = await getUserUtil.getUser(request, response)

	Board.findById(request.params.id)
		.then((board) => {
			if (board) {
				if (board.users && boardIncludesUser(board, user._id)) {
					const foundUser = board.users.filter((u) => !_.isEqual(u._id, user._id))
					response.json(foundUser.role.toJSON())
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

	const userToAdd = {
		role: 'admin',
		id: user._id
	}

	const board = new Board({
		name: body.name,
		lists: body.lists || [],
		users: [userToAdd],
		creator: user._id
	})

	const savedBoard = await board.save()

	user.boards = user.boards.concat(savedBoard._id)

	await user.save()

	const res = {
		board: savedBoard,
		user
	}

	response.json(res)
})

boardRouter.put('/inviteUser/:id', async (request, response, next) => {
	const { body } = request

	const user = await getUserUtil.getUser(request, response)

	Board.findById(request.params.id)
		.then((foundBoard) => {
			if (foundBoard) {
				User.findById(body.userId).then((foundUser) => {
					if (foundUser) {
						const userToAdd = {
							id: body.userId,
							role: 'user'
						}
						const board = ({
							...foundBoard.toJSON(),
							users: foundBoard.users.concat(userToAdd)
						})
						if (boardIncludesUser(foundBoard, user._id)) {
							if (!boardIncludesUser(foundBoard, foundUser._id)) {
								Board.updateOne({ _id: request.params.id }, board).then(() => {
									const updatedUser = ({
										...foundUser.toJSON(),
										invites: foundUser.invites.concat(foundBoard._id)
									})
									User.updateOne({ _id: foundUser._id }, updatedUser).then(() => {
										response.json({ response: `${foundUser.username} invited to ${foundBoard.name}`, data: updatedUser })
									})
								})
							} else {
								response.status(400).json({ error: 'User already exists on this board' })
							}
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

boardRouter.put('/removeUser/:id', async (request, response, next) => {
	const { body } = request

	const user = await getUserUtil.getUser(request, response)

	Board.findById(request.params.id)
		.then((foundBoard) => {
			if (foundBoard) {
				User.findById(body.userId).then((foundUser) => {
					if (foundUser) {
						const lists = foundBoard.lists
						console.log('lists before', lists)
						for (let i = 0; i < foundBoard.lists.length; i++) {
							for (let j = 0; j < foundBoard.lists[i].cards.length; j++) {
								if (foundBoard.lists[i].cards[j].members) {
									console.log('members before', foundBoard.lists[i].cards[j].members)
									lists[i].cards[j].members = foundBoard.lists[i].cards[j].members.filter((u) => u !== body.userId)
								}
							}
						}
						console.log('lists after', lists)
						const newUsers = foundBoard.users.filter((u) => u.id !== body.userId)
						if (newUsers.length < 2) {
							newUsers[Math.floor(Math.random() * newUsers.length)].role = 'admin'
						}
						const board = ({
							...foundBoard.toJSON(),
							users: newUsers,
							lists
						})
						console.log('board users after filter', foundBoard.users.filter((u) => u.id !== body.userId))
						if (boardIncludesUser(foundBoard, user._id)) {
							if (boardIncludesUser(foundBoard, foundUser._id)) {
								Board.updateOne({ _id: request.params.id }, board).then(() => {
									console.log('found id', foundBoard.id)
									console.log('first id', foundUser.boards[1])
									console.log('first id stringi', JSON.stringify(foundUser.boards[1]))
									console.log('equal?', _.isEqual(foundUser.boards[1], foundBoard._id))
									console.log('user boards after filter', foundUser.boards.filter((b) => !_.isEqual(b, foundBoard._id)))
									const updatedUser = ({
										...foundUser.toJSON(),
										boards: foundUser.boards.filter((b) => !_.isEqual(b, foundBoard._id))
									})
									User.updateOne({ _id: foundUser._id }, updatedUser).then(() => {
										response.json({ response: `${foundUser.username} removed from ${foundBoard.name}`, data: updatedUser })
									})
								})
							} else {
								response.status(400).json({ error: 'User already doesn\'t exist on this board' })
							}
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


boardRouter.put('/invitationResponse/:id', async (request, response, next) => {
	const { body } = request

	const user = await getUserUtil.getUser(request, response)

	Board.findById(request.params.id)
		.then((foundBoard) => {
			if (foundBoard) {
				User.findById(body.userId).then((foundUser) => {
					if (foundUser) {
						const board = ({
							...foundBoard.toJSON(),
							users: body.answer ? foundBoard.users : foundBoard.users.filter((u) => !_.isEqual(u._id, foundUser._id))
						})
						if (boardIncludesUser(foundBoard, user._id)) {
							Board.updateOne({ _id: request.params.id }, board).then(() => {
								const updatedUser = ({
									...foundUser.toJSON(),
									boards: body.answer ? foundUser.boards.concat(foundBoard.id) : foundUser.boards,
									invites: foundUser.invites.filter((b) => !_.isEqual(b, foundBoard._id))
								})
								User.updateOne({ _id: foundUser._id }, updatedUser).then(() => {
									response.json({ message: `${foundUser.username} response to ${foundBoard.name} successful`, data: updatedUser })
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
				if (boardIncludesUser(foundBoard, user._id)) {
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
