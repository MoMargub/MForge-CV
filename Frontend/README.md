# ATS-Optimized Resume Generator

This project is a configurable, offline-first resume generator that compiles structured JSON resume content into a beautifully styled, professional, ATS-optimized Word Document (`.docx`). It uses a professional single-column layout with proper text margins, custom boundaries, and clear font styling.

## Project Structure

- [package.json](file:///Users/admin/Documents/DD/package.json) — Specifies metadata, scripts, and imports the `docx` library.
- [resume-data.json](file:///Users/admin/Documents/DD/resume-data.json) — The database containing your personal information, skill lists, experiences, achievements, and education. Edit this file to build your resume.
- [generate.js](file:///Users/admin/Documents/DD/generate.js) — The engine that loads the data, formats the layout blocks, processes markdown-style formatting, and compiles the `.docx` file.

---

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v16.0.0 or later is recommended).

### 1. Install Dependencies
Navigate to this directory in your terminal and run:
```bash
npm install
```

### 2. Generate the Resume
Run the start script to compile the default resume data:
```bash
npm start
```
By default, this will read from `./resume-data.json` and generate a Word document in the same folder named:
`JOHN_DOE_Resume_ATS_Optimized.docx` (derived from the `name` field in the JSON file).

---

## How to Customize Your Resume

To create your own resume, open [resume-data.json](file:///Users/admin/Documents/DD/resume-data.json) in your code editor and edit the fields.

### Markdown Bold Support (`**` emphasis)
The generator script supports **bold text markers**. Any text wrapped in double asterisks (`**`) will be rendered in bold font. This is highly useful for highlighting metrics, key skills, and impact-driven outcomes.
- **Example JSON:** `"highlights": ["Led frontend team to achieve a **40% load-time reduction** by adopting code-splitting."]`
- **Rendered Output:** "Led frontend team to achieve a **40% load-time reduction** by adopting code-splitting."

### JSON Schema Reference

1. **`personalInfo`** (Object):
   - `name` (String): Your full name (will be capitalized and centered).
   - `title` (String): Your professional headline (italicized, gray font, centered).
   - `email` (String): Your contact email address.
   - `phone` (String): Your phone number (with country code).
   - `linkedin` (Object): Contains `text` (visible text, e.g., `linkedin.com/in/username`) and `url` (the actual clickable hyperlink address, e.g., `https://linkedin.com/in/username`).

2. **`professionalSummary`** (String):
   - A single paragraph summarizing your career experience and value proposition. Supports bold markdown markers.

3. **`technicalSkills`** (Array of Objects):
   - Each item represents a row of skills grouped by a category:
     - `category` (String): Name of the skill group (e.g., `Frontend`, `Databases`).
     - `details` (String): List of skills inside this group (e.g., `React.js, Redux, HTML5`).

4. **`workExperience`** (Array of Objects):
   - List of your past professional roles:
     - `company` (String): The organization you worked for.
     - `role` (String): Your job title.
     - `location` (String): The city, country (e.g., `Ahmedabad, India`).
     - `dates` (String): The time range (e.g., `Apr 2025 – Present`).
     - `projects` (Array of Objects, *optional*): If your work is structured by specific client projects:
       - `name` (String): Name of the project.
       - `highlights` (Array of Strings): Key bullet points detailing tasks, tech stacks, and impact.
     - `highlights` (Array of Strings, *optional*): Direct bullet points if you do not want to divide the role into separate projects.

5. **`achievements`** (Array of Strings):
   - Bullet points outlining key highlights and career milestones. Supports bold markdown markers.

6. **`education`** (Array of Objects):
   - Your degrees and educational qualifications:
     - `degree` (String): Degree name (e.g., `Master of Science, Information Technology`).
     - `dates` (String): Duration (e.g., `2018 – 2020`).
     - `institution` (String): Name and location of school/university.

7. **`certifications`** (Array of Strings):
   - A list of professional certifications or credentials (e.g., `AWS Certified Solutions Architect – Associate`).

---

## Advanced CLI Usage

You can override the default input and output file paths using command-line arguments:

### Specify a Custom JSON Input File:
```bash
node generate.js --data=path/to/my-custom-data.json
```

### Specify a Custom DOCX Output Name:
```bash
node generate.js --out=path/to/John_Doe_Resume.docx
```

### Combine Both Options:
```bash
node generate.js --data=john-doe.json --out=John_Doe_Resume.docx
```
