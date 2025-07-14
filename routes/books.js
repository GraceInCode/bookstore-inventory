const express = require('express');

module.exports = (pool) => {
    const router = express.Router();

    // CREATE: Form for new book (MUST come before /:id route)
    router.get('/new', async (req, res) => {
        try {
            const categoriesResult = await pool.query('SELECT * FROM categories ORDER BY name');
            res.render('books/new', { categories: categoriesResult.rows });
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });

    // UPDATE: Form for editing book (MUST come before /:id route)
    router.get('/:id/edit', async (req, res) => {
        const bookId = req.params.id;
        try {
            const bookResult = await pool.query('SELECT * FROM books WHERE id = $1', [bookId])
            const categoriesResult = await pool.query('SELECT * FROM categories ORDER BY name')
            const bookCategoriesResult = await pool.query(
                'SELECT category_id FROM book_categories WHERE book_id = $1',
                [bookId]
            );
            if (bookResult.rows.length === 0) return res.status(404).send('Book not found');
            const bookCategories = bookCategoriesResult.rows.map(row => row.category_id)
            res.render('books/edit', {
                book: bookResult.rows[0],
                categories: categoriesResult.rows,
                bookCategories
            });
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });

    // READ: View a book (MUST come after specific routes like /new and /:id/edit)
    router.get('/:id', async (req, res) => {
        const bookId = req.params.id;
        try {
            const bookResult = await pool.query('SELECT * FROM books WHERE id = $1', [bookId]);
            const categoriesResult = await pool.query(
                'SELECT c.* FROM categories c JOIN book_categories bc ON c.id = bc.category_id WHERE bc.book_id = $1',
                [bookId]
            );
            if (bookResult.rows.length === 0) return res.status(404).send('Book not found');
            res.render('books/show', {
                book: bookResult.rows[0],
                categories: categoriesResult.rows
            });
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });

    // CREATE: Add new book
    router.post('/', async (req, res) => {
        const { title, author, price, stock_quantity, description, isbn, category_ids } = req.body;
        try {
            const bookResult = await pool.query(
                'INSERT INTO books (title, author, price, stock_quantity, description, isbn) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [title, author, price, stock_quantity, description, isbn]
            );
            const bookId = bookResult.rows[0].id;
            if (category_ids) {
                // Ensure category_ids is always an array
                const categoryIdsArray = Array.isArray(category_ids) ? category_ids : [category_ids];
                const values = categoryIdsArray.map(categoryId => [bookId, categoryId])
                for (const [bId, cId] of values) {
                    await pool.query('INSERT INTO book_categories (book_id, category_id) VALUES ($1, $2)', [bId, cId]);
                }
            }

            res.redirect(`/books/${bookId}`);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });

    // UPDATE: Save edited book
    router.put('/:id', async (req, res) => {
        const { title, author, price, stock_quantity, description, isbn, category_ids, admin_password } = req.body;
        if (admin_password !== process.env.ADMIN_PASSWORD) {
            return res.status(403).send('Forbidden: Invalid admin password');
        }
        const bookId = req.params.id;
        try {
            await pool.query(
                'UPDATE books SET title = $1, author = $2, price = $3, stock_quantity = $4, description = $5, isbn = $6 WHERE id = $7',
                [title, author, price, stock_quantity, description, isbn, bookId]
            );
            await pool.query('DELETE FROM book_categories WHERE book_id = $1', [bookId]);
            if (category_ids) {
                // Ensure category_ids is always an array
                const categoryIdsArray = Array.isArray(category_ids) ? category_ids : [category_ids];
                const values = categoryIdsArray.map(categoryId => [bookId, categoryId]);
                for (const [bId, cId] of values) {
                    await pool.query('INSERT INTO book_categories (book_id, category_id) VALUES ($1, $2)', [bId, cId]);
                }
            }
            res.redirect(`/books/${bookId}`);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });

    // DELETE: Remove book
    router.delete('/:id', async (req, res) => {
        const { admin_password } = req.body;
        if (admin_password !== process.env.ADMIN_PASSWORD) {
            return res.status(403).send('Forbidden: Invalid admin password');
        }
        const bookId = req.params.id;
        try {
            await pool.query('DELETE FROM books WHERE id = $1', [bookId]);
            res.redirect('/categories');
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });

    return router;
}