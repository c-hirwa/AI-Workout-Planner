# AI Workout Planner

## Project Overview
A web application that generates personalized workout plans based on selected muscle groups using the Exercises API.

## Features
- Select target muscle group
- Optional difficulty level filtering
- Fetch up to 5 exercises for the selected muscle group
- Dark-themed, responsive design

## Prerequisites
- Web browser
- Internet connection
- API Ninjas API key

## Technology Stack
- HTML5
- CSS3
- JavaScript
- Exercises API by API Ninjas

## Setup and Installation

### Local Development
1. Clone the repository:
```bash
git clone https://github.com/c-hirwa/AI-Workout-Planner
cd AI-Workout-Planner
```

2. API Key Configuration
- Sign up at [API Ninjas](https://api-ninjas.com/)
- Replace the API key in `api.js`:
```javascript
this.apiKey = 'YOUR_API_NINJAS_KEY';
```

3. Open `index.html` in your web browser

## API Reference
- [Exercises API Documentation](https://api-ninjas.com/api/exercises)
- Available Muscle Groups:
  - Abdominals
  - Biceps
  - Triceps
  - Chest
  - Back
  - Shoulders
  - Legs
  - Calves
  - Forearms
  - Glutes
  - Hamstrings
  - Quadriceps

## Deployment Considerations
- Ensure secure API key management
- Use environment variables in production
- Implement rate limiting and error handling

## .gitignore Template
```
# Dependency directories
node_modules/

# API Keys and Sensitive Data
.env
*.key

# Local development files
.DS_Store
.vscode/
```

## Challenges and Solutions
1. API Key Security
   - Solution: Implement server-side proxy or use environment variables
2. Exercise Data Variability
   - Solution: Implement robust error handling and fallback mechanisms

## Future Improvements
- Add exercise filtering options
- Implement workout progression tracking
- Create user authentication
- Develop mobile-responsive design

## Credits
- API: [API Ninjas](https://api-ninjas.com/)
- Design Inspiration: Modern web design principles

## License
[Choose an appropriate license, e.g., MIT]

## Contact
Chris Hirwa
c.hirwa@alustudent.com
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
```