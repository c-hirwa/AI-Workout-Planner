# AI Workout Planner

## Overview

AI Workout Planner is a lightweight fitness web app that allows users to generate personalized workouts by choosing a muscle group. The app fetches exercises from an external API securely and presents them in an easy-to-use format.

The project is deployed across two web servers, `web01` and `web02`, managed behind a load balancer to distribute incoming traffic and ensure high availability.

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
git clone https://github.com/your-username/ai-workout-planner.git
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
http://localhost:3000
```

---

## Deployment

### 1. Building and Running Docker Containers
On both `web01` and `web02` servers:
```bash
git clone https://github.com/your-username/ai-workout-planner.git
cd ai-workout-planner
docker build -t ai-workout-planner .
docker run -d -p 3000:3000 --env-file .env ai-workout-planner
```

### 2. Setting up the Load Balancer (`LB01`)
On the load balancer server (`lb01`):
1. Install Nginx:
```bash
sudo apt update
sudo apt install nginx
```

2. Configure Nginx to proxy requests to web01 and web02:
```bash
sudo nano /etc/nginx/sites-available/default
```

Paste the following configuration:
```nginx
upstream workout_app {
    server web01_private_ip:3000;
    server web02_private_ip:3000;
}

server {
    listen 80;

    location / {
        proxy_pass http://workout_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

3. Restart Nginx:
```bash
sudo systemctl restart nginx
```

4. Allow HTTP traffic if firewall is enabled:
```bash
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## Verifying the Deployment
- Access the application using the load balancer's public IP address.
- Refresh multiple times or simulate multiple users to confirm traffic is being distributed between `web01` and `web02`.
- Check logs on each server to ensure they are receiving requests.

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

## Credits
- API: [API Ninjas](https://api-ninjas.com/)
- UI Design: Inspired by minimal and clean web fitness apps.

---

## License
MIT License

---

## Contact
Chris Hirwa
c.hirwa@alustudent.com
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
```