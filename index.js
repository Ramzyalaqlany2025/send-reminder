const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const app = express();
const port = process.env.PORT || 3000;

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE;

const client = twilio(accountSid, authToken);
app.use(bodyParser.json());

app.post('/send-reminder', (req, res) => {
    const { phone, name, dosage, frequency, duration } = req.body;
    if (!phone || !name || !dosage || !frequency || !duration) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    const messageBody = `🔔 Reminder: ${name} - ${dosage}, ${frequency} times/day for ${duration}`;
    client.messages
        .create({
            body: messageBody,
            from: twilioPhone,
            to: phone
        })
        .then(message => res.json({ success: true, sid: message.sid }))
        .catch(error => res.status(500).json({ error: 'Failed to send SMS', details: error.message }));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
