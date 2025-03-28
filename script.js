document.getElementById('searchButton').addEventListener('click', async function() {
    const muscle = document.getElementById('muscle').value;
    const difficulty = document.getElementById('difficulty').value;
    const equipment = document.getElementById('equipment').value;
    const exercisesContainer = document.getElementById('exercisesContainer');

    // Clear previous results
    exercisesContainer.innerHTML = '<p>Searching for exercises...</p>';

    try {
        const response = await fetch('/api/find-exercises', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ muscle, difficulty, equipment })
        });

        const data = await response.json();

        if (data.exercises && data.exercises.length > 0) {
            // Generate exercise cards
            const exercisesHTML = data.exercises.map(exercise => `
                <div class="exercise-card">
                    <div class="exercise-name">${exercise.name}</div>
                    <div class="exercise-details">
                        <p><strong>Muscle:</strong> ${exercise.muscle}</p>
                        <p><strong>Equipment:</strong> ${exercise.equipment}</p>
                        <p><strong>Difficulty:</strong> ${exercise.difficulty}</p>
                        <p><strong>Instructions:</strong> ${exercise.instructions}</p>
                    </div>
                </div>
            `).join('');

            exercisesContainer.innerHTML = exercisesHTML;
        } else {
            exercisesContainer.innerHTML = '<p>No exercises found matching your criteria.</p>';
        }
    } catch (error) {
        console.error('Error:', error);
        exercisesContainer.innerHTML = `<p>An error occurred: ${error.message}</p>`;
    }
});
