require('dotenv').config()
const path = require('path')
const webpack = require('webpack')
const spdy = require('spdy')
const express = require('express')
require('express-async-errors')
const morgan = require('morgan')
const cors = require('cors')
const shrinkRay = require('shrink-ray-current')
const fs = require('fs')
const config = require('./webpack.config')
const Board = require('./models/board')
const User = require('./models/user')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const boardRouter = require('./controllers/board')
const middleware = require('./src/utils/middleware')

const router = express.Router()

const app = express()
app.use(cors())
app.use(shrinkRay())

app.use(express.json({ limit: '50mb' }))
app.use(middleware.requestLogger)
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

// DEV
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'))
})
app.get('/login', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'))
})
app.get('/signup', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'))
})
app.get('/boards', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'))
})
app.get('/profile/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/board/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'))
})

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/boards', boardRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


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

spdy
	.createServer(options, app)
	.listen(3000, (error) => {
		if (error) {
			console.error(error)
			return process.exit(1)
		}
		console.log('Listening at https://localhost:3000/')
	})

// eslint-disable-next-line consistent-return
// app.listen(3000, (err) => {
// 	if (err) {
// 		return console.error(err)
// 	}

// 	console.log('Listening at http://localhost:3000/')
// })
