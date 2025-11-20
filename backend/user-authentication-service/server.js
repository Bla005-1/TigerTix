const path = require('path')
require('dotenv').config({path: path.resolve(process.cwd(), "../../.env")})
const express = require('express');
const cors = require('cors');
const app = express();
const { initDB } = require('../shared-db/setup');

app.use(express.json());
app.use(express.urlencoded({ extended:true }))

const routes = require('./routes/authRoutes');

const PORT = 7001;

app.use(cors({
  origin: PORT,
  credentials: true
}));
app.use('', routes);

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

initDB();

//need to add making sure you can't use the same username over again