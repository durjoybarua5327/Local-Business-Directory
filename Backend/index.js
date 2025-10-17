// Simple Express server with CORS and MySQL2 (promise) connection
// Usage:
// 1) Install dependencies: npm i express cors mysql2 dotenv
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;
const mysql = require('mysql2');
app.use(express.json());


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'localbusinessdirectory'
});


db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL database');
});



app.listen(PORT, () => {
	console.log(`Backend server listening on port ${PORT}`);
	// Quick connection test
	// pool.getConnection().then(conn => {
	// 	conn.ping().then(() => {
	// 		console.log('MySQL connection successful');
	// 		conn.release();
	// 	}).catch(err => {
	// 		console.error('MySQL ping error:', err.message);
	// 		conn.release();
	// 	});
	// }).catch(err => {
	// 	console.error('Unable to acquire MySQL connection from pool:', err.message);
	// });
});

