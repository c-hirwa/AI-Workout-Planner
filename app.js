const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

const RAPIDAPI_KEY = '4de4cb1a14msh060fb733ee5072cp1dc4d6jsnc5edd28bfe35';

app.post('/api/find-exercises', async (req, res) => {
    const { muscle, difficulty, equipment } = req.body;

    // Construct query parameters
    const params = new URLSearchParams();
    if (muscle) params.append('muscle', muscle);
    if (difficulty) params.append('difficulty', difficulty);
    if (equipment) params.append('equipment', equipment);

    const url = `https://exercises-by-api-ninjas.p.rapidapi.com/v1/exercises?${params.toString()}`;

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': RAPIDAPI_KEY,
            'x-rapidapi-host': 'exercises-by-api-ninjas.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            return res.status(response.status).json({ error: errorText });
        }

        const exercises = await response.json();
        res.json({ exercises });
    } catch (error) {
        console.error('Detailed Error:', error);
        res.status(500).json({ error: 'Failed to fetch exercises', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
