if (!window.fetch) {
    // Simple fetch polyfill
    window.fetch = function(url, options) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(options.method || 'GET', url, true);
            
            // Set headers
            if (options.headers) {
                Object.keys(options.headers).forEach(key => {
                    xhr.setRequestHeader(key, options.headers[key]);
                });
            }

            xhr.onload = function() {
                resolve({
                    ok: xhr.status >= 200 && xhr.status < 300,
                    status: xhr.status,
                    json: () => Promise.resolve(JSON.parse(xhr.responseText))
                });
            };

            xhr.onerror = function() {
                reject(new Error('Network error'));
            };

            // Send the request
            if (options.body) {
                xhr.send(JSON.stringify(options.body));
            } else {
                xhr.send();
            }
        });
    };
}

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
