import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

function otpKey(phone) {
    return `otp:${phone}`;
}

app.post(`/otp`, async (req, res) => {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    const key = otpKey(phone);

    const setOtp = await redis.set(key, otp, 'EX', 30); // OTP expires in 30 seconds
    res.json({ sucess: true, message: `OTP sent to ${phone}`, otp: otp }); // In production, you would send the OTP via SMS, not return it in the response
});

app.post(`/otp/verify`, async (req, res) => {
    const { phone, otp } = req.body;
    const key = otpKey(phone);

    // check if the otp exists:
    const exists = await redis.exists(key);
    if(!exists) {
        return res.status(400).json({ success: false, message: 'OTP expired or does not exist' });
    }

    const storedOtp = await redis.get(key); // Get the stored OTP from Redis
    
    if(storedOtp && storedOtp !== otp) {
        return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    await redis.del(key);

    res.json({ success: true, message: 'OTP verified' });
});



app.get(`/otp/:phone/ttl`, async (req, res) => {
    const { phone } = req.params;
    const key = otpKey(phone);  
    const ttl = await redis.ttl(key);

    

    res.json({ success: true, ttl });

});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});