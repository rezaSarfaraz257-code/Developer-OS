# Developer OS

<div align="center">
  <img src="https://img.shields.io/badge/Project-Developer%20OS-0A84FF?style=for-the-badge&logo=github" alt="Developer OS" />
  <img src="https://img.shields.io/badge/Stack-Django%20%2B%20React-5EEAD4?style=for-the-badge" alt="Stack" />
  <img src="https://img.shields.io/badge/Status-Prototype%20%2F%20MVP-34D399?style=for-the-badge" alt="Status" />
</div>

Developer OS is a digital workspace for developers to organize tools, workflows, resources, projects, and context in a single ecosystem.

It is designed to act like a developer operating system: a central place to capture what you use, how you work, and what matters to your product and engineering growth.

## Why this project matters

Modern developers work across many disconnected surfaces:
- GitHub and repositories
- project boards and issues
- docs and wikis
- bookmarks and tutorials
- local notes and ideas
- personal workflow systems

Developer OS brings those pieces together into one coherent digital environment.

## Core concept

Instead of scattered tools and repeated context switching, the platform creates a structured developer hub for:
- project tracking
- workflow management
- resource curation
- skill and tool inventory
- personal developer profile
- dashboard analytics and overview
- smarter daily execution

## Product vision

Developer OS aims to become the central nervous system for a developer's digital work life.

It gives developers:
- a clean overview of active work
- searchable, organized resources
- reusable workflows and routines
- a strong context layer for projects
- a place to keep valuable engineering knowledge near the work

## Feature highlights

- project creation and management
- profile and identity management
- dashboard metrics and overview
- searchable project list
- project metadata and categories
- developer resource organization
- workflow and task tracking
- secure JWT-based authentication
- responsive frontend experience

## Technical stack

### Frontend
- React
- Vite
- CSS and component-driven UI
- charts and analytics views

### Backend
- Django
- Django REST Framework
- Simple JWT
- SQLite for local development

## Repository layout

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
├── docs/
│   ├── README.md
│   ├── architecture.md
│   └── developer-workflows.md
├── env/
├── .gitignore
├── README.md
├── PROJECT.md
├── TODO.md
└── CONTRIBUTING.md
```

## Quick start

Before starting, copy `.env.example` to `.env` and set a long random
`DJANGO_SECRET_KEY`. GitHub integration additionally requires its OAuth values
and `GITHUB_TOKEN_ENCRYPTION_KEY`; generate the latter with the command shown
in `.env.example`. Never commit `.env`.

### 1) Backend

```bash
cd "D:\CPT\Don't Click me\Developer-os\Backend"
..\env\Scripts\python.exe manage.py migrate
..\env\Scripts\python.exe manage.py runserver
```

### 2) Frontend

```bash
cd "D:\CPT\Don't Click me\Developer-os\Frontend"
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Security and production

- Set `DEBUG=False`, a unique `DJANGO_SECRET_KEY`, precise `ALLOWED_HOSTS`,
  `CORS_ALLOWED_ORIGINS`, and `CSRF_TRUSTED_ORIGINS` before deployment.
- Serve the backend exclusively behind HTTPS. The production configuration
  enables HTTPS redirects, secure cookies, HSTS, clickjacking protection, and
  restrictive API response headers.
- GitHub OAuth tokens are encrypted in the database. Keep
  `GITHUB_TOKEN_ENCRYPTION_KEY` private and stable; changing it invalidates
  stored GitHub connections.
- `docker-compose.yml` is a local-development configuration. Use a managed
  database, a reverse proxy, and environment-managed secrets for production.

## Authentication

The application uses JWT authentication with a standard access/refresh flow:
- login via `/api/token/`
- use the access token for protected routes
- refresh via `/api/token/refresh/`

## Current direction

The product is currently focused on the MVP layer:
- project dashboard
- developer profile and metadata
- project search and overview
- core CRUD flows
- clean digital interface

## Roadmap

### Phase 1 — foundation
- project CRUD and dashboard
- user profiles
- search and filtering
- analytics summaries

### Phase 2 — knowledge layer
- resource library
- bookmarks and favorites
- notes and references
- tags and categories

### Phase 3 — workflow layer
- reusable developer workflow templates
- issue and task structures
- project status tracking
- richer automation

### Phase 4 — ecosystem layer
- team collaboration
- sharing and permissions
- scalable analytics
- personalized developer intelligence

## License

This project is currently intended for local development, experimentation, and learning.

## Summary

Developer OS is not just another CRUD app. It is an ecosystem for developers to manage the digital structure of their work and thinking.

It is a tool for building clarity, momentum, and operational intelligence in a developer's day-to-day life.
