const express = require('express');
const bodyParser = require('body-parser');
const { generateWorkoutPlan } = require('./app');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/api/generate-workout', async (req, res) => {
    try {
        const { goal, fitnessLevel, preferences } = req.body;
        const workoutPlan = await generateWorkoutPlan(goal, fitnessLevel, preferences);
        res.json({ workoutPlan });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate workout plan' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
