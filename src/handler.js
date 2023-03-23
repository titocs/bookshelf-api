const { nanoid } = require('nanoid');
const Books = require('./books');

// Menambahkan buku
const addBooksHandler = (request, h) => {
	const { 
		name, year, author, summary, publisher, pageCount, readPage, reading
	} = request.payload;

	const id = nanoid(16);
	const insertedAt = new Date().toISOString();
	const finished = pageCount === readPage;
	const updatedAt = insertedAt;

	if(!name){
		const response = h.response({
			status: "fail",
			message: "Gagal menambahkan buku. Mohon isi nama buku",
		});
		response.code(400);
		return response;
	}
	if(readPage > pageCount){
		const response = h.response({
			status: "fail",
			message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
		});
		response.code(400);
		return response;
	}

	const newBooks = {
		id, 
		name, 
		year, 
		author, 
		summary, 
		publisher, 
		pageCount, 
		readPage, 
		finished, 
		reading, 
		insertedAt,
		updatedAt
	}
	Books.push(newBooks);

	const response = h.response({
		status: "success",
		message: "Buku berhasil ditambahkan",
		data: {
			bookId: id
		}
	});
	response.code(201);
	return response;
}

// Menampilkan seluruh buku
const getAllBooksHandler = (request, h) => {
	const { name, reading, finished } = request.query;

	let filteredBooks = Books;

	if(name){
		filteredBooks = filteredBooks.filter((b) => b.name.toLowerCase().includes(name.toLowerCase()));
		const response = h.response({
			status: 'success',
			data: {
				books: filteredBooks.map(({id, name, publisher}) => ({ id, name, publisher }))
			}
		}).code(200);
		return response;
	}
	if(reading){
		filteredBooks = filteredBooks.filter((b) => b.reading === true);
		const response = h.response({
			status: 'success',
			data: {
				books: filteredBooks.map(({id, name, publisher}) => ({ id, name, publisher }))
			}
		}).code(200);
		return response;
	}
	if(finished){
		filteredBooks = filteredBooks.filter((b) => b.finished === (finished === '1'));
		const response = h.response({
			status: 'success',
			data: {
				books: filteredBooks.map(({id, name, publisher}) => ({ id, name, publisher }))
			}
		}).code(200);
		return response;
	}
	if(Books.length !== 0){
		const response = h.response({
			status: 'success',
			data: {
				books: filteredBooks.map(({id, name, publisher}) => ({ id, name, publisher }))
			}
		}).code(200);
		return response;
	}
	const response = h.response({
		status: 'success',
		data: {
			books: []
		}
	}).code(200);
	return response;
};

// Menampilkan detail buku
const getDetailBooksHandler = (request, h) => {
	const { bookId } = request.params;

	const bookItem = Books.filter(b => b.id === bookId)[0];
	if(bookItem !== undefined){
		return {
			status: 'success',
			data: {
				book: {
					...bookItem
				}
			}
		}
	}
	const response = h.response({
		status: 'fail',
		message: 'Buku tidak ditemukan'
	});
	response.code(404);
	return response;
};

// Mengubah data buku
const editBookByIdHandler = (request, h) => {
	const { bookId } = request.params;
	const {
		name, year, author, summary, publisher, pageCount, readPage, reading
	} = request.payload;

	if(!name){
		const response = h.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. Mohon isi nama buku'
		});
		response.code(400);
		return response;
	}
	if(readPage > pageCount){
		const response = h.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
		});
		response.code(400);
		return response;
	}
	const index = Books.findIndex(bookIdx => bookIdx.id === bookId);

	const updatedAt = new Date().toISOString();

	if(index !== -1){
		Books[index] = {
			...Books[index],
			name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt
		};
		const response = h.response({
			status: 'success',
			message: 'Buku berhasil diperbarui'
		})
		response.code(200);
		return response;
	}
	const response = h.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. Id tidak ditemukan'
	});
	response.code(404);
	return response;
};

// Menghapus buku
const deleteBookByIdHandler = (request, h) => {
	const { bookId } = request.params;

	const index = Books.findIndex(bookIdx => bookIdx.id === bookId);

	if(index !== -1){
		Books.splice(index, 1);
		const response = h.response({
			status: 'success',
			message: 'Buku berhasil dihapus'
		});
		response.code(200);
		return response;
	}
	const response = h.response({
		status: 'fail',
		message: 'Buku gagal dihapus. Id tidak ditemukan'
	});
	response.code(404);
	return response;
}

module.exports = {
	addBooksHandler,
	getAllBooksHandler,
	getDetailBooksHandler,
	editBookByIdHandler,
	deleteBookByIdHandler
}