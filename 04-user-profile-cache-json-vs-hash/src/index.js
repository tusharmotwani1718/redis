import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');


app.post('/set-user-data/:id/json', async (req, res) => {
    const userId = req.params.id;
    const userData = req.body;

    await redis.set(`user:${userId}:json`, JSON.stringify(userData));
    res.json({ storedAs: 'json', message: 'User data stored as JSON' });
})

app.get('/get-user-data/:id/json', async (req, res) => {
    const userId = req.params.id;
    const userData = await redis.get(`user:${userId}:json`);
    res.json({ storedAs: 'json', message: 'User data retrieved as JSON', data: JSON.parse(userData) });
})


app.post('/set-user-data/:id/hash', async (req, res) => {
    const userId = req.params.id;
    const userData = req.body;

    await redis.hset(`user:${userId}:hash`, userData);
    res.json({ storedAs: 'hash', message: 'User data stored as Hash' });
})

app.get('/get-user-data/:id/hash', async (req, res) => {
    const userId = req.params.id;
    const userData = await redis.hgetall(`user:${userId}:hash`);
    res.json({ storedAs: 'hash', message: 'User data retrieved as Hash', data: userData });
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});