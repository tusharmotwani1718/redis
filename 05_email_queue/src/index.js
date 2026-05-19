import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const QUEUE_KEY="queue:emails";

app.post('/emails', async (req, res) => {
    const { to, subject, body } = req.body;
    
    // each queue item is a JSON string containing the email details, this queue will be processed by a separate worker that sends the emails.
    // each queue item is known as "job".
    const job = {
        to, 
        subject: subject || 'No Subject',
        body: body || 'No Body',
        createdAt: new Date().toISOString()
    };


    await redis.lpush(QUEUE_KEY, JSON.stringify(job)); // Add the job to the queue from the left side of the list (LPUSH)

    res.status(201).json({ message: 'Email queued successfully', job });
});

app.post('emails/process-one', async (req, res) => {
    const rawJob = await redis.rpop(QUEUE_KEY); // Remove and get the last job from the right side of the list (RPOP)

    if (!rawJob) {
        return res.status(200).json({ message: 'No emails to process' });
    }

    const job = JSON.parse(rawJob);

    // Simulate email sending (replace with actual email sending logic)
    console.log(`Sending email to: ${job.to}, Subject: ${job.subject}, Body: ${job.body}`);

    res.json({ message: 'Email processed successfully', job });
});