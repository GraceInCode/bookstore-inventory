const express = require('express');

module.exports = (pool) => {
    const router = express.Router();

    // READ: List all categories (home page)
    router.get('/', async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM categories ORDER BY name');
            res.render('categories/index', { categories: result.rows });
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });

    // CREATE: Form for new category (MUST come before /:id route)
    router.get('/new', (req, res) => res.render('categories/new'));

    // CREATE: Add new category
    router.post('/', async (req, res) => {
        const { name, description } = req.body;
        try {
            await pool.query('INSERT INTO categories (name, description) VALUES ($1, $2)', [name, description]);
            res.redirect('/categories');
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });

    // UPDATE: Form for editing category (MUST come before /:id route)
    router.get('/:id/edit', async (req, res) => {
        const categoryId = req.params.id;
        try {
            const result = await pool.query('SELECT * FROM categories WHERE id = $1', [categoryId]);
            if (result.rows.length === 0) return res.status(404).send('Category not found');
            res.render('categories/edit', { category: result.rows[0] });
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });

    // READ: View a category and its books (MUST come after specific routes)
    router.get('/:id', async (req, res) => {
        const categoryId = req.params.id;
        try {
            const categoryResult = await pool.query('SELECT * FROM categories WHERE id = $1', [categoryId]);
            const booksResult = await pool.query(
                'SELECT * FROM books b JOIN book_categories bc ON b.id = bc.book_id WHERE bc.category_id = $1',
                [categoryId]
            );
            if (categoryResult.rows.length === 0) return res.status(404).send('Category not found');
            res.render('categories/show', {
                category: categoryResult.rows[0],
                books: booksResult.rows
            });
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });

    // UPDATE: Save edited category
    router.put('/:id', async (req, res) => {
        const { name, description, admin_password } = req.body;
        if (admin_password !== process.env.ADMIN_PASSWORD) {
            return res.status(403).send('Forbidden: Incorrect admin password');
        }
        const categoryId = req.params.id;
        try {
            await pool.query('UPDATE categories SET name = $1, description = $2 WHERE id = $3', [name, description, categoryId]);
            res.redirect(`/categories/${categoryId}`);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });

    // DELETE: Remove category
    router.delete('/:id', async (req, res) => {
        const { admin_password } = req.body;
        if (admin_password !== process.env.ADMIN_PASSWORD) {
            return res.status(403).send('Forbidden: Incorrect admin password');
        }
        const categoryId = req.params.id;
        try {
            await pool.query('DELETE FROM categories WHERE id = $1', [categoryId]);
            res.redirect('/categories');
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    });

    return router;
};