import Redis from 'ioredis';

const subscriber = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

subscriber.subscribe("notifications-channel", (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log("Subscribed to notifications-channel");
})

subscriber.on("message", (channel, message) => {
    console.log(`Received message from ${channel}: ${message}`);
})