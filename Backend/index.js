// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// --- MySQL Connection ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // your MySQL username
    password: '',      // your MySQL password
    database: 'localbusinessdirectory'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

// --- Routes ---

// Get all businesses with reviews
app.get('/api/businesses', (req, res) => {
    const sql = `
        SELECT b.*, r.id AS reviewId, r.comment, r.rating, r.userName, r.userImage, r.createdAt
        FROM businesses b
        LEFT JOIN reviews r ON b.id = r.business_id
        ORDER BY b.id, r.createdAt;
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err });

        const businessesMap = {};
        results.forEach(row => {
            if (!businessesMap[row.id]) {
                businessesMap[row.id] = {
                    id: row.id,
                    name: row.name,
                    about: row.about,
                    address: row.address,
                    category: row.category,
                    imageUrl: row.imageUrl,
                    website: row.website,
                    reviews: []
                };
            }
            if (row.reviewId) {
                businessesMap[row.id].reviews.push({
                    id: row.reviewId,
                    comment: row.comment,
                    rating: row.rating,
                    userName: row.userName,
                    userImage: row.userImage,
                    createdAt: row.createdAt
                });
            }
        });

        res.json(Object.values(businessesMap));
    });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
