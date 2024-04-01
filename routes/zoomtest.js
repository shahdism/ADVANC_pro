require('dotenv').config();

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser'); // Import bodyParser

const app8 = express();
const port = 6001;

app8.get('/', async (req, res) => {
    const code = req.query.code;
    try {
        const response = await axios.post('https://zoom.us/oauth/token', null, {
            params: {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: 'http://localhost:6001'
            },
            headers: {
                'Authorization': `Basic ${Buffer.from(`${'0EL4fGVGR7a03HcnOPlVlQ'}:${'K5JjHk6o20fKWmkstcT445LlY8SDf8TM'}`).toString('base64')}`
            }
        });
        res.send(response.data.access_token);
    } catch (error) {
        console.error('Error', error);
        res.send('Error');
    }

});

app8.use(bodyParser.json());

// Export the app module
module.exports = app8;