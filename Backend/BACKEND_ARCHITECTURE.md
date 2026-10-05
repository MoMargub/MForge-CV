# Backend Architecture Guide

Welcome to the backend of the Resume Builder application. This backend is built using **FastAPI** and follows a highly scalable, "10x dev" Domain-Driven folder structure. 

This guide will help you understand what each file and folder does so you can easily navigate, maintain, and scale the application.

## 📂 Folder Structure Overview

```text
app/
├── api/                  # API routing and endpoint definitions
├── core/                 # Application-wide configurations and settings
├── crud/                 # Database manipulation layer (Create, Read, Update, Delete)
├── db/                   # Database connection and session management
├── models/               # SQLAlchemy ORM models (Database Tables)
├── schemas/              # Pydantic validation schemas (Data Transfer Objects)
├── services/             # Business Logic Layer
└── main.py               # The main entry point of the FastAPI application
```

---

## 📄 Detailed File Breakdown

### 1. `app/main.py`
**What it is:** The heart of the application.
**What it does:** 
- Initializes the FastAPI app instance.
- Configures global settings (like CORS middleware so your Next.js frontend can communicate with it).
- Sets up database tables.
- Includes the main API router that registers all your endpoints.

### 2. `app/api/` (Routing Layer)
This folder is dedicated entirely to defining API endpoints (the URLs your frontend calls). It contains:
- **`dependencies.py`**: Contains reusable FastAPI dependencies. For example, `get_db()` is defined here, which ensures every API request gets a secure database session and safely closes it when the request finishes.
- **`routes/resume.py`**: The specific endpoints for resume operations (e.g., `/api/resume/upload` and `/api/resume/score`).
- **`main.py`**: A master router that consolidates all individual route files (like `resume.py`, `auth.py`, `users.py`) into one single `api_router`.

### 3. `app/core/` (Configuration Layer)
- **`config.py`**: Uses `pydantic-settings` to securely load environment variables (like `DATABASE_URL`). By defining settings here, you get auto-completion and type safety across your entire application when accessing environment variables.

### 4. `app/db/` (Database Setup)
- **`database.py`**: Defines the SQLAlchemy `engine` and `SessionLocal`. This is where the actual connection to your PostgreSQL database is established. It also creates the `Base` class that all your database models will inherit from.

### 5. `app/models/` (Database Tables)
This folder defines how your data is stored in the database.
- **`resume.py`**: Contains the SQLAlchemy model `Resume`. It defines the columns (like `id`, `candidate_name`, `resume_data`) mapping directly to the `resumes` table in PostgreSQL.
> *Note: Models are STRICTLY for the database layer. They do not validate incoming JSON data.*

### 6. `app/schemas/` (Data Validation)
This folder defines what the data should look like when coming *in* from requests and going *out* to responses.
- **`resume.py`**: Contains Pydantic schemas like `ResumeCreate` and `ResumeResponse`. When a user sends JSON to an endpoint, FastAPI uses these schemas to validate that the JSON is perfectly formatted before your code even runs.

### 7. `app/crud/` (Database Operations)
This folder separates database queries from your API endpoints.
- **`base.py`**: A generic utility class containing reusable operations (Create, Read, Update, Delete) that work for *any* database model.
- **`crud_resume.py`**: Inherits from `base.py` and implements resume-specific database queries. 

### 8. `app/services/` (Business Logic)
This is where the heavy lifting happens. Keeping logic here keeps your API endpoints clean and easy to test.
- **`resume_service.py`**: Contains the complex algorithms, such as parsing uploaded PDF files or calculating the AI-based ATS score. The API endpoints simply call functions from this file and return the results.

---

## 🚀 How Data Flows (An Example Request)

When a user uploads a resume from the Next.js frontend, here is the journey the data takes:

1. **API Layer (`api/routes/resume.py`)**: The `/upload` endpoint receives the HTTP request and the file.
2. **Dependency Layer (`api/dependencies.py`)**: `get_db()` intercepts the request to open a database session.
3. **Service Layer (`services/resume_service.py`)**: The endpoint passes the file to the service layer to extract text and generate a preview.
4. **CRUD / Schema Layer (`schemas/` & `crud/`)**: If saving to the database, data is validated through Pydantic (schemas) and handed to the CRUD layer to insert into the PostgreSQL database.
5. **Response**: The API layer takes the result and sends a clean JSON response back to the frontend.
