const {
	addBooksHandler,
	getAllBooksHandler,
	getDetailBooksHandler,
	editBookByIdHandler,
	deleteBookByIdHandler
} = require('./handler')

const routes = [
	{
		method: 'POST',
		path: '/books',
		handler: addBooksHandler
	},
	{
		method: 'GET',
		path: '/{books?}',
		handler: getAllBooksHandler
	},
	{
		method: 'GET',
		path: '/books/{bookId}',
		handler: getDetailBooksHandler
	},
	{
		method: 'PUT',
		path: '/books/{bookId}',
		handler: editBookByIdHandler
	},
	{
		method: 'DELETE',
		path: '/books/{bookId}',
		handler: deleteBookByIdHandler
	}
]

module.exports = routes;