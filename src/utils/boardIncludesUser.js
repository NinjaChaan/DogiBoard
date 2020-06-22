const _ = require('underscore')

const boardIncludesUser = (board, userId) => {
	const exists = board.users.some((u) => {
		if (u._id) {
			return _.isEqual(u._id, userId)
		} if (u.id) {
			return u.id.toString() === userId.toString()
		} return false
	})
	return exists
}

module.exports = boardIncludesUser
