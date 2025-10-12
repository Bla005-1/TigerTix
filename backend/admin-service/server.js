const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended:true }))

const routes = require('./routes/adminRoutes');

app.use(cors());
app.use('/api', routes);
const PORT = 5001;

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

//$ curl -X POST 'http://localhost:5001/api/events' -H 'Content-Type: application/json' -d '{"id":1,"name":"Clemson Football Game","date":"2025-09-01","tickets_available":500}'