# AI-Powered ATS Resume Builder

An intelligent, full-stack application designed to help job seekers create, customize, and optimize their resumes to pass Applicant Tracking Systems (ATS). This project leverages Next.js, AI, and Docker to provide a seamless, end-to-end resume building experience.

## 🚀 Key Features

1. **ATS Score Checker:** Evaluate your resume's compatibility against specific Job Descriptions (JD). The system provides actionable feedback and an ATS score to ensure maximum visibility to recruiters.
2. **Resume Upload & Parsing:** Easily upload your existing CV. The app intelligently extracts your data to pre-fill the ATS-friendly template.
3. **AI CV Creation & Customization:** Instantly tailor your resume based on a target Job Description. The AI rewrites your summary, highlights relevant skills, and frames your experience to perfectly align with the role you want.
4. **ATS-Optimized Templates:** Generates a clean, professional, single-column PDF resume specifically structured to be easily parsed by modern ATS software.

---

## 🛠️ Getting Started (Docker Setup)

This project is fully dockerized, meaning both the frontend UI and backend API run together seamlessly inside containers. You don't need to manually install Node.js or worry about browser dependencies for PDF generation.

### Prerequisites

- **Docker Desktop** installed and running on your machine.
- Verify Docker is running by opening your terminal and typing `docker info`.

### 1. Start the Project

Open a **PowerShell** terminal in the project root directory and run:

**Option A — Smart Script (Recommended):**

```powershell
.\start.ps1
```

This automatically detects whether images are already built and starts instantly without reinstalling packages. `npm install` / `pip install` only runs on the very first start or when you pass `-Build`.

| Command | What it does |
|---|---|
| `.\start.ps1` | ⚡ Start instantly — no reinstall (recommended for daily use) |
| `.\start.ps1 -Build` | 🔨 Rebuild — only when `package.json` or `requirements.txt` changes |
| `.\start.ps1 -Down` | 🛑 Stop the project |
| `.\start.ps1 -Logs` | 📋 Stream live logs |

**Option B — Manual Docker commands:**

```bash
# First time only (or after dependency changes):
docker-compose up --build -d

# Every other time — starts instantly without reinstalling:
docker-compose up -d
```

> ⚠️ **Do NOT use `--build` every time.** It forces Docker to re-run installs.
> Use `docker-compose up -d` for daily starts — it reuses the existing built image.

**Once started, open your web browser and navigate to:**
👉 **http://localhost:3000**

### 2. Stop the Project

When you are done and want to stop the application, run:

```bash
docker-compose down
```

This safely stops and removes the running containers.

### 3. View Application Logs

If you want to see the real-time server logs (for example, to debug API calls or AI generation), use:

```bash
docker-compose logs -f
```

Press `Ctrl+C` to exit the logs.

---

## 📝 How It Works

1. **Upload or Start Fresh:** Begin by uploading your current resume or filling out the base details manually.
2. **Add a Job Description:** Paste the JD of the role you are applying for.
3. **AI Optimization:** Let the AI analyze the gap between your resume and the JD. It will suggest structural edits, insert relevant keywords, and optimize your bullet points.
4. **Generate PDF:** Click download, and the system uses a headless browser to render and export your data into a flawless, ATS-compliant PDF.
