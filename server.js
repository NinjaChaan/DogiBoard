require('dotenv').config()
const path = require('path')
const webpack = require('webpack')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const config = require('./webpack.config')
const Board = require('./models/board')

const app = express()
app.use(cors())
app.use(express.json())
morgan.token('data', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
const compiler = webpack(config)

app.use(require('webpack-dev-middleware')(compiler, {
	publicPath: config.output.publicPath
}))

app.use(require('webpack-hot-middleware')(compiler))

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

// eslint-disable-next-line consistent-return
app.listen(3000, (err) => {
	if (err) {
		return console.error(err)
	}

	console.log('Listening at http://localhost:3000/')
})
