import express from 'express';
import { appendFile } from 'fs/promises';
import fetch from 'node-fetch';


const webhookUrl = "http://webhook.site/a1422704-23aa-49ed-8263-df961d6a43be";
const app = express();

app.use(express.json());

// Middleware to log requests
app.use(async (req, res, next) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.method === 'POST' ? req.body : undefined
    };

    try {
        await appendFile('request_log.txt', JSON.stringify(logEntry, null, 2) + '\n');
    } catch (err) {
        console.error('Error writing to log file:', err);
    }
    next();
});


// Middleware to forward requests
app.use(async (req, res, next) => {
    const newUrl = `${webhookUrl}`;

    console.log(`Forwarding request to ${newUrl}`);

    try {
        const options = {
            method: req.method,
            body: req.method === 'POST' ? JSON.stringify(req.body) : undefined
        };

        if (req.method === 'POST') {
            options.headers = {
                'Content-Type': 'application/json'
            };
        }

        await fetch(newUrl, options);

        next();
    } catch (err) {
        console.error('Error forwarding request:', err);
        res.status(500).send('Error forwarding request');
    }
});



app.get('*', (req, res) => {
    res.status(200).send('OK');
});

app.post('*', (req, res) => {
    res.status(200).send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
