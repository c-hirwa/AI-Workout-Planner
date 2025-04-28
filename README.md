# AI Workout Planner

## Overview

AI Workout Planner is a lightweight fitness web app that allows users to generate personalized workouts by choosing a muscle group. The app fetches exercises from an external API securely and presents them in an easy-to-use format.

The project is deployed across two web servers, `web01` and `web02`, managed behind a load balancer to distribute incoming traffic and ensure high availability.
Web App: http://chrishirwa.tech/

## Features
- Generate workouts based on selected muscle groups
- Optional difficulty filter (Beginner, Intermediate, Advanced)
- View instructions and estimated calorie burn for each exercise
- Responsive design for both desktop and mobile
- Error handling for API and server issues

---

## Tech Stack
- HTML, CSS, JavaScript
- Node.js
- Docker
- Nginx (Load Balancer)
- External API: API Ninjas Exercises API

---

## Getting Started Locally

### Prerequisites
- Docker installed on your machine
- API key from [API Ninjas](https://api-ninjas.com/)

### Setup Steps
1. Clone the repository:
```bash
git clone https://github.com/c-hirwa/AI-Workout-Planner
cd ai-workout-planner
```

2. Set up your environment:
   - Create a `.env` file:
```
API_NINJAS_KEY=your_actual_api_key_here
```

3. Build and run locally with Docker:
```bash
docker build -t ai-workout-planner .
docker run -d -p 3000:3000 --env-file .env ai-workout-planner
```

4. Access the app locally at:
```
http://127.0.0.1:3000/index.html
```

---

## Deployment

### 1. Running the App on Web Servers (`web01` and `web02`)
- SSH into both servers.
- Run the following commands:
```bash
git clone https://github.com/your-username/ai-workout-planner.git
cd ai-workout-planner
docker build -t workout-planner .
docker run -d -p 3000:3000 --env-file .env workout-planner
```
- This will start the app inside a Docker container on port 3000.

### 2. Setting up the Load Balancer (`lb01`)
- SSH into the load balancer server.
- Install Nginx if it’s not installed:
```bash
sudo apt update
sudo apt install nginx
```
- Edit the default Nginx config:
```bash
sudo nano /etc/nginx/sites-available/default
```
- Add this (replace with your servers’ IPs):
```nginx
upstream workout_backend {
    server web01_private_ip:3000;
    server web02_private_ip:3000;
}

server {
    listen 80;

    location / {
        proxy_pass http://workout_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
- Save and restart Nginx:
```bash
sudo systemctl restart nginx
```

- Allow HTTP traffic if needed:
```bash
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## Testing the Deployment
- Open the load balancer’s public IP in a browser.
- Refresh a few times — traffic should be shared between `web01` and `web02`.
- You can also check logs on each server to see incoming requests.

---

## API Reference
- [Exercises API by API Ninjas](https://api-ninjas.com/api/exercises)

---

## Challenges and Lessons Learned
- Ensured API keys are hidden and not exposed to the frontend (currently improving backend proxy setup).
- Learned to configure Nginx for load balancing between two Dockerized web servers.
- Improved error handling in case of API failures or load distribution issues.

---

## Future Improvements
- Finalize backend proxy server to secure API calls completely.
- Add user login to save personal workout histories.
- Expand difficulty and filtering options for exercises.

---

## Demo Video
- http://loom.com/share/ea77fb2186114071bd913e29624c0d1e

---

## Credits
- API: [API Ninjas](https://api-ninjas.com/)

---

## Contact
Chris Hirwa
c.hirwa@alustudent.com
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
```