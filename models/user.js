const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('connected to MongoDB from user model')
	})
	.catch((error) => {
		console.log('error connecting to MongoDB: ', error.message)
	})

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true
	},
	email: {
		type: mongoose.Schema.Types,
		unique: true,
		required: true
	},
	passwordHash: {
		type: String,
		required: true
	},
	boards: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Board'
		}
	],
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
		// the passwordHash should not be revealed
		delete returnedObject.passwordHash
	}
})

module.exports = mongoose.model('User', userSchema)
