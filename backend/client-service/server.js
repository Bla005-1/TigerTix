const express = require('express');
const cors = require('cors');
const clientRoutes = require('./routes/clientRoutes');

const app = express();
const PORT = 6001;

app.use(cors());
app.use(express.json());
app.use('/api', clientRoutes);

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
    console.log(`Client service listening on http://localhost:${PORT}`);
});