require('dotenv').config()
const path = require('path')
const webpack = require('webpack')
const express = require('express')
const cors = require('cors')
const config = require('./webpack.config')
const Board = require('./models/board')

const app = express()
app.use(cors())
app.use(express.json())
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

// eslint-disable-next-line consistent-return
app.listen(3000, (err) => {
	if (err) {
		return console.error(err)
	}

	console.log('Listening at http://localhost:3000/')
})
