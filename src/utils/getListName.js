const _ = require('underscore')

const getListName = (board, listId) => {
	const name = board.lists.find((list) => {
		if (list._id) {
			return _.isEqual(list._id, listId)
		} if (list.id) {
			return list.id.toString() === listId.toString()
		}
	}).name
	return name
}

module.exports = getListName
