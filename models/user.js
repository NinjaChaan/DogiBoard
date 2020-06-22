const isEmail = require('validator/lib/isEmail')
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
		unique: 'That username already exists. Choose another.',
		trim: true,
		required: 'Username is required',
		minlength: 4
	},
	email: {
		type: String,
		unique: 'That email already exists. Choose another.',
		trim: true,
		lowercase: true,
		required: 'Email address is required',
		validate: [isEmail, 'Please fill a valid email address'],
	},
	gravatarEmail: {
		type: String,
		unique: 'That gravatar email already exists. Choose another.',
		trim: true,
		lowercase: true,
		validate: [isEmail, 'Please fill a valid email address'],
	},
	passwordHash: {
		type: String,
		trim: true,
		required: 'Password is required',
		minlength: 7
	},
	boards: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Board'
		}
	],
	invites: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Board'
		}
	],
	color: {
		type: Object,
		r: {
			type: String
		},
		g: {
			type: String
		},
		b: {
			type: String
		}
	}
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
