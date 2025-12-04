const path = require('path');
require('dotenv').config({path: path.resolve(process.cwd(), "../../.env")});
const express = require('express');
const cors = require('cors');
const { initDB } = require('./shared-db/setup');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended:true }))
app.use(express.text({ type: 'text/plain' }));

const admin = require('./admin-service/routes/adminRoutes');
const client = require('./client-service/routes/clientRoutes');
const llm = require('./llm-service/routes/llmRoutes');
const auth = require('./user-authentication-service/routes/authRoutes');

const PORT = 5001;

console.log(process.env.CLIENT_ORIGIN)

//app.use(cors());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || `http://localhost:3000`,
  credentials: true
}));
app.use('/api', admin);
app.use('/api', client);
app.use('/api/llm', llm);
app.use('', auth);

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

app.listen(process.env.PORT || PORT, () => console.log(`Server running at http://localhost:${PORT}`));

initDB();