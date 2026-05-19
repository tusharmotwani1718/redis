import express from 'express';
import { emailQueue } from './queue.js';

const app = express();
app.use(express.json());


app.post('/send-email', async (req, res) => {
    const { to, subject = 'No Subject', body } = req.body;
    const job = await emailQueue.add('send-email-job', 
        { to, subject, body }, 
        {
            attempts: 3, // Retry up to 3 times if the job fails
            backoff: {
                type: 'exponential',
                delay: 5000, // Initial delay of 5 seconds before retrying
            },
        }
    );
    res.json({ message: 'Email queued successfully', job });
});

app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000');
});