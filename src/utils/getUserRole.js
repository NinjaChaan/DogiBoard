const getRole = (users, userId) => users.filter((user) => user.id === userId).role

export default getRole
