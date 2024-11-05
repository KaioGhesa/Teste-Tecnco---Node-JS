const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const redis = require('redis');
const taskRoutes = require('./routes/tasks');

const app = express();
const redisClient = redis.createClient();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/tasks', taskRoutes);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
