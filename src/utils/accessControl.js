/* eslint-disable import/prefer-default-export */
const AccessControl = require('accesscontrol')

const ac = new AccessControl()
ac.grant('user') // define new or modify existing role. also takes an array.
	.readOwn('board')
	.createOwn('board') // equivalent to .createOwn('board', ['*'])
	.updateOwn('board', ['*', '!removeUser'])
	.updateOwn('profile', ['*', '!id'])
	.grant('admin') // switch to another role without breaking the chain
	.extend('user') // inherit role capabilities. also takes an array
	.updateOwn('board')
	.deleteOwn('board')
	.grant('superAdmin')
	.extend('admin')
	.readAny('board')
	.readAny('user')
	.deleteAny('board')
	.deleteAny('user')

module.exports = ac
