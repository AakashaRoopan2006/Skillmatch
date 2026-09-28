import os
from dotenv import load_dotenv
from typing import List, Optional

from fastapi import FastAPI
load_dotenv()
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg


app = FastAPI(title="Skillmatch Backend")


# Allow React frontend to connect with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "https://skillmatch-sandy.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Student profile data
class StudentProfile(BaseModel):
    name: Optional[str] = ""
    fullName: Optional[str] = ""
    username: Optional[str] = ""
    email: Optional[str] = ""
    age: Optional[str] = ""
    gender: Optional[str] = ""
    department: Optional[str] = "EEE"
    skills: List[str] = []
    interests: List[str] = []


# Temporary storage for development
DATABASE_URL = os.getenv("DATABASE_URL")


def get_connection():
    return psycopg.connect(DATABASE_URL)


# Test route
@app.get("/")
def home():
    return {
        "message": "Skillmatch backend is running successfully"
    }


# Save student profile
@app.post("/students")
def create_student(student: StudentProfile):
    student_data = student.model_dump()

    skills_text = ", ".join(student.skills)
    interests_text = ", ".join(student.interests)

    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO students
                (name, department, email, skills, interests)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (
                    student.name or student.fullName,
                    student.department,
                    student.email,
                    skills_text,
                    interests_text,
                ),
            )

    return {
        "message": "Student profile saved successfully",
        "student": student_data,
    }

# Get all students
@app.get("/students")
def get_students():
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT id, name, department, email, skills, interests
                FROM students
                ORDER BY id DESC
                """
            )

            rows = cursor.fetchall()

    students_data = []

    for row in rows:
        students_data.append({
            "id": row[0],
            "name": row[1],
            "department": row[2],
            "email": row[3],
            "skills": [
                skill.strip()
                for skill in (row[4] or "").split(",")
                if skill.strip()
            ],
            "interests": [
                interest.strip()
                for interest in (row[5] or "").split(",")
                if interest.strip()
            ],
        })

    return {"students": students_data}

# Job recommendations
@app.get("/jobs")
def get_jobs():
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT id, title, company, location, skills, icon
                FROM jobs
                ORDER BY id DESC
                """
            )

            rows = cursor.fetchall()

    jobs = []

    for row in rows:
        jobs.append({
            "id": row[0],
            "title": row[1],
            "company": row[2],
            "location": row[3],
            "skills": [
                skill.strip()
                for skill in (row[4] or "").split(",")
                if skill.strip()
            ],
            "icon": row[5] or "💼",
        })

    return jobs
# Save a job
@app.post("/saved-jobs")
def save_job(job: dict):
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO saved_jobs
                (job_id, title, company, location, skills, icon)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (
                    job.get("id"),
                    job.get("title"),
                    job.get("company"),
                    job.get("location"),
                    ", ".join(job.get("skills", [])),
                    job.get("icon", "💼"),
                ),
            )

    return {
        "message": "Job saved successfully",
        "job": job,
    }


# Get saved jobs
@app.get("/saved-jobs")
def get_saved_jobs():
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT id, job_id, title, company, location, skills, icon
                FROM saved_jobs
                ORDER BY id DESC
                """
            )

            rows = cursor.fetchall()

    saved_jobs = []

    for row in rows:
        saved_jobs.append({
            "saved_id": row[0],
            "id": row[1],
            "title": row[2],
            "company": row[3],
            "location": row[4],
            "skills": [
                skill.strip()
                for skill in (row[5] or "").split(",")
                if skill.strip()
            ],
            "icon": row[6] or "💼",
        })

    return saved_jobs


# Remove a saved job
@app.delete("/saved-jobs/{job_id}")
def delete_saved_job(job_id: int):
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                DELETE FROM saved_jobs
                WHERE job_id = %s
                """,
                (job_id,),
            )

    return {
        "message": "Job removed successfully"
    } 

# Add a new job
@app.post("/jobs")
def create_job(job: dict):
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO jobs
                (title, company, location, skills, icon)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
                """,
                (
                    job.get("title"),
                    job.get("company"),
                    job.get("location"),
                    ", ".join(job.get("skills", [])),
                    job.get("icon", "💼"),
                ),
            )

            job_id = cursor.fetchone()[0]

    return {
        "message": "Job posted successfully",
        "job": {
            **job,
            "id": job_id,
        },
    }