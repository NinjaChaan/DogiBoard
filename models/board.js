const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('connected to MongoDB from board model')
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
	users: [
		{
			type: mongoose.Schema.Types.Object,
			_id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User'
			},
			role: {
				type: String,
				enum: ['user', 'admin', 'superAdmin'],
				default: 'user',
				required: 'Role is required',
			},
		}
	],
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Creator'
	}
})

boardSchema.plugin(uniqueValidator)

boardSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
		for (let i = 0; i < returnedObject.users.length; i++) {
			if (returnedObject.users[i]._id) {
				returnedObject.users[i].id = returnedObject.users[i]._id.toString()
				delete returnedObject.users[i]._id
			}
		}
	},
})

module.exports = mongoose.model('Board', boardSchema)
