"""
Conference Data Module for GCP TechCon 2026
Contains event metadata, talk details, speaker profiles, and time table.
"""

from datetime import datetime

CONFERENCE_INFO = {
    "title": "GCP TechCon 2026",
    "subtitle": "The Premier 1-Day Google Cloud Technical Summit",
    "date": "2026-10-15",
    "date_display": "Thursday, October 15, 2026",
    "time": "08:30 AM - 05:30 PM PDT",
    "location": "Google Developer Center, San Francisco, CA",
    "address": "345 Spear St, San Francisco, CA 94105",
    "theme": "Google Cloud Technologies & Generative AI",
    "categories": {
        1: "AI & Machine Learning",
        2: "Cloud Infrastructure & DevOps"
    }
}

TALKS = [
    {
        "id": 1,
        "title": "Keynote: Building Next-Gen Generative AI Apps with Vertex AI & Gemini 1.5",
        "time": "09:00 AM - 09:40 AM",
        "category_id": 1,
        "category": "AI & Machine Learning",
        "room": "Main Auditorium (Hall A)",
        "description": "Explore the frontier of Enterprise Generative AI with Google Cloud Vertex AI and Gemini 1.5 Pro. Learn how multimodal context windows, agent builders, and grounding with enterprise search enable real-time intelligent workflow automation.",
        "speakers": [
            {
                "first_name": "Maya",
                "last_name": "Lin",
                "role": "Principal AI Architect",
                "company": "Google Cloud",
                "linkedin": "https://www.linkedin.com/in/mayalin-ai",
                "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
            },
            {
                "first_name": "Alex",
                "last_name": "Rivera",
                "role": "Head of AI Developer Relations",
                "company": "DeepMind",
                "linkedin": "https://www.linkedin.com/in/alexrivera-gcp",
                "avatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80"
            }
        ]
    },
    {
        "id": 2,
        "title": "Modern Serverless Architectures with Cloud Run and Eventarc",
        "time": "09:40 AM - 10:20 AM",
        "category_id": 2,
        "category": "Cloud Infrastructure & DevOps",
        "room": "Track B Auditorium",
        "description": "Dive deep into serverless compute on GCP. Learn how to combine Cloud Run's automatic scaling and sidecar containers with Eventarc's asynchronous event router to build decoupled, resilient microservice architectures.",
        "speakers": [
            {
                "first_name": "Marcus",
                "last_name": "Vance",
                "role": "Staff Cloud Engineer",
                "company": "SaaSified Inc.",
                "linkedin": "https://www.linkedin.com/in/marcusvance-cloud",
                "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80"
            }
        ]
    },
    {
        "id": 9,
        "title": "Building Autonomous Enterprise Agents with Vertex AI Agent Builder & LangChain",
        "time": "10:20 AM - 11:00 AM",
        "category_id": 1,
        "category": "AI & Machine Learning",
        "room": "Main Auditorium (Hall A)",
        "description": "Learn how to build multi-agent enterprise workflows using Vertex AI Agent Builder, Reasoning Engines, and LangChain on GCP. Features live code demonstrations of tool-calling, RAG evaluation, and human-in-the-loop validation.",
        "speakers": [
            {
                "first_name": "Nathan",
                "last_name": "Brooks",
                "role": "Principal AI Engineer",
                "company": "Agentic AI Labs",
                "linkedin": "https://www.linkedin.com/in/nathanbrooks-ai",
                "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80"
            },
            {
                "first_name": "Sophia",
                "last_name": "Martinez",
                "role": "Senior Developer Advocate",
                "company": "Google Cloud",
                "linkedin": "https://www.linkedin.com/in/sophiamartinez-gcp",
                "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80"
            }
        ]
    },
    {
        "id": 3,
        "title": "Enterprise Data Lakes & Real-Time Analytics with BigQuery Studio",
        "time": "11:15 AM - 11:55 AM",
        "category_id": 1,
        "category": "AI & Machine Learning",
        "room": "Main Auditorium (Hall A)",
        "description": "Discover BigQuery Studio's unified workspace for SQL, Python, and Spark. See live demonstrations of streaming ingest, automated vector search embeddings, and federated data governance with Dataplex.",
        "speakers": [
            {
                "first_name": "Priya",
                "last_name": "Sharma",
                "role": "Lead Data Platform Engineer",
                "company": "DataPulse Tech",
                "linkedin": "https://www.linkedin.com/in/priyasharma-data",
                "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80"
            },
            {
                "first_name": "David",
                "last_name": "Kim",
                "role": "Senior Analytics Specialist",
                "company": "Google Cloud",
                "linkedin": "https://www.linkedin.com/in/davidkim-analytics",
                "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
            }
        ]
    },
    {
        "id": 4,
        "title": "Zero-Trust Security & IAM Best Practices in Google Cloud",
        "time": "11:55 AM - 12:35 PM",
        "category_id": 2,
        "category": "Cloud Infrastructure & DevOps",
        "room": "Track B Auditorium",
        "description": "Protecting enterprise cloud workloads with GCP BeyondCorp principles. Covers Service Account short-lived credentials, Identity-Aware Proxy (IAP), Workload Identity Federation, and Security Command Center Premium.",
        "speakers": [
            {
                "first_name": "Elena",
                "last_name": "Rostova",
                "role": "Chief Information Security Officer",
                "company": "CyberGuard Cloud",
                "linkedin": "https://www.linkedin.com/in/elenarostova-security",
                "avatar": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80"
            }
        ]
    },
    {
        "id": 5,
        "title": "Mastering Kubernetes at Scale with GKE Autopilot & Mesh",
        "time": "01:35 PM - 02:15 PM",
        "category_id": 2,
        "category": "Cloud Infrastructure & DevOps",
        "room": "Main Auditorium (Hall A)",
        "description": "Learn production-grade strategies for container orchestration using GKE Autopilot. Covers multi-cluster traffic management with Anthos Service Mesh, cost optimization, auto-provisioning Node pools, and GitOps deployments.",
        "speakers": [
            {
                "first_name": "Thomas",
                "last_name": "Wright",
                "role": "Principal Site Reliability Engineer",
                "company": "KubeOps Labs",
                "linkedin": "https://www.linkedin.com/in/thomaswright-k8s",
                "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
            },
            {
                "first_name": "Sarah",
                "last_name": "Jenkins",
                "role": "Staff Solutions Architect",
                "company": "Google Cloud",
                "linkedin": "https://www.linkedin.com/in/sarahjenkins-gke",
                "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
            }
        ]
    },
    {
        "id": 6,
        "title": "Global Databases with Cloud Spanner: Multi-Region Consistency & Performance",
        "time": "02:15 PM - 02:55 PM",
        "category_id": 2,
        "category": "Cloud Infrastructure & DevOps",
        "room": "Track B Auditorium",
        "description": "How global financial and gaming applications achieve 99.999% availability and strong consistency across continents using Google Cloud Spanner's TrueTime technology and PostgreSQL interface support.",
        "speakers": [
            {
                "first_name": "Hiroshi",
                "last_name": "Tanaka",
                "role": "Distinguished Database Architect",
                "company": "FinGlobal Tech",
                "linkedin": "https://www.linkedin.com/in/hiroshitanaka-spanner",
                "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80"
            }
        ]
    },
    {
        "id": 10,
        "title": "Enterprise Multi-Cloud Observability & OpenTelemetry on GCP",
        "time": "02:55 PM - 03:35 PM",
        "category_id": 2,
        "category": "Cloud Infrastructure & DevOps",
        "room": "Track B Auditorium",
        "description": "Implement end-to-end distributed tracing, metrics, and log aggregation across hybrid and multi-cloud environments using Google Cloud Observability, OpenTelemetry collectors, and Cloud Monitoring dashboards.",
        "speakers": [
            {
                "first_name": "Vikram",
                "last_name": "Deshmukh",
                "role": "Head of Cloud Reliability",
                "company": "Observability Platform Tech",
                "linkedin": "https://www.linkedin.com/in/vikramdeshmukh-obs",
                "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80"
            }
        ]
    },
    {
        "id": 7,
        "title": "Fine-Tuning & Deploying Open LLMs (Gemma & Llama) on Cloud TPUs",
        "time": "03:50 PM - 04:30 PM",
        "category_id": 1,
        "category": "AI & Machine Learning",
        "room": "Main Auditorium (Hall A)",
        "description": "Practical hands-on session on fine-tuning open weights models using Google Cloud TPU v5p pods and XLA compilers. Learn inference optimization with vLLM, Low-Rank Adaptation (LoRA), and model monitoring.",
        "speakers": [
            {
                "first_name": "Samantha",
                "last_name": "Patel",
                "role": "AI Research Scientist",
                "company": "NeuralScale AI",
                "linkedin": "https://www.linkedin.com/in/samanthapatel-ml",
                "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
            },
            {
                "first_name": "Robert",
                "last_name": "Chen",
                "role": "Senior Cloud Infrastructure Engineer",
                "company": "OpenAI Partner Network",
                "linkedin": "https://www.linkedin.com/in/robertchen-tpu",
                "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80"
            }
        ]
    },
    {
        "id": 8,
        "title": "FinOps on GCP: Optimizing Cloud Spend with AI Insights & Cost Controls",
        "time": "04:30 PM - 05:10 PM",
        "category_id": 2,
        "category": "Cloud Infrastructure & DevOps",
        "room": "Track B Auditorium",
        "description": "Learn actionable methods to eliminate cloud waste, leverage Committed Use Discounts (CUDs), configure automated budget alerts, and utilize Cloud Billing recommendations powered by AI.",
        "speakers": [
            {
                "first_name": "Jordan",
                "last_name": "Taylor",
                "role": "Director of FinOps & Enterprise Cloud",
                "company": "CloudEconomy",
                "linkedin": "https://www.linkedin.com/in/jordantaylor-finops",
                "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80"
            }
        ]
    }
]

BREAKS = [
    {
        "title": "Registration & Morning Coffee",
        "time": "08:30 AM - 09:00 AM",
        "duration": "30 mins",
        "type": "coffee",
        "location": "Main Lobby & Registration Desk"
    },
    {
        "title": "Morning Coffee & Networking Break",
        "time": "11:00 AM - 11:15 AM",
        "duration": "15 mins",
        "type": "coffee",
        "location": "Exhibition Hall"
    },
    {
        "title": "Lunch Break & Networking Expo",
        "time": "12:35 PM - 01:35 PM",
        "duration": "60 mins",
        "is_lunch": True,
        "type": "lunch",
        "description": "Complimentary gourmet lunch, catering stations, and live networking with speakers and sponsors.",
        "location": "Dining Hall & Outdoor Patio"
    },
    {
        "title": "Afternoon Refreshment Break",
        "time": "03:35 PM - 03:50 PM",
        "duration": "15 mins",
        "type": "coffee",
        "location": "Exhibition Hall"
    },
    {
        "title": "Closing Remarks & Networking Reception",
        "time": "05:10 PM - 05:30 PM",
        "duration": "20 mins",
        "type": "reception",
        "location": "Main Auditorium & Lounge"
    }
]
