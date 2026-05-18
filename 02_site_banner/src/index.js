import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');


const BANNER_KEY = 'app:banner';

app.post('/banner', async (req, res) => {
    const { message } = req.body;

    const setBanner = await redis.set(BANNER_KEY, message || "Welcome to the site!");
    res.json({ sucess: true });
});


app.get('/banner', async (req, res) => {
    const banner = await redis.get(BANNER_KEY) || "Welcome to the site!";
    res.json({ banner });
});

app.delete('/banner', async (req, res) => {
    await redis.del(BANNER_KEY);
    res.json({ success: true });
});

app.get('/banner/exists', async (req, res) => {
    const exists = await redis.exists(BANNER_KEY);
    // console.log('Banner exists:', exists);
    res.json({ exists: Boolean(exists) });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});