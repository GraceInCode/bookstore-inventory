# Bookstore Inventory App

This is an inventory management application for a bookstore, built as part of a web development course. It allows users to manage book categories and books with full CRUD (Create, Read, Update, Delete) functionality. The app is built using Node.js, Express, and PostgreSQL, and is designed to be deployed on Railway.

## Features

    · Categories and Books Management: Create, read, update, and delete categories and books.
    · Many-to-Many Relationships: Books can belong to multiple categories, and categories can have multiple books.
    · Admin Password Protection: Destructive actions (update and delete) are protected by an admin password.
    Deployment-Ready: Configured for easy deployment on Railway.

## Installation

Follow these steps to set up the project locally:

``
Clone the Repository
git clone https://github.com/your-username/bookstore-inventory.git
cd bookstore-inventory
``

Install Dependencies
``
npm install
``

Set Up Environment Variables Create a .env file in the root directory with the following content:

``
DATABASE_URL=postgres://your_username:your_password@localhost:5432/bookstore_db
ADMIN_PASSWORD=your_secret_password
``

## Set Up PostgreSQL Database

    • Ensure PostgreSQL is installed and running on your system.
    • Create a database named bookstore_db.
    Run the following SQL commands to create the necessary tables:
    
    ``
    CREATE TABLE categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT
    );

    CREATE TABLE books (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      stock_quantity INTEGER NOT NULL,
      description TEXT,
      isbn VARCHAR(13) UNIQUE
    );

    CREATE TABLE book_categories (
      book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
      category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
      PRIMARY KEY (book_id, category_id)
    );
    ``

## Populate Dummy Data (Optional)

• If you have a dummy-data.sql script, run it to insert sample data:

``
psql -U your_username -d bookstore_db -f dummy-data.sql
``

Usage

Run the App Locally
``
npm start
``

The app will be available at [http://localhost:3000](http://localhost:3000).
Interact with the App
Home Page: View all categories.
Category Page: View books in a specific category.
Book Page: View details of a specific book.
Add New Category/Book: Use the navigation links to access forms for adding new categories or books.
Edit/Delete Category/Book: Use the edit and delete options on the category or book pages (requires the admin password).

Deployment

To deploy the app on Railway, follow these steps:

Push to GitHub

Ensure your code is committed and pushed to a GitHub repository.

Create a Railway Project

Sign up at Railway.

Create a new project and link your GitHub repository.

Add PostgreSQL Database

Use Railway's plugin to add a PostgreSQL database to your project.

Note the provided DATABASE_URL.

Set Environment Variables

In your Railway project settings, add the following

``
environment variables:
            DATABASE_URL: Use the value provided by Railway.
            ADMIN_PASSWORD: Set to your chosen admin password.
``

Deploy

Railway will automatically deploy your app. Access it via the provided URL.

Populate Database

Connect to the Railway database using psql with the DATABASE_URL and run the dummy-data.sql script if needed.

Additional Notes

The app uses EJS for templating and includes basic CSS for styling.

Ensure that the admin password is kept secure and not shared publicly.

For local development, update the .env file with your actual database credentials.
