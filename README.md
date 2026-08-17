# Developer OS

Developer OS is a developer-focused workspace for organizing tools, workflows, resources, and project context in one place.

It brings together:
- project tracking
- developer tools and references
- project notes and metadata
- profile management
- dashboard analytics and search
- a clean workspace for building and shipping work

This project combines:
- Django + DRF backend
- React + Vite frontend
- JWT authentication
- SQLite for local development

## Project Goal

The goal of Developer OS is to help developers collect, manage, and access the tools, routines, references, and knowledge they need in a single ecosystem.

It is designed for:
- tracking active work
- centralizing key resources
- managing developer workflows
- keeping project context in one place
- accelerating day-to-day execution

## Tech Stack

Frontend
- React
- Vite
- CSS modules / custom CSS
- Chart.js + react-chartjs-2

Backend
- Django
- Django REST Framework
- Simple JWT
- SQLite

## Repository Structure

```text
Developer-os/
├── Backend/
│   ├── api/
│   ├── x/
│   ├── manage.py
│   ├── requirements.txt
│   └── db.sqlite3
├── Frontend/
│   ├── src/
│   ├── components/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── env/
├── .gitignore
├── README.md
└── .github/
```

## Quick Start

### 1) Backend

```bash
cd "D:\Django\master project\Developer-os\Backend"
..\env\Scripts\python.exe manage.py migrate
..\env\Scripts\python.exe manage.py runserver
```

### 2) Frontend

```bash
cd "D:\Django\master project\Developer-os\Frontend"
npm install
npm run dev
```

Then open the local Vite URL in the browser.

## Authentication

The app uses JWT authentication.

Default flow:
- login via `/api/token/`
- use access token on protected routes
- refresh via `/api/token/refresh/`

## Features

- project CRUD
- dashboard overview
- project search
- project statistics chart
- profile management
- authenticated API access
- responsive UI

## Roadmap

Planned next improvements:
- resource library
- developer workflow templates
- tagging and categories
- team collaboration
- bookmarks and favorites
- richer project analytics
- deployment and CI setup

## License

This project is currently for local development and learning purposes.
