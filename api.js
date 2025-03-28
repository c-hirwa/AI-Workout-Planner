class FitnessAPI {
    constructor() {
        this.exercisesApiUrl = 'https://api.api-ninjas.com/v1/exercises';
        this.apiKey = 'Uvqa5i7ZXQdqTp0dNzy71A==VTi8SWKa95JwvOLe'; // API key provided in example
    }

    async getExercises(muscle, difficulty = null) {
        try {
            // Construct URL with muscle parameter
            let url = `${this.exercisesApiUrl}?muscle=${muscle}`;
            
            // Add difficulty parameter if specified
            if (difficulty) {
                url += `&difficulty=${difficulty}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-Api-Key': this.apiKey,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch exercises');
            }

            const exercises = await response.json();
            
            // Limit to 5 exercises
            return exercises.slice(0, 5);
        } catch (error) {
            console.error('Error fetching exercises:', error);
            return [];
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}
