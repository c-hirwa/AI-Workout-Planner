document.getElementById('workoutForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const goal = document.getElementById('goal').value;
    const fitnessLevel = document.getElementById('fitnessLevel').value;
    
    // Collect selected preferences
    const preferenceCheckboxes = document.querySelectorAll('input[name="preferences"]:checked');
    const preferences = Array.from(preferenceCheckboxes).map(cb => cb.value);

    const responseText = document.getElementById('responseText');

    if (goal && fitnessLevel && preferences.length > 0) {
        try {
            const result = await fetch('/api/generate-workout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ goal, fitnessLevel, preferences })
            });

            const response = await result.json();

            if (response && response.workoutPlan) {
                responseText.textContent = response.workoutPlan;
            } else {
                responseText.textContent = "Sorry, could not generate a workout plan.";
            }
        } catch (error) {
            console.error('Error:', error);
            responseText.textContent = "An error occurred while generating the workout plan.";
        }
    } else {
        responseText.textContent = "Please select a goal, fitness level, and at least one workout preference.";
    }
});
