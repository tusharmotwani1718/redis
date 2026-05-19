// api is used as a publisher to send messages to the channel
import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());


const publisher = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');


app.post("/notifications", (req, res) => {
    const { title, message } = req.body;

    const result = publisher.publish("notifications-channel", JSON.stringify({
        title: title || "No title",
        message: message || "No message",
        createdAt: new Date()
    }));
    res.status(200).json({ message: "Notification sent" });
});

app.listen(3000, () => {
    console.log("API server is running on port 3000 url: http://localhost:3000");
});