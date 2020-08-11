const getRole = (users, userId) => users.find((user) => user.id === userId).role

export default getRole
