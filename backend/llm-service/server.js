const express = require('express');
const cors = require('cors');
const llmRoutes = require('./routes/llmRoutes');

const app = express();
const PORT = 8001;

app.use(cors());
app.use(express.text({ type: 'text/plain' }));
app.use('/api/llm', llmRoutes);

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
    console.log(`LLM service listening on http://localhost:${PORT}`);
});