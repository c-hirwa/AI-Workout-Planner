const fetch = require('node-fetch');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '4de4cb1a14msh060fb733ee5072cp1dc4d6jsnc5edd28bfe35';

async function generateWorkoutPlan(userGoal, fitnessLevel, preferences) {
    const url = 'https://ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com/generateWorkoutPlan?noqueue=1';
    
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': RAPIDAPI_KEY,
            'x-rapidapi-host': 'ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            goal: userGoal || 'Build muscle',
            fitness_level: fitnessLevel || 'Intermediate',
            preferences: preferences || ['Weight training', 'Cardio'],
            health_conditions: ['None'],
            schedule: {
                days_per_week: 4,
                session_duration: 60
            },
            plan_duration_weeks: 4,
            lang: 'en'
        })
    };

    try {
        const response = await fetch(url, options);
        const result = await response.text();
        return result;
    } catch (error) {
        console.error('Error generating workout plan:', error);
        throw new Error('Failed to generate workout plan');
    }
}

module.exports = { generateWorkoutPlan };
