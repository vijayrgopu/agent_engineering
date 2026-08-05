# ⚡ GCP TechCon 2026 - 1-Day Technical Conference Application

> **The Premier 1-Day Google Cloud Technical Summit Website**  
> Powered by **Python 3 & Flask** on the backend and **Vanilla HTML5, CSS3 (Glassmorphism Dark Theme), and JavaScript** on the frontend.

---

## 📋 Table of Contents
1. [Overview & Highlights](#-overview--highlights)
2. [Project Directory Structure](#-project-directory-structure)
3. [Prerequisites & Installation](#-prerequisites--installation)
4. [Running the Application](#-running-the-application)
5. [Automated Test Suite](#-automated-test-suite)
6. [REST API Documentation](#-rest-api-documentation)
7. [Full Event Schedule & Timetable](#-full-event-schedule--timetable)
8. [Front-End Features & Design System](#-front-end-features--design-system)
9. [Customization & Maintenance Guide](#-customization--maintenance-guide)
10. [Docker Containerization & Production Deployment](#-docker-containerization--production-deployment)

---

## 🌟 Overview & Highlights

**GCP TechCon 2026** is a 1-day technical conference website designed to showcase Google Cloud Technologies, Enterprise AI, and Cloud Architecture.

### Core Capabilities:
- **10 Technical Talks**: Distributed across two specialized tracks:
  - **Category 1**: *AI & Machine Learning* (Vertex AI, Gemini 1.5, BigQuery Studio, Autonomous Agents, Cloud TPUs).
  - **Category 2**: *Cloud Infrastructure & DevOps* (Cloud Run, Zero-Trust IAM, GKE Autopilot, Cloud Spanner, OpenTelemetry, FinOps).
- **Speaker Constraints**: Every talk features **1 or 2 max speakers** with company credentials, roles, and verified **LinkedIn profile URLs**.
- **60-Minute Lunch Break**: Dedicated networking & lunch buffet slot (12:35 PM - 01:35 PM PDT).
- **Real-Time Client & Server Search**: Instant filtering by talk title, category, speaker name, or company.
- **Interactive Talk Modal**: Modal window powered by REST API endpoints for viewing full talk abstracts.
- **Glassmorphism Aesthetic**: Rich Google Cloud color scheme, smooth micro-animations, glowing background gradients, and responsive typography (`Outfit` & `Inter` fonts).

---

## 📁 Project Directory Structure

```
conference-website/
├── app.py                # Main Flask web application, routing, and REST API controllers
├── data.py               # Central data store (Conference info, 10 talks, break schedule, speakers)
├── test_app.py           # Automated unit test suite verifying all 10 requirements
├── requirements.txt      # Python dependencies (Flask >= 3.0, pytest >= 7.0)
├── Dockerfile            # Container configuration for Docker deployments
├── README.md             # Comprehensive technical documentation & user guide
├── static/
│   ├── css/
│   │   └── styles.css    # Complete design system, glassmorphism, animations, responsive layout
│   └── js/
│       └── main.js       # Real-time search/filter handlers, modal controller, DOM updates
└── templates/
    └── index.html        # Jinja2 template rendering the home page and timeline
```

---

## 🔧 Prerequisites & Installation

### System Requirements
- **Python**: Version 3.10 or higher (Tested on Python 3.14)
- **Pip**: Latest version of Python package installer
- **Git** (optional): For version control

### 1. Environment Setup

Clone or navigate to the project root directory:
```bash
cd /Users/vgopu/agy2-pprojects/conference-website
```

Create a isolated Python virtual environment:
```bash
python3 -m venv venv
```

Activate the virtual environment:
- **macOS / Linux**:
  ```bash
  source venv/bin/activate
  ```
- **Windows (Command Prompt / PowerShell)**:
  ```cmd
  venv\Scripts\activate
  ```

### 2. Install Dependencies

Install required Python packages listed in `requirements.txt`:
```bash
pip install -r requirements.txt
```

Installed core packages:
- `Flask` (3.1+): Lightweight Web Framework and WSGI server
- `pytest` (9.1+): Test runner for automated unit test execution

---

## 🚀 Running the Application

### Method 1: Python Direct Execution (Recommended for Development)
```bash
python3 app.py
```

### Method 2: Flask CLI
```bash
export FLASK_APP=app.py
export FLASK_ENV=development
flask run --host=127.0.0.1 --port=5000
```

Once started, open your web browser and navigate to:
👉 **`http://127.0.0.1:5000`**

---

## 🧪 Automated Test Suite

The project includes 10 automated unit tests in `test_app.py` validating data structure integrity, talk constraints, speaker schemas, 60-minute lunch duration, and API query endpoints.

### Running Tests

Execute pytest using your virtual environment Python binary:
```bash
./venv/bin/python3 -m pytest test_app.py -v
```

### Test Suite Summary:
1. `test_home_page_status`: Validates HTTP 200 response and essential home page strings.
2. `test_talk_count`: Verifies exactly 10 talks exist in the schedule dataset.
3. `test_speaker_constraints`: Asserts each talk has 1–2 speakers with `first_name`, `last_name`, and `linkedin`.
4. `test_talk_schema`: Checks existence of required fields (`id`, `title`, `category_id`, `description`, `time`, `room`).
5. `test_lunch_break_60_minutes`: Confirms the presence of a 60-minute lunch break in `BREAKS`.
6. `test_api_info`: Validates `/api/info` response data.
7. `test_api_talks_search_by_title`: Tests title search filtering via `?q=Vertex`.
8. `test_api_talks_search_by_speaker`: Tests speaker search filtering via `?q=Maya`.
9. `test_api_talks_filter_by_category`: Tests category filtering via `?category=1` and `?category=2`.
10. `test_api_single_talk_detail`: Validates `/api/talks/<id>` detail endpoint and 404 handler.

---

## 🔌 REST API Documentation

The backend exposes a JSON REST API for integration with frontend scripts or external clients.

### 1. Conference Info Endpoint
- **URL**: `GET /api/info`
- **Description**: Returns event metadata and aggregate statistics.
- **Sample Response**:
  ```json
  {
    "info": {
      "title": "GCP TechCon 2026",
      "date_display": "Thursday, October 15, 2026",
      "location": "Google Developer Center, San Francisco, CA"
    },
    "lunch_duration_minutes": 60,
    "status": "success",
    "total_talks": 10
  }
  ```

### 2. Search & Filter Talks Endpoint
- **URL**: `GET /api/talks`
- **Query Parameters**:
  - `q` *(optional)*: Search string matching title, speaker name, company, or category name.
  - `category` *(optional)*: Filter by Category ID (`1` or `2`).
- **Sample Request**:
  ```bash
  curl "http://127.0.0.1:5000/api/talks?q=Agent&category=1"
  ```
- **Sample Response**:
  ```json
  {
    "category_filter": "1",
    "count": 1,
    "query": "Agent",
    "status": "success",
    "talks": [
      {
        "category": "AI & Machine Learning",
        "category_id": 1,
        "description": "Learn how to build multi-agent enterprise workflows using Vertex AI Agent Builder...",
        "id": 9,
        "room": "Main Auditorium (Hall A)",
        "speakers": [...],
        "time": "10:20 AM - 11:00 AM",
        "title": "Building Autonomous Enterprise Agents with Vertex AI Agent Builder & LangChain"
      }
    ]
  }
  ```

### 3. Single Talk Detail Endpoint
- **URL**: `GET /api/talks/<int:talk_id>`
- **Description**: Returns detailed information for a specific talk.
- **Sample Request**:
  ```bash
  curl "http://127.0.0.1:5000/api/talks/1"
  ```

---

## 📅 Full Event Schedule & Timetable

| Time Slot | Session / Event | Track / Room | Speaker(s) |
| :--- | :--- | :--- | :--- |
| **08:30 AM - 09:00 AM** | ☕ Registration & Morning Coffee | Main Lobby | — |
| **09:00 AM - 09:40 AM** | **Talk 1**: Keynote: Building Next-Gen Generative AI Apps with Vertex AI & Gemini 1.5 | Category 1 (AI & ML)<br>*Main Auditorium* | Maya Lin & Alex Rivera |
| **09:40 AM - 10:20 AM** | **Talk 2**: Modern Serverless Architectures with Cloud Run and Eventarc | Category 2 (Infra & DevOps)<br>*Track B Auditorium* | Marcus Vance |
| **10:20 AM - 11:00 AM** | **Talk 9**: Building Autonomous Enterprise Agents with Vertex AI Agent Builder & LangChain | Category 1 (AI & ML)<br>*Main Auditorium* | Nathan Brooks & Sophia Martinez |
| **11:00 AM - 11:15 AM** | ☕ Morning Coffee & Networking Break (15m) | Exhibition Hall | — |
| **11:15 AM - 11:55 AM** | **Talk 3**: Enterprise Data Lakes & Real-Time Analytics with BigQuery Studio | Category 1 (AI & ML)<br>*Main Auditorium* | Priya Sharma & David Kim |
| **11:55 AM - 12:35 PM** | **Talk 4**: Zero-Trust Security & IAM Best Practices in Google Cloud | Category 2 (Infra & DevOps)<br>*Track B Auditorium* | Elena Rostova |
| **12:35 PM - 01:35 PM** | 🍽️ **LUNCH BREAK & NETWORKING EXPO (60 Mins)** | Dining Hall & Patio | All Attendees |
| **01:35 PM - 02:15 PM** | **Talk 5**: Mastering Kubernetes at Scale with GKE Autopilot & Mesh | Category 2 (Infra & DevOps)<br>*Main Auditorium* | Thomas Wright & Sarah Jenkins |
| **02:15 PM - 02:55 PM** | **Talk 6**: Global Databases with Cloud Spanner: Multi-Region Consistency & Performance | Category 2 (Infra & DevOps)<br>*Track B Auditorium* | Hiroshi Tanaka |
| **02:55 PM - 03:35 PM** | **Talk 10**: Enterprise Multi-Cloud Observability & OpenTelemetry on GCP | Category 2 (Infra & DevOps)<br>*Track B Auditorium* | Vikram Deshmukh |
| **03:35 PM - 03:50 PM** | 🍪 Afternoon Refreshment Break (15m) | Exhibition Hall | — |
| **03:50 PM - 04:30 PM** | **Talk 7**: Fine-Tuning & Deploying Open LLMs (Gemma & Llama) on Cloud TPUs | Category 1 (AI & ML)<br>*Main Auditorium* | Samantha Patel & Robert Chen |
| **04:30 PM - 05:10 PM** | **Talk 8**: FinOps on GCP: Optimizing Cloud Spend with AI Insights & Cost Controls | Category 2 (Infra & DevOps)<br>*Track B Auditorium* | Jordan Taylor |
| **05:10 PM - 05:30 PM** | 🥂 Closing Remarks & Networking Reception | Main Lounge | — |

---

## 🎨 Front-End Features & Design System

### Styling Principles (`static/css/styles.css`)
- **Theme Palette**: Deep dark theme (`#090d16`) with Google Cloud accents:
  - Google Blue: `#4285F4`
  - Google Green: `#34A853`
  - Google Yellow: `#FBBC04`
  - Google Red: `#EA4335`
- **Glassmorphism Containers**: Semitransparent card backdrops (`rgba(18, 24, 40, 0.7)`) with backdrop blur (`blur(16px)`).
- **Responsive Grid**: Flexbox and CSS Grid layout adapting seamlessly across Desktop, Tablet, and Mobile screens.

### JavaScript Functionality (`static/js/main.js`)
- **Real-Time Client Search**: Listens to input events on `#searchInput` and filters talk cards instantly without full page reload.
- **Category Filter Toggle**: Clicking Category 1 or Category 2 buttons updates visible cards and updates counter badges dynamically.
- **Asynchronous Modal Fetching**: Clicking a talk title fetches details asynchronously via `fetch('/api/talks/<id>')` and renders a clean modal dialog.

---

## 🛠️ Customization & Maintenance Guide

### 1. Adding a New Talk
To add an 11th talk, open `data.py` and append a new dict entry to `TALKS`:
```python
{
    "id": 11,
    "title": "Scaling Real-Time AI Inference with Cloud Functions",
    "time": "05:10 PM - 05:40 PM",
    "category_id": 1,
    "category": "AI & Machine Learning",
    "room": "Track B Auditorium",
    "description": "Abstract description here...",
    "speakers": [
        {
            "first_name": "Alice",
            "last_name": "Smith",
            "role": "Cloud Solutions Architect",
            "company": "Tech Corp",
            "linkedin": "https://www.linkedin.com/in/alicesmith",
            "avatar": "https://images.unsplash.com/photo-..."
        }
    ]
}
```

### 2. Updating Conference Metadata
Modify `CONFERENCE_INFO` in `data.py`:
```python
CONFERENCE_INFO = {
    "title": "GCP TechCon 2026",
    "date_display": "Thursday, October 15, 2026",
    "location": "Google Developer Center, San Francisco, CA",
}
```

---

## 🐳 Docker Containerization & Production Deployment

### 1. Build Docker Image
```bash
docker build -t gcp-techcon-2026 .
```

### 2. Run Docker Container
```bash
docker run -d -p 5000:5000 --name gcp-techcon-app gcp-techcon-2026
```

### 3. Deploying to Google Cloud Run (Production)
```bash
# Submit build to Google Artifact Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/gcp-techcon-2026

# Deploy to Cloud Run
gcloud run deploy gcp-techcon-2026 \
    --image gcr.io/YOUR_PROJECT_ID/gcp-techcon-2026 \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated
```

---

## 📄 License
Created for GCP TechCon 2026. Built with Python & Flask.
