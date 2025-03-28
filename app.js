document.addEventListener('DOMContentLoaded', function() {
    // API endpoint
    const WORKOUT_API = 'https://ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com/generateWorkoutPlan';
    const STORAGE_KEY = 'workoutPlannerData';
    
    // State variables
    let workouts = [];
    let weeklyGoal = 0;
    let totalWorkoutTime = 0;
    let workoutsCompleted = 0;
    let chartInstance = null;
    
    // DOM Elements
    const generateWorkoutBtn = document.getElementById('generateWorkoutBtn');
    const workoutsListEl = document.getElementById('workoutsList');
    const searchWorkoutsEl = document.getElementById('searchWorkouts');
    const sortWorkoutsEl = document.getElementById('sortWorkouts');
    const setGoalBtn = document.getElementById('setGoalBtn');
    const fitnessGoalEl = document.getElementById('fitnessGoal');
    const fitnessLevelEl = document.getElementById('fitnessLevel');
    const weeklyGoalEl = document.getElementById('weeklyGoal');
    const goalProgressEl = document.getElementById('goalProgress');
    const goalPercentageEl = document.getElementById('goalPercentage');
    const goalTargetEl = document.getElementById('goalTarget');
    const workoutsCompletedEl = document.getElementById('workoutsCompletedCount');
    const totalWorkoutTimeEl = document.getElementById('totalWorkoutTime');
    const chartTypeEl = document.getElementById('chartType');
    
    // Modals
    const workoutDetailsModal = document.getElementById('workoutDetailsModal');
    const completeWorkoutBtn = document.getElementById('completeWorkoutBtn');
    
    // Initial setup
    initializeApp();
    
    function initializeApp() {
        loadData();
        renderWorkouts();
        updateDashboard();
        updateChart();
        
        // Event Listeners
        generateWorkoutBtn.addEventListener('click', generateWorkout);
        setGoalBtn.addEventListener('click', setWeeklyGoal);
        searchWorkoutsEl.addEventListener('input', renderWorkouts);
        sortWorkoutsEl.addEventListener('change', renderWorkouts);
        chartTypeEl.addEventListener('change', updateChart);
        
        // Modal event listeners
        document.querySelector('.close').addEventListener('click', closeWorkoutModal);
        completeWorkoutBtn.addEventListener('click', completeWorkout);
    }
    
    function loadData() {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            const data = JSON.parse(savedData);
            workouts = data.workouts || [];
            weeklyGoal = data.weeklyGoal || 0;
            totalWorkoutTime = data.totalWorkoutTime || 0;
            workoutsCompleted = data.workoutsCompleted || 0;
            
            // Set goal input value
            weeklyGoalEl.value = weeklyGoal;
        }
    }
    
    function saveData() {
        const data = {
            workouts,
            weeklyGoal,
            totalWorkoutTime,
            workoutsCompleted
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    
    async function generateWorkout() {
        const fitnessGoal = fitnessGoalEl.value;
        const fitnessLevel = fitnessLevelEl.value;
        
        try {
            const response = await fetch(WORKOUT_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY', // Replace with actual API key
                    'X-RapidAPI-Host': 'ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com'
                },
                body: JSON.stringify({
                    fitnessGoal,
                    fitnessLevel
                })
            });
            
            if (!response.ok) {
                throw new Error('Workout generation failed');
            }
            
            const workoutPlan = await response.json();
            const today = new Date().toISOString().split('T')[0];
            
            const newWorkout = {
                id: Date.now(),
                date: today,
                goal: fitnessGoal,
                level: fitnessLevel,
                details: workoutPlan,
                duration: calculateWorkoutDuration(workoutPlan),
                completed: false
            };
            
            workouts.push(newWorkout);
            saveData();
            renderWorkouts();
            updateDashboard();
            updateChart();
            
            // Open workout details modal
            openWorkoutDetails(newWorkout);
        } catch (error) {
            console.error('Error generating workout:', error);
            alert('Failed to generate workout. Please try again.');
        }
    }
    
    function calculateWorkoutDuration(workoutPlan) {
        // This is a simplified duration calculation
        // In a real app, you'd parse the workout plan more precisely
        return workoutPlan.exercises ? workoutPlan.exercises.length * 10 : 30;
    }
    
    function renderWorkouts() {
        const searchTerm = searchWorkoutsEl.value.toLowerCase();
        const sortBy = sortWorkoutsEl.value;
        
        // Filter workouts
        let filteredWorkouts = workouts.filter(workout => 
            workout.goal.toLowerCase().includes(searchTerm) ||
            workout.level.toLowerCase().includes(searchTerm)
        );
        
        // Sort workouts
        filteredWorkouts.sort((a, b) => {
            if (sortBy === 'date') {
                return new Date(b.date) - new Date(a.date);
            } else if (sortBy === 'duration') {
                return b.duration - a.duration;
            } else if (sortBy === 'difficulty') {
                const difficultyOrder = {beginner: 1, intermediate: 2, advanced: 3};
                return difficultyOrder[b.level] - difficultyOrder[a.level];
            }
            return 0;
        });
        
        // Render to DOM
        workoutsListEl.innerHTML = '';
        
        if (filteredWorkouts.length === 0) {
            workoutsListEl.innerHTML = '<p class="no-results">No workouts found</p>';
            return;
        }
        
        filteredWorkouts.forEach(workout => {
            const workoutEl = document.createElement('div');
            workoutEl.className = `workout-item ${workout.completed ? 'completed' : ''}`;
            workoutEl.innerHTML = `
                <div class="workout-info">
                    <span class="workout-goal">${workout.goal} (${workout.level})</span>
                    <span class="workout-date">${workout.date}</span>
                </div>
                <span class="workout-duration">${workout.duration} mins</span>
            `;
            
            workoutEl.addEventListener('click', () => openWorkoutDetails(workout));
            
            workoutsListEl.appendChild(workoutEl);
        });
    }
    
    function openWorkoutDetails(workout) {
        const detailsTitle = document.getElementById('workoutDetailsTitle');
        const detailsContent = document.getElementById('workoutDetailsContent');
        
        detailsTitle.textContent = `${workout.goal} Workout (${workout.level})`;
        detailsContent.innerHTML = `
            <div class="workout-details">
                <p><strong>Date:</strong> ${workout.date}</p>
                <p><strong>Duration:</strong> ${workout.duration} mins</p>
                <h3>Exercises:</h3>
                <pre>${JSON.stringify(workout.details, null, 2)}</pre>
            </div>
        `;
        
        workoutDetailsModal.style.display = 'block';
    }
    
    function closeWorkoutModal() {
        workoutDetailsModal.style.display = 'none';
    }
    
    function completeWorkout() {
        const currentWorkout = workouts[workouts.length - 1];
        currentWorkout.completed = true;
        
        // Update progress metrics
        workoutsCompleted++;
        totalWorkoutTime += currentWorkout.duration;
        
        saveData();
        renderWorkouts();
        updateDashboard();
        updateChart();
        closeWorkoutModal();
    }
    
    function setWeeklyGoal() {
        const goal = parseFloat(weeklyGoalEl.value);
        
        if (isNaN(goal) || goal <= 0) {
            alert('Please enter a valid weekly workout goal');
            return;
        }
        
        weeklyGoal = goal;
        saveData();
        updateDashboard();
    }
    
    function updateDashboard() {
        // Update goal progress
        const progressPercentage = weeklyGoal > 0 
            ? Math.min((totalWorkoutTime / weeklyGoal) * 100, 100) 
            : 0;
        
        goalProgressEl.style.width = `${progressPercentage}%`;
        goalPercentageEl.textContent = `${Math.round(progressPercentage)}%`;
        goalTargetEl.textContent = `${weeklyGoal} mins`;
        
        // Update workout stats
        workoutsCompletedEl.textContent = workoutsCompleted;
        totalWorkoutTimeEl.textContent = `${totalWorkoutTime} mins`;
    }
    
    function updateChart() {
        const chartType = chartTypeEl.value;
        const ctx = document.getElementById('workoutChart').getContext('2d');
        
        // Destroy existing chart if it exists
        if (chartInstance) {
            chartInstance.destroy();
        }
        
        let chartData;
        let options;
        
        if (chartType === 'bar') {
            // Workout Intensity/Duration
            const labels = workouts.map(w => w.goal);
            const data = workouts.map(w => w.duration);
            
            chartData = {
                labels: labels,
                datasets: [{
                    label: 'Workout Duration (mins)',
                    data: data,
                    backgroundColor: generateColors(workouts.length)
                }]
            };
            
            options = {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Workout Intensity'
                    }
                }
            };
        } else if (chartType === 'pie') {
            // Workout Types
            const workoutTypeCount = workouts.reduce((acc, workout) => {
                acc[workout.goal] = (acc[workout.goal] || 0) + 1;
                return acc;
            }, {});
            
            chartData = {
                labels: Object.keys(workoutTypeCount),
                datasets: [{
                    data: Object.values(workoutTypeCount),
                    backgroundColor: generateColors(Object.keys(workoutTypeCount).length)
                }]
            };
            
            options = {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Workout Types'
                    }
                }
            };
        } else if (chartType === 'line') {
            // Progress Over Time
            const sortedWorkouts = [...workouts].sort((a, b) => new Date(a.date) - new Date(b.date));
            
            chartData = {
                labels: sortedWorkouts.map(w => w.date),
                datasets: [{
                    label: 'Workout Duration',
                    data: sortedWorkouts.map(w => w.duration),
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            };
            
            options = {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Workout Progress Over Time'
                    }
                }
            };
        }
        
        chartInstance = new Chart(ctx, {
            type: chartType,
            data: chartData,
            options: options
        });
    }
    
    function generateColors(count) {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const hue = (i * 137) % 360;
            colors.push(`hsl(${hue}, 70%, 60%)`);
        }
        return colors;
    }
});
