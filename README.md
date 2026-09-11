````markdown
# 🎓 CampusConnect

> **Connect with your campus. Discover your opportunities.**

CampusConnect is an all-in-one student platform for Gujarat that helps students discover colleges, courses, admissions, documents, scholarships, hostels/PGs, campus information, transport, study resources, notices, and senior guidance.

## 🚀 Features

- 🏫 College Finder
- 📚 Course Finder
- 📝 Admission Guide
- 📄 Document Checklist
- 🏠 Hostel & PG Finder
- 📍 Smart Nearby Hostel Recommendations
- 🗺️ Google Maps Road Distance
- 🎓 Scholarships
- 🏛️ Government Schemes
- 🧭 Campus Guide
- 🚌 Transport Information
- 📖 Study Hub
- 👨‍🎓 Ask a Senior
- ❓ FAQ
- 🔔 Notices & Deadlines
- 👤 Student Dashboard
- 🛠️ Admin Panel
- 🚨 Report Incorrect Information
- 🌍 English, ગુજરાતી & हिंदी
- 🌙 Light & Dark Mode
- 📱 Fully Responsive Design

## 🗺️ Smart Hostel Distance

When a student selects a college, nearby hostels and PGs are recommended automatically.

Distances are based on **road routes using Google Maps Platform**, not simple straight-line distance.

The system avoids fake fallback values such as `0 km` or `0.01 km`.

If a route cannot be calculated, it displays:

```text
Distance unavailable
````

## 🏙️ Gujarat Coverage

CampusConnect is designed for Gujarat-wide coverage, with initial focus on:

* Ahmedabad
* Surat
* Rajkot
* Vadodara

For these locations, city and district are normalized together for simpler filtering.

## 📊 Data Quality

CampusConnect prioritizes reliable and maintainable data.

* No fake college or hostel records
* No fabricated phone numbers or websites
* Official sources preferred
* Source URLs maintained
* Duplicate records should be detected
* Invalid locations should be detected
* Incorrect information can be reported
* Admins can directly update incorrect records

## 📍 College Data Format

College CSV data follows this exact structure:

```csv
name,city,district,type,category,address,phone,website,source_url,source_name
```

Unknown information should remain blank rather than being guessed.

## 🚫 Intentional Exclusions

* College seat counts are not stored because intake changes frequently.
* Separate Compare functionality has been removed.
* A visible "Verified" badge is not shown in the student-facing UI.

## 🌐 Languages

* English — Default
* ગુજરાતી
* हिंदी

## 🛠️ Tech Stack

### Frontend

* React
* JavaScript / JSX
* HTML
* CSS

### Backend

* Python
* Django
* REST APIs

### Database

* Relational Database

### Maps

* Google Maps Platform
* Routes API
* Route Matrix

### Tools

* Git
* GitHub
* VS Code

## ⚙️ Installation

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```


Never commit API keys, passwords, or the real `.env` file to GitHub.

## 🧑‍💻 Author

**Jay Bhuva**

Computer Engineering Student

## ⭐ Vision

CampusConnect aims to become a complete student companion for Gujarat — from finding the right college and course to managing admission, scholarships, accommodation, campus life, and opportunities.

> **Connect with your campus. Discover your opportunities.**

```
```
