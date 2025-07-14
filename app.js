require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const categoriesRouter = require('./routes/categories');
const booksRouter = require('./routes/books');

const app = express();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Middleware
app.use(express.static('public'));
app.use(expressLayouts);
app.set('layout', 'layout');
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use('/categories', categoriesRouter(pool));
app.use('/books', booksRouter(pool));


// Home page redirects to categories
app.get('/', (req, res) => {
  res.redirect('/categories');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});