require('dotenv').config();
const { Pool } = require('pg');

// Set up database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Define SQL queries
const insertCategories = `
  INSERT INTO categories (name, description) VALUES
  ('Fiction', 'Fictional books that tell stories created from the imagination.'),
  ('Non-Fiction', 'Books that are based on real events, people, and facts.'),
  ('Science Fiction', 'Books that explore futuristic concepts and advanced technology.'),
  ('Fantasy', 'Books that contain magical elements and fantastical worlds.'),
  ('Mystery', 'Books that involve solving a crime or uncovering secrets.'),
  ('Biography', 'Books that tell the life story of a person.'),
  ('History', 'Books that cover historical events and figures.'),
  ('Self-Help', 'Books designed to help readers improve themselves or their lives.');
`;

const insertBooks = `
  INSERT INTO books (title, author, price, stock_quantity, description, isbn) VALUES
  ('The Great Gatsby', 'F. Scott Fitzgerald', 10.99, 100, 'A novel set in the Roaring Twenties that critiques the American Dream.', '9780743273565'),
  ('To Kill a Mockingbird', 'Harper Lee', 7.99, 50, 'A novel about racial injustice in the Deep South.', '9780061120084'),
  ('1984', 'George Orwell', 8.99, 75, 'A dystopian novel about totalitarianism and surveillance.', '9780451524935'),
  ('Pride and Prejudice', 'Jane Austen', 6.99, 30, 'A romantic novel that critiques the British landed gentry.', '9780141040349'),
  ('The Catcher in the Rye', 'J.D. Salinger', 9.99, 60, 'A novel about teenage angst and alienation.', '9780316769488');
`;

const insertBookCategories = `
  INSERT INTO book_categories (book_id, category_id) VALUES
  (1, 1), -- The Great Gatsby -> Fiction
  (2, 1), -- To Kill a Mockingbird -> Fiction
  (3, 3), -- 1984 -> Science Fiction
  (4, 4), -- Pride and Prejudice -> Fantasy
  (5, 1); -- The Catcher in the Rye -> Fiction
`;

// Execute queries
async function runQueries() {
  try {
    await pool.query(insertCategories);
    await pool.query(insertBooks);
    await pool.query(insertBookCategories);
    console.log('Dummy data inserted successfully');
  } catch (err) {
    console.error('Error inserting dummy data:', err);
  } finally {
    await pool.end(); // Close the connection
  }
}

runQueries();