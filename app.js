document.addEventListener('DOMContentLoaded', () => {
    const fitnessAPI = new FitnessAPI();

    const muscleForm = document.getElementById('muscle-form');
    const workoutPlanSection = document.getElementById('workout-plan');
    const planDetailsSection = document.getElementById('plan-details');

    // Utility function to truncate instructions
    function truncateInstructions(instructions, maxLength = 150) {
        return instructions.length > maxLength 
            ? instructions.substring(0, maxLength) + '...' 
            : instructions;
    }

    muscleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get selected muscle group and difficulty
        const muscleGroup = document.getElementById('muscle-group').value;
        const difficultyLevel = document.getElementById('difficulty-level').value || null;

        try {
            // Fetch exercises based on muscle group and optional difficulty
            const exercises = await fitnessAPI.getExercises(muscleGroup, difficultyLevel);
            
            // Clear previous workout plan
            planDetailsSection.innerHTML = '';

            // If no exercises found
            if (exercises.length === 0) {
                planDetailsSection.innerHTML = `
                    <p>No exercises found for ${muscleGroup} ${difficultyLevel ? `at ${difficultyLevel} level` : ''}</p>
                `;
                return;
            }

            // Generate workout plan HTML
            const workoutHTML = `
                <h3>${muscleGroup.toUpperCase()} Workout Plan</h3>
                ${exercises.map((exercise, index) => `
                    <div class="exercise-card">
                        <h4>${index + 1}. ${exercise.name}</h4>
                        <p><strong>Type:</strong> ${exercise.type}</p>
                        <p><strong>Equipment:</strong> ${exercise.equipment}</p>
                        <p><strong>Difficulty:</strong> ${exercise.difficulty}</p>
                        <p><strong>Instructions:</strong> ${truncateInstructions(exercise.instructions)}</p>
                    </div>
                `).join('')}
            `;

            // Display workout plan
            planDetailsSection.innerHTML = workoutHTML;
            workoutPlanSection.classList.remove('hidden');

        } catch (error) {
            console.error('Error generating workout:', error);
            planDetailsSection.innerHTML = `<p>Error generating workout. Please try again.</p>`;
        }
    });
});
