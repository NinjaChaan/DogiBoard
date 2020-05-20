require('dotenv').config()
const path = require('path')
const webpack = require('webpack')
const spdy = require('spdy')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const _ = require('underscore')
const shrinkRay = require('shrink-ray-current')
const fs = require('fs')
const config = require('./webpack.config')
const Board = require('./models/board')

const app = express()
app.use(cors())
app.use(shrinkRay())

app.use(express.json())
morgan.token('data', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
const compiler = webpack(config)

app.use(require('webpack-dev-middleware')(compiler, {
	publicPath: config.output.publicPath
}))

app.use(require('webpack-hot-middleware')(compiler))

// BUILD
// app.use(express.static('build', {
// 	etag: true, // Just being explicit about the default.
// 	lastModified: true, // Just being explicit about the default.
// 	setHeaders: (res, path) => {
// 		const hashRegExp = new RegExp('\\.[0-9a-f]{8}\\.')

// 		if (path.endsWith('.html')) {
// 			// All of the project's HTML files end in .html
// 			res.setHeader('Cache-Control', 'no-cache')
// 		} else if (hashRegExp.test(path)) {
// 			// If the RegExp matched, then we have a versioned URL.
// 			res.setHeader('Cache-Control', 'max-age=31536000')
// 		}
// 	},
// }))

// app.get('/stream/:id', (request, response, next) => {
// 	// response.set('Cache-Control', 'no-cache')
// 	// response.set('Content-Type', 'text/event-stream')
// 	// response.set('Access-Control-Allow-Origin', '*')
// 	// response.flushHeaders() // flush the headers to establish SSE with client
// 	response.writeHead(200, {
// 		Connection: 'keep-alive',
// 		'Content-Type': 'text/event-stream',
// 		'Cache-Control': 'no-cache',

// 		// enabling CORS
// 		'Access-Control-Allow-Origin': '*',
// 		'Access-Control-Allow-Headers':
// 			'Origin, X-Requested-With, Content-Type, Accept',
// 	})
// 	console.log('trying to stream width id ', request.params.id)

// 	const interValID = setInterval(() => {
// 		Board.findById(request.params.id)
// 			.then((board) => {
// 				if (board) {
// 					// console.log('stream board success', board.toJSON())
// 					// response.json(board.toJSON())
// 					// response.write(`data: ${board.toJSON()}`)
// 					// `${JSON.stringify(board)}\n\n`
// 					const data = {
// 						message: 'hello'
// 					}
// 					console.log('data', board.toJSON())
// 					response.write(`data: ${JSON.stringify(board)}`)
// 					response.write('\n\n')
// 					// response.write('data: {"flight": "I768", "state": "landing"}')
// 				} else {
// 					console.log('stream error')
// 					response.writeHead(404)
// 					response.end()
// 				}
// 			})
// 			.catch((error) => next(error))
// 		// res.send(`data: ${JSON.stringify({ num: counter })}\n\n`) // res.write() instead of res.send()
// 	}, 1000)

// 	// If client closes connection, stop sending events
// 	response.on('close', () => {
// 		console.log('client dropped me')
// 		clearInterval(interValID)
// 		response.end()
// 	})
// })


app.get('/stream/:id', (request, response, next) => {
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

	let previousBoard

	const interValID = setInterval(() => {

		Board.findById(request.params.id)
			.then((board) => {
				if (board) {
					if (_.isEqual(board, previousBoard)) {
						console.log('no need to update')
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
			.catch((error) => next(error))
	}, 1000)

	// If client closes connection, stop sending events
	response.on('close', () => {
		console.log('client dropped me')
		clearInterval(interValID)
		response.end()
	})
})


// DEV
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'))
})


app.get('/info', (request, response, next) => {
	Board.find({})
		.then((boards) => {
			response.send('<div>'
				+ `<p>Server has ${boards.length} boards<p/>`
				+ `<p> ${new Date()}</p>`
				+ '</div>')
		})
		.catch((error) => next(error))
})

app.get('/api/boards', (request, response, next) => {
	Board.find({})
		.then((boards) => {
			response.json(boards.map((board) => board.toJSON()))
		})
		.catch((error) => next(error))
})

app.get('/api/boards/:id', (request, response, next) => {
	Board.findById(request.params.id)
		.then((board) => {
			if (board) {
				response.json(board.toJSON())
			} else {
				response.status(404).end()
			}
		})
		.catch((error) => next(error))
})

app.post('/api/boards', async (request, response, next) => {
	const { body } = request

	const board = new Board({
		name: body.name,
		lists: body.lists,
	})

	board.save()
		.then((savedBoard) => savedBoard.toJSON())
		.then((formattedBoard) => {
			response.json(formattedBoard)
		})
		.catch((error) => next(error))
})

app.put('/api/boards/:id', (request, response, next) => {
	const { body } = request

	const board = ({
		name: body.name,
		lists: body.lists
	})

	Board.findByIdAndUpdate(request.params.id, board, { runValidators: true, context: 'query', new: true })
		.then((updatedBoard) => {
			if (updatedBoard) {
				response.json(updatedBoard.toJSON())
			} else {
				response.status(404).json({ error: `${board.name} has already been deleted` })
			}
		})
		.catch((error) => next(error))
})

app.use((req, res, next) => {
	if (!('JSONResponse' in res)) {
		return next()
	}

	res.set('Cache-Control', 'public, max-age=31557600')
	res.json(res.JSONResponse)
})

const options = {
	key: fs.readFileSync(`${__dirname}/server.key`),
	cert: fs.readFileSync(`${__dirname}/server.crt`)
}
console.log(options)

spdy
	.createServer(options, app)
	.listen(3000, (error) => {
		if (error) {
			console.error(error)
			return process.exit(1)
		}
		console.log('Listening at http://localhost:3000/')
	})

// eslint-disable-next-line consistent-return
// app.listen(3000, (err) => {
// 	if (err) {
// 		return console.error(err)
// 	}

// 	console.log('Listening at http://localhost:3000/')
// })
