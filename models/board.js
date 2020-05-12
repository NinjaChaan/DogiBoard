const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('connected to MongoDB')
	})
	.catch((error) => {
		console.log('error connecting to MongoDB: ', error.message)
	})

const boardSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 3,
		required: true,
	},
	lists: {
		type: mongoose.Schema.Types.Mixed, // TODO: fix later
	},
})

boardSchema.plugin(uniqueValidator)

boardSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	},
})

module.exports = mongoose.model('Board', boardSchema)
