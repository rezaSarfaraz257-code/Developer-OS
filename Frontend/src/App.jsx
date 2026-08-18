import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import ProjectForm from "../components/ProjectForm";
import SearchBar from "../components/SearchBar";
import ProjectsChart from "../components/ProjectsChart";
import Profile from "../components/Profile";
import "./App.css";
import { apiFetch, clearAuth } from "./services/api";
import Login from "../components/Login";
import ToolsSection from "../components/ToolsSection";
import ResourceSection from "../components/ResourceSection";

const categories = [
  "Frontend",
  "Backend",
  "DevOps",
  "AI",
  "Design",
  "Testing",
  "Data",
  "Security",
];

const filterCategories = ["All", ...categories];

const stats = [
  { label: "Tools", value: "250+" },
  { label: "Workflows", value: "80+" },
  { label: "Resources", value: "120+" },
];

const tools = [
  {
    id: 1,
    name: "React",
    tag: "Frontend",
    description:
      "Build fast, scalable interfaces with a modern component-first workflow.",
    accent: "cyan",
    rating: "4.9",
    descriptionLong:
      "React is the foundation for component-driven UI architecture. It helps teams build clear interfaces, reusable modules, and responsive product experiences with strong developer ergonomics.",
    features: [
      "Component design system",
      "State orchestration",
      "Frontend performance optimization",
    ],
  },
  {
    id: 2,
    name: "Django",
    tag: "Backend",
    description: "Ship secure and scalable APIs with a productive Python-first backend.",
    accent: "green",
    rating: "4.8",
    descriptionLong:
      "Django gives you a robust backend foundation with batteries included: authentication, ORM, admin tools, and a clean structure for building production APIs and internal tools.",
    features: ["ORM layer", "Admin dashboard", "JWT auth and API patterns"],
  },
  {
    id: 3,
    name: "Docker",
    tag: "DevOps",
    description: "Run consistent environments from development through production.",
    accent: "blue",
    rating: "4.7",
    descriptionLong:
      "Docker simplifies environment parity and deployment confidence. It allows developers to build once and run consistently across local, CI, and production environments.",
    features: ["Container isolation", "CI/CD portability", "Environment parity"],
  },
  {
    id: 4,
    name: "OpenAI API",
    tag: "AI",
    description:
      "Bring workflow automation and intelligent assistance into your product.",
    accent: "purple",
    rating: "4.9",
    descriptionLong:
      "The OpenAI API unlocks rapid prototyping, task automation, AI copilots, and project support. It is a strong choice for knowledge-heavy developer workflows and product features.",
    features: ["Prompt-based workflows", "Product intelligence", "Automation support"],
  },
];

const workflows = [
  {
    title: "Full-stack delivery",
    steps: "Design → Build → Test → Ship",
    level: "Intermediate",
  },
  {
    title: "API-first product",
    steps: "Spec → Backend → Docs → Validate",
    level: "Advanced",
  },
  {
    title: "CI/CD pipeline",
    steps: "Commit → Test → Build → Deploy",
    level: "Intermediate",
  },
  {
    title: "AI-assisted dev",
    steps: "Prompt → Prototype → Review → Ship",
    level: "Beginner",
  },
];

const resources = [
  {
    title: "Production-ready React patterns",
    type: "Guide",
    description:
      "Patterns for clean state, architecture, and scalable UI systems.",
  },
  {
    title: "Django REST API patterns",
    type: "Tutorial",
    description:
      "Learn serializers, permissions, and robust API layers for real apps.",
  },
  {
    title: "Engineering workflow templates",
    type: "Template",
    description:
      "Reusable setups for team rituals, issue flow, and development planning.",
  },
];

const recommendations = [
  "React + Django stack",
  "AI coding productivity",
  "Production DevOps",
  "Architecture reviews",
];

const projects = [
  { name: "Frontend refactor", status: "In progress", progress: 72 },
  { name: "API performance boost", status: "Ready for review", progress: 88 },
  { name: "AI workflow notes", status: "Saved", progress: 52 },
];

const profileStats = [
  { label: "Saved tools", value: "18" },
  { label: "Workflows", value: "11" },
  { label: "Resources", value: "27" },
];

const API_URL = "http://127.0.0.1:8000/api";

const resourceLibrary = [
  {
    id: 1,
    title: 'Production-ready React patterns',
    type: 'Guide',
    category: 'Frontend',
    description: 'Patterns for clean state, architecture, and scalable UI systems.',
  },
  {
    id: 2,
    title: 'Django REST API patterns',
    type: 'Tutorial',
    category: 'Backend',
    description: 'Learn serializers, permissions, and robust API layers for real apps.',
  },
  {
    id: 3,
    title: 'Engineering workflow templates',
    type: 'Template',
    category: 'Productivity',
    description: 'Reusable setups for team rituals, issue flow, and development planning.',
  },
  {
    id: 4,
    title: 'AI-assisted engineering playbook',
    type: 'Playbook',
    category: 'AI',
    description: 'A practical resource for integrating AI into the product development loop.',
  },
];

const workflowLibrary = [
  {
    id: 1,
    title: 'Full-stack delivery',
    level: 'Intermediate',
    duration: '2-3 weeks',
    summary: 'A practical flow for building product-ready full-stack features with clear ownership.',
    steps: ['Scope', 'UI prototype', 'API build', 'QA', 'Ship'],
  },
  {
    id: 2,
    title: 'API-first product',
    level: 'Advanced',
    duration: '1-2 weeks',
    summary: 'Design the contract first, then ship stable interfaces with documentation and testing.',
    steps: ['Spec', 'Model', 'Build', 'Document', 'Validate'],
  },
  {
    id: 3,
    title: 'CI/CD pipeline',
    level: 'Intermediate',
    duration: 'Daily',
    summary: 'Keep releases reliable with fast checks and predictable deployment processes.',
    steps: ['Commit', 'Test', 'Build', 'Deploy', 'Monitor'],
  },
  {
    id: 4,
    title: 'AI-assisted dev',
    level: 'Beginner',
    duration: 'Flexible',
    summary: 'Use AI to accelerate exploration, coding, and product iteration without losing quality.',
    steps: ['Prompt', 'Prototype', 'Review', 'Refine', 'Ship'],
  },
];

async function loginWithBackend(username, password) {
  const response = await fetch(`${API_URL}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.detail || "Invalid username or password.");
  }

  const data = await response.json();
  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);
  return data;
}

async function registerWithBackend(payload) {
  const response = await fetch(`${API_URL}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    throw new Error(errorPayload.error || "Unable to create account.");
  }

  return response.json();
}

function App() {
  const [page, setPage] = useState('home');
  const [selectedTool, setSelectedTool] = useState(tools[0]);
  const [selectedWorkflow, setSelectedWorkflow] = useState(workflowLibrary[0]);
  const [authMode, setAuthMode] = useState('login');
  const [favoriteTools, setFavoriteTools] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [resourceData, setResourceData] = useState(resourceLibrary);
  const [workflowData, setWorkflowData] = useState(workflowLibrary);
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem('access')),
  );

  useEffect(() => {
    try {
      const savedFavorites = JSON.parse(localStorage.getItem('favoriteTools') || '[]');
      if (Array.isArray(savedFavorites)) {
        setFavoriteTools(savedFavorites);
      }
    } catch (error) {
      console.error('Failed to load favorite tools:', error);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setFavoriteTools((current) => current.filter((item) => item.isLocalOnly ?? true));
      return;
    }

    const loadFavorites = async () => {
      try {
        const response = await apiFetch('/favorites/');
        const data = await response.json();

        const normalized = Array.isArray(data)
          ? data.map((item) => ({
              id: item.id,
              name: item.tool_name,
              tag: item.tag || 'General',
              description: item.description || 'Saved tool',
              accent: 'cyan',
              isLocalOnly: false,
            }))
          : [];

        setFavoriteTools(normalized);
      } catch (error) {
        console.error('Failed to load favorites from API:', error);
      }
    };

    loadFavorites();
  }, [isAuthenticated]);

  useEffect(() => {
    const loadLibraries = async () => {
      try {
        const [resourcesResponse, workflowsResponse] = await Promise.all([
          apiFetch('/resources/'),
          apiFetch('/workflows/'),
        ]);

        const [resourcesPayload, workflowsPayload] = await Promise.all([
          resourcesResponse.json(),
          workflowsResponse.json(),
        ]);

        if (Array.isArray(resourcesPayload) && resourcesPayload.length > 0) {
          setResourceData(resourcesPayload);
        }

        if (Array.isArray(workflowsPayload) && workflowsPayload.length > 0) {
          setWorkflowData(workflowsPayload);
        }
      } catch (error) {
        console.error('Failed to load library data:', error);
      }
    };

    if (isAuthenticated) {
      loadLibraries();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('favoriteTools', JSON.stringify(favoriteTools));
  }, [favoriteTools]);

  useEffect(() => {
    setIsAuthenticated(Boolean(localStorage.getItem('access')));
  }, [page]);

  const toggleFavorite = async (tool) => {
    if (!tool) {
      return;
    }

    const exists = favoriteTools.some((item) => item.name === tool.name || item.id === tool.id);

    if (isAuthenticated) {
      try {
        if (exists) {
          const match = favoriteTools.find((item) => item.name === tool.name || item.id === tool.id);
          if (match) {
            await apiFetch(`/favorites/`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ tool_name: tool.name }),
            });

            setFavoriteTools((current) =>
              current.filter((item) => item.name !== tool.name && item.id !== tool.id),
            );
            return;
          }
        } else {
          const response = await apiFetch('/favorites/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tool_name: tool.name,
              tag: tool.tag,
              description: tool.description,
            }),
          });

          const saved = await response.json();
          setFavoriteTools((current) => [
            ...current,
            {
              id: saved.id,
              name: saved.tool_name,
              tag: saved.tag || tool.tag,
              description: saved.description || tool.description,
              accent: tool.accent || 'cyan',
              isLocalOnly: false,
            },
          ]);
          return;
        }
      } catch (error) {
        console.error('Favorite sync failed:', error);
      }
    }

    setFavoriteTools((current) => {
      const alreadyFavorite = current.some((item) => item.name === tool.name || item.id === tool.id);
      if (alreadyFavorite) {
        return current.filter((item) => item.name !== tool.name && item.id !== tool.id);
      }
      return [...current, { ...tool, isLocalOnly: !isAuthenticated }];
    });
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setPage('dashboard');
  };

  const handleLogout = () => {
    clearAuth();
    setIsAuthenticated(false);
    setPage('home');
  };

  return (
    <div className="developeros-page">
      <header className="topbar">
        <button
          type="button"
          className="brand-button"
          onClick={() => setPage('home')}
        >
          <div className="brand-wrap">
            <div className="brand-mark">D</div>
            <div>
              <span className="brand-kicker">Workspace</span>
              <strong>Developer OS</strong>
            </div>
          </div>
        </button>

        <nav className="main-nav" aria-label="Main navigation">
          <button type="button" onClick={() => setPage('explore')}>Explore</button>
          <button type="button" onClick={() => setPage('workflows')}>Workflows</button>
          <button type="button" onClick={() => setPage('favorites')}>Favorites</button>
          <button type="button" onClick={() => setPage('resources')}>Resources</button>
          <button type="button" onClick={() => setPage('dashboard')}>Dashboard</button>
          <button type="button" onClick={() => setPage('profile')}>Profile</button>
          <button type="button" onClick={() => setPage('auth')}>Login</button>
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <button type="button" className="ghost-button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button type="button" className="ghost-button" onClick={() => setPage('auth')}>
              Login
            </button>
          )}
          <button type="button" className="primary-button" onClick={() => setPage('explore')}>
            Get started
          </button>
        </div>
      </header>

      {page === 'home' && (
        <HomePage
          setPage={setPage}
          setSelectedTool={setSelectedTool}
          favoriteTools={favoriteTools}
          toggleFavorite={toggleFavorite}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}
      {page === 'explore' && (
        <ExplorePage
          setPage={setPage}
          setSelectedTool={setSelectedTool}
          favoriteTools={favoriteTools}
          toggleFavorite={toggleFavorite}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}
      {page === 'workflows' && <WorkflowsPage setPage={setPage} setSelectedWorkflow={setSelectedWorkflow} workflowData={workflowData} searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />}
      {page === 'favorites' && (
        <FavoritesPage
          setPage={setPage}
          favoriteTools={favoriteTools}
          toggleFavorite={toggleFavorite}
          setSelectedTool={setSelectedTool}
        />
      )}
      {page === 'resources' && <ResourcesPage setPage={setPage} resourceData={resourceData} searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />}
      {page === 'auth' && (
        <AuthPage
          authMode={authMode}
          setAuthMode={setAuthMode}
          setPage={setPage}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
      {page === 'dashboard' && <DashboardPage setPage={setPage} isAuthenticated={isAuthenticated} />}
      {page === 'tool' && <ToolDetailPage tool={selectedTool} setPage={setPage} toggleFavorite={toggleFavorite} favoriteTools={favoriteTools} />}
      {page === 'profile' && <ProfilePage setPage={setPage} isAuthenticated={isAuthenticated} />}
      {page === 'workflow-detail' && <WorkflowDetailPage workflow={selectedWorkflow} setPage={setPage} />}

      <footer className="site-footer">
        <div>
          <strong>Developer OS</strong>
          <p>Build with clarity. Stay in flow.</p>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          <button type="button" onClick={() => setPage('explore')}>Explore</button>
          <button type="button" onClick={() => setPage('workflows')}>Workflows</button>
          <button type="button" onClick={() => setPage('favorites')}>Favorites</button>
          <button type="button" onClick={() => setPage('resources')}>Resources</button>
          <button type="button" onClick={() => setPage('dashboard')}>Dashboard</button>
        </nav>
      </footer>
    </div>
  );
}

function HomePage({ setPage, setSelectedTool, favoriteTools, toggleFavorite, searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }) {
  return (
    <main className="page-shell">
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Developer ecosystem</span>
          <h1>Your developer ecosystem, organized.</h1>
          <p>
            Find the tools, workflows, and knowledge you need to build faster,
            think clearer, and ship with confidence.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="primary-button large"
              onClick={() => setPage('explore')}
            >
              Explore tools
            </button>
            <button
              type="button"
              className="secondary-button large"
              onClick={() => setPage('resources')}
            >
              Browse resources
            </button>
          </div>

          <div className="stat-row">
            {stats.map((item) => (
              <div key={item.label} className="stat-box">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-topline">
            <span>Live stack</span>
            <span className="panel-dot" />
          </div>

          <div className="stack-card">
            <div className="mini-label">Current setup</div>
            <h3>React + Django + Docker</h3>
            <ul>
              <li>Frontend architecture</li>
              <li>API-first workflows</li>
              <li>Ship-ready environment</li>
            </ul>
          </div>

          <div className="score-grid">
            <div>
              <strong>92%</strong>
              <span>Focus</span>
            </div>
            <div>
              <strong>{favoriteTools.length}</strong>
              <span>Saved</span>
            </div>
          </div>
        </div>
      </section>

      <section className="search-section" id="explore">
        <div className="search-header">
          <div>
            <span className="eyebrow">Discover</span>
            <h2>Search your ecosystem</h2>
          </div>
          <button
            type="button"
            className="ghost-button"
            onClick={() => setPage('explore')}
          >
            Advanced filters
          </button>
        </div>

        <div className="search-bar">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search tools, workflows, resources..."
            aria-label="Search"
          />
        </div>

        <div className="chip-row">
          {filterCategories.map((category) => (
            <button
              type="button"
              key={category}
              className={`chip ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory(category);
                setPage('explore');
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Featured</span>
            <h2>Top tools</h2>
          </div>
          <button
            type="button"
            className="section-link"
            onClick={() => setPage('explore')}
          >
            View all
          </button>
        </div>

        <div className="tool-grid">
          {tools.map((tool) => {
            const isFavorite = favoriteTools.some((item) => item.name === tool.name || item.id === tool.id);

            return (
              <article key={tool.id} className={`tool-card ${tool.accent}`}>
                <div className="tool-top">
                  <span className="tool-tag">{tool.tag}</span>
                  <button
                    type="button"
                    className={`icon-button ${isFavorite ? 'active-favorite' : ''}`}
                    aria-label={`Save ${tool.name}`}
                    onClick={() => toggleFavorite(tool)}
                  >
                    {isFavorite ? '♥' : '♡'}
                  </button>
                </div>
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
                <div className="tool-meta">
                  <span>Popular</span>
                  <span>{tool.rating}/5</span>
                </div>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => {
                    setSelectedTool(tool);
                    setPage('tool');
                  }}
                >
                  Open tool →
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="content-section" id="workflows">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Playbooks</span>
            <h2>Developer workflows</h2>
          </div>
          <button
            type="button"
            className="section-link"
            onClick={() => setPage('resources')}
          >
            Explore more
          </button>
        </div>

        <div className="workflow-grid">
          {workflows.map((workflow) => (
            <article key={workflow.title} className="workflow-card">
              <span className="workflow-level">{workflow.level}</span>
              <h3>{workflow.title}</h3>
              <p>{workflow.steps}</p>
              <button type="button" className="text-button">
                Open workflow →
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section" id="resources">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Library</span>
            <h2>Learning resources</h2>
          </div>
          <button
            type="button"
            className="section-link"
            onClick={() => setPage('resources')}
          >
            Browse all
          </button>
        </div>

        <div className="resource-grid">
          {resources.map((resource) => (
            <article key={resource.title} className="resource-card">
              <span className="resource-type">{resource.type}</span>
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
              <button type="button" className="text-button">
                Read now →
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="recommendation-panel" id="favorites">
        <div>
          <span className="eyebrow">Recommended</span>
          <h2>For your stack</h2>
        </div>

        <div className="recommendation-list">
          {recommendations.map((item) => (
            <div key={item} className="recommendation-item">
              <span className="dot" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="workspace-preview">
        <div className="workspace-copy">
          <span className="eyebrow">Workspace</span>
          <h2>Build your own developer OS.</h2>
          <p>
            Keep your tools, routes, resources, and active work in one place.
            Save what matters, track your process, and move faster without losing context.
          </p>
        </div>

        <div className="dashboard-preview">
          <div className="preview-header">
            <span>Overview</span>
            <span className="preview-pill">Live</span>
          </div>

          <div className="preview-stats">
            <div>
              <strong>12</strong>
              <span>Projects</span>
            </div>
            <div>
              <strong>{favoriteTools.length}</strong>
              <span>Favorites</span>
            </div>
            <div>
              <strong>4</strong>
              <span>Focus blocks</span>
            </div>
          </div>

          <div className="preview-list">
            <div className="preview-item">
              <span className="preview-icon green" />
              <div>
                <strong>Frontend refactor</strong>
                <small>In progress</small>
              </div>
            </div>
            <div className="preview-item">
              <span className="preview-icon blue" />
              <div>
                <strong>API performance</strong>
                <small>Ready for review</small>
              </div>
            </div>
            <div className="preview-item">
              <span className="preview-icon purple" />
              <div>
                <strong>AI workflow notes</strong>
                <small>Saved</small>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ExplorePage({ setPage, setSelectedTool, favoriteTools, toggleFavorite, searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }) {
  const filteredTools = tools.filter((tool) => {
    const matchesCategory = selectedCategory === 'All' || tool.tag === selectedCategory;
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      normalizedSearch.length === 0 ||
      tool.name.toLowerCase().includes(normalizedSearch) ||
      tool.description.toLowerCase().includes(normalizedSearch) ||
      tool.tag.toLowerCase().includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="page-panel">
      <div className="page-header-row">
        <div>
          <span className="eyebrow">Explore</span>
          <h2>Tool library</h2>
        </div>
        <button
          type="button"
          className="ghost-button"
          onClick={() => setPage('home')}
        >
          Back home
        </button>
      </div>

      <div className="filter-toolbar">
        {filterCategories.map((category) => (
          <button
            type="button"
            key={category}
            className={`chip ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="search-bar compact-search">
        <span className="search-icon">⌕</span>
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search tools..."
          aria-label="Search tools"
        />
      </div>

      {filteredTools.length === 0 ? (
        <div className="empty-box">No tools match the current search and category filters.</div>
      ) : (
        <div className="tool-grid explore-grid">
          {filteredTools.map((tool) => {
            const isFavorite = favoriteTools.some((item) => item.id === tool.id);

            return (
              <article key={tool.id} className={`tool-card ${tool.accent}`}>
                <div className="tool-top">
                  <span className="tool-tag">{tool.tag}</span>
                  <button
                    type="button"
                    className={`icon-button ${isFavorite ? 'active-favorite' : ''}`}
                    aria-label={`Save ${tool.name}`}
                    onClick={() => toggleFavorite(tool)}
                  >
                    {isFavorite ? '♥' : '♡'}
                  </button>
                </div>
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
                <div className="tool-meta">
                  <span>Popular</span>
                  <span>{tool.rating}/5</span>
                </div>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => {
                    setSelectedTool(tool);
                    setPage('tool');
                  }}
                >
                  View details →
                </button>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

function WorkflowsPage({ setPage, setSelectedWorkflow, workflowData, searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }) {
  const filteredWorkflows = workflowData.filter((workflow) => {
    const matchesCategory = selectedCategory === 'All' || workflow.level === selectedCategory || workflow.title.includes(selectedCategory);
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      normalizedSearch.length === 0 ||
      workflow.title.toLowerCase().includes(normalizedSearch) ||
      workflow.summary.toLowerCase().includes(normalizedSearch) ||
      workflow.steps.some((step) => step.toLowerCase().includes(normalizedSearch));

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="page-panel">
      <div className="page-header-row">
        <div>
          <span className="eyebrow">Workflows</span>
          <h2>Developer playbooks</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => setPage('home')}>
          Back home
        </button>
      </div>

      <div className="filter-toolbar">
        {filterCategories.map((category) => (
          <button
            type="button"
            key={category}
            className={`chip ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="search-bar compact-search">
        <span className="search-icon">⌕</span>
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search workflows..."
          aria-label="Search workflows"
        />
      </div>

      {filteredWorkflows.length === 0 ? (
        <div className="empty-box">No workflows match the current search and category filters.</div>
      ) : (
        <div className="workflow-library-grid">
          {filteredWorkflows.map((workflow) => (
            <article key={workflow.id} className="workflow-library-card">
              <div className="workflow-card-top">
                <span className="workflow-level">{workflow.level}</span>
                <span className="workflow-duration">{workflow.duration}</span>
              </div>
              <h3>{workflow.title}</h3>
              <p>{workflow.summary}</p>
              <div className="workflow-steps">
                {workflow.steps.map((step) => (
                  <span key={step} className="workflow-step">{step}</span>
                ))}
              </div>
              <button
                type="button"
                className="text-button"
                onClick={() => {
                  setSelectedWorkflow(workflow);
                  setPage('workflow-detail');
                }}
              >
                Open playbook →
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

function WorkflowDetailPage({ workflow, setPage }) {
  return (
    <main className="workflow-detail-page page-panel">
      <div className="page-header-row">
        <div>
          <span className="eyebrow">Workflow</span>
          <h2>{workflow.title}</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => setPage('workflows')}>
          Back to workflows
        </button>
      </div>

      <div className="workflow-detail-layout">
        <article className="detail-card workflow-detail-card">
          <div className="workflow-card-top">
            <span className="workflow-level">{workflow.level}</span>
            <span className="workflow-duration">{workflow.duration}</span>
          </div>
          <p>{workflow.summary}</p>
          <div className="workflow-steps detail-steps">
            {workflow.steps.map((step) => (
              <span key={step} className="workflow-step">{step}</span>
            ))}
          </div>
        </article>

        <aside className="detail-card workflow-side-panel">
          <h3>What this workflow gives you</h3>
          <ul>
            <li>Clear handoff between design and build</li>
            <li>Faster validation and decision flow</li>
            <li>Better continuity across team stages</li>
          </ul>
          <button type="button" className="primary-button full-width" onClick={() => setPage('dashboard')}>
            Save to workspace
          </button>
        </aside>
      </div>
    </main>
  );
}

function FavoritesPage({ setPage, favoriteTools, toggleFavorite, setSelectedTool }) {
  return (
    <main className="page-panel">
      <div className="page-header-row">
        <div>
          <span className="eyebrow">Favorites</span>
          <h2>Saved tools</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => setPage('explore')}>
          Explore tools
        </button>
      </div>

      {favoriteTools.length === 0 ? (
        <div className="empty-box">No favorite tools yet. Save a few from the tool library.</div>
      ) : (
        <div className="tool-grid explore-grid">
          {favoriteTools.map((tool) => (
            <article key={tool.id} className={`tool-card ${tool.accent}`}>
              <div className="tool-top">
                <span className="tool-tag">{tool.tag}</span>
                <button
                  type="button"
                  className="icon-button active-favorite"
                  onClick={() => toggleFavorite(tool)}
                >
                  ♥
                </button>
              </div>
              <h3>{tool.name}</h3>
              <p>{tool.description}</p>
              <button
                type="button"
                className="text-button"
                onClick={() => {
                  setSelectedTool(tool);
                  setPage('tool');
                }}
              >
                View details →
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

function ResourcesPage({ setPage, resourceData, searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }) {
  const filteredResources = resourceData.filter((resource) => {
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory || resource.type === selectedCategory;
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      normalizedSearch.length === 0 ||
      resource.title.toLowerCase().includes(normalizedSearch) ||
      resource.description.toLowerCase().includes(normalizedSearch) ||
      resource.category.toLowerCase().includes(normalizedSearch) ||
      resource.type.toLowerCase().includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="page-panel">
      <div className="page-header-row">
        <div>
          <span className="eyebrow">Resources</span>
          <h2>Developer library</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => setPage('home')}>
          Back home
        </button>
      </div>

      <div className="filter-toolbar">
        {filterCategories.map((category) => (
          <button
            type="button"
            key={category}
            className={`chip ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="search-bar compact-search">
        <span className="search-icon">⌕</span>
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search resources..."
          aria-label="Search resources"
        />
      </div>

      {filteredResources.length === 0 ? (
        <div className="empty-box">No resources match the current search and category filters.</div>
      ) : (
        <div className="resource-grid full-resource-grid">
          {filteredResources.map((resource) => (
            <article key={resource.id} className="resource-card">
              <span className="resource-type">{resource.type}</span>
              <h3>{resource.title}</h3>
              <small className="resource-category">{resource.category}</small>
              <p>{resource.description}</p>
              <button type="button" className="text-button">
                Open resource →
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

function AuthPage({ authMode, setAuthMode, setPage, onAuthSuccess }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (authMode === "register") {
        const [firstName, ...lastNameParts] = (form.fullName || "").trim().split(/\s+/);
        const payload = {
          username: form.username,
          email: form.email,
          password: form.password,
          first_name: firstName || "",
          last_name: lastNameParts.join(" ") || "",
        };

        await registerWithBackend(payload);
        await loginWithBackend(form.username, form.password);
      } else {
        await loginWithBackend(form.username, form.password);
      }

      onAuthSuccess();
    } catch (submitError) {
      setError(submitError.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <div className="auth-intro">
          <span className="eyebrow">Developer access</span>
          <h2>Access your workspace</h2>
          <p>
            Keep your tools, projects, and learning paths in a single place designed for modern developers.
          </p>
          <ul>
            <li>Track progress</li>
            <li>Save key resources</li>
            <li>Build faster with focus</li>
          </ul>
        </div>

        <div className="auth-card">
          <div className="auth-tabs">
            <button
              type="button"
              className={authMode === "login" ? "active" : ""}
              onClick={() => setAuthMode("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={authMode === "register" ? "active" : ""}
              onClick={() => setAuthMode("register")}
            >
              Register
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {authMode === "register" && (
              <>
                <label>
                  Username
                  <input
                    type="text"
                    name="username"
                    placeholder="developer123"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Full name
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Alex Morgan"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                  />
                </label>
              </>
            )}

            {authMode === "login" && (
              <label>
                Username
                <input
                  type="text"
                  name="username"
                  placeholder="developer123"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </label>
            )}

            <label>
              Email
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={handleChange}
                required={authMode === "register"}
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </label>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="primary-button full-width" disabled={loading}>
              {loading
                ? "Please wait..."
                : authMode === "login"
                  ? "Login to workspace"
                  : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

function DashboardPage({ setPage, isAuthenticated }) {
  const [projectsData, setProjectsData] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [justUpdatedId, setJustUpdatedId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setProjectsData([]);
      return;
    }

    const loadDashboard = async () => {
      setLoading(true);
      try {
        const response = await apiFetch("/projects/");
        const data = await response.json();
        setProjectsData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        clearAuth();
        setPage("auth");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [isAuthenticated, setPage]);

  const handleProjectCreated = (newProject) => {
    setProjectsData((current) => [...current, newProject]);
  };

  const handleProjectUpdated = (updatedProject) => {
    setProjectsData((current) =>
      current.map((project) =>
        project.id === updatedProject.id ? updatedProject : project,
      ),
    );
    setEditingProject(null);
    setJustUpdatedId(updatedProject.id);
  };

  const handleProjectDeleted = (projectId) => {
    setProjectsData((current) =>
      current.filter((project) => project.id !== projectId),
    );
  };

  const totalProjects = projectsData.length;
  const completedProjects = projectsData.filter((item) => item.completed).length;
  const activeProjects = Math.max(0, totalProjects - completedProjects);

  if (!isAuthenticated) {
    return (
      <main className="dashboard-page auth-lock">
        <div className="auth-required-box">
          <span className="eyebrow">Access required</span>
          <h2>Please login to view your dashboard</h2>
          <button type="button" className="primary-button" onClick={() => setPage("auth")}>
            Go to login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <aside className="sidebar-panel">
        <div className="brand-wrap small-brand">
          <div className="brand-mark">D</div>
          <div>
            <span className="brand-kicker">Workspace</span>
            <strong>Developer OS</strong>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button type="button" className="nav-item active">Overview</button>
          <button type="button" className="nav-item">Projects</button>
          <button type="button" className="nav-item">Saved tools</button>
          <button type="button" className="nav-item" onClick={() => setPage("profile")}>Profile</button>
        </nav>

        <div className="sidebar-card">
          <p>Quick status</p>
          <strong>{totalProjects} active items</strong>
        </div>
      </aside>

      <div className="dashboard-main">
        <div className="dashboard-header-row">
          <div>
            <span className="eyebrow">Dashboard</span>
            <h2>Project workspace</h2>
          </div>
          <button
            type="button"
            className="secondary-button"
            onClick={() => setPage("home")}
          >
            Home
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card accent">
            <span>Total Projects</span>
            <strong>{totalProjects}</strong>
          </div>
          <div className="stat-card">
            <span>Active</span>
            <strong>{activeProjects}</strong>
          </div>
          <div className="stat-card">
            <span>Completed</span>
            <strong>{completedProjects}</strong>
          </div>
        </div>

        <div className="project-form-panel">
          <ProjectForm
            project={editingProject}
            onProjectCreated={handleProjectCreated}
            onProjectUpdated={handleProjectUpdated}
            onCancel={() => setEditingProject(null)}
          />
        </div>

        <div className="project-board">
          {loading ? (
            <div className="loading-box">Loading projects...</div>
          ) : projectsData.length === 0 ? (
            <div className="empty-box">No projects yet. Create your first project.</div>
          ) : (
            projectsData.map((project) => (
              <ProjectCard
                key={project.id ?? project.title}
                project={project}
                onEdit={setEditingProject}
                onDelete={handleProjectDeleted}
                updated={justUpdatedId === project.id}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}

function ToolDetailPage({ tool, setPage, toggleFavorite, favoriteTools }) {
  const isFavorite = favoriteTools.some((item) => item.id === tool.id);

  return (
    <main className="tool-detail-page">
      <button
        type="button"
        className="ghost-button back-button"
        onClick={() => setPage("explore")}
      >
        ← Back to explore
      </button>

      <div className="detail-layout">
        <article className="detail-card main-detail">
          <span className="tool-tag detail-tag">{tool.tag}</span>
          <h2>{tool.name}</h2>
          <p>{tool.descriptionLong}</p>

          <div className="feature-list">
            {tool.features.map((feature) => (
              <div key={feature} className="feature-item">
                <span className="dot" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </article>

        <aside className="detail-card sidebar-detail">
          <div className="mini-panel">
            <span>Rating</span>
            <strong>{tool.rating}/5</strong>
          </div>
          <div className="mini-panel">
            <span>Best for</span>
            <strong>{tool.tag}</strong>
          </div>
          <button
            type="button"
            className="primary-button full-width"
            onClick={() => toggleFavorite(tool)}
          >
            {isFavorite ? 'Remove from favorites' : 'Save to workspace'}
          </button>
          <button
            type="button"
            className="secondary-button full-width"
            onClick={() => setPage("dashboard")}
          >
            View dashboard
          </button>
        </aside>
      </div>
    </main>
  );
}

function ProfilePage({ setPage, isAuthenticated }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    full_name: "",
    bio: "",
    github: "",
    linkedin: "",
    website: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setProfile(null);
      setIsEditing(false);
      return;
    }

    const loadProfile = async () => {
      setLoading(true);
      try {
        const response = await apiFetch("/profile/");
        const data = await response.json();
        setProfile(data);
        setForm({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          full_name: data.full_name || "",
          bio: data.bio || "",
          github: data.github || "",
          linkedin: data.linkedin || "",
          website: data.website || "",
        });
      } catch (error) {
        console.error(error);
        clearAuth();
        setPage("auth");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, setPage]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);

    try {
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        full_name: form.full_name,
        bio: form.bio,
        github: form.github,
        linkedin: form.linkedin,
        website: form.website,
      };

      const response = await apiFetch("/profile/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setProfile(data);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert(error.message || "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="profile-page auth-lock">
        <div className="auth-required-box">
          <span className="eyebrow">Access required</span>
          <h2>Please login to view your profile</h2>
          <button type="button" className="primary-button" onClick={() => setPage("auth")}>
            Go to login
          </button>
        </div>
      </main>
    );
  }

  const profileName = profile?.full_name || [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Developer";
  const initials = profileName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "D";

  return (
    <main className="profile-page">
      <div className="profile-header-row">
        <div>
          <span className="eyebrow">Profile</span>
          <h2>Developer profile</h2>
        </div>
        <div className="profile-actions">
          <button type="button" className="ghost-button" onClick={() => setPage("dashboard")}>
            Dashboard
          </button>
          <button type="button" className="primary-button" onClick={() => setIsEditing((current) => !current)}>
            {isEditing ? "Cancel" : "Edit profile"}
          </button>
        </div>
      </div>

      <div className="profile-layout">
        <section className="profile-card-panel">
          <div className="profile-avatar">{initials}</div>
          <h3>{profileName}</h3>
          <p>{profile?.bio || "Full-stack developer focused on product UX and backend architecture."}</p>

          <div className="profile-meta">
            {profile?.github && <span>GitHub</span>}
            {profile?.linkedin && <span>LinkedIn</span>}
            {profile?.website && <span>Website</span>}
          </div>
        </section>

        <section className="profile-summary">
          {loading ? (
            <div className="loading-box">Loading profile...</div>
          ) : isEditing ? (
            <div className="profile-editor">
              <label>
                Full name
                <input name="full_name" value={form.full_name} onChange={handleChange} />
              </label>
              <label>
                First name
                <input name="first_name" value={form.first_name} onChange={handleChange} />
              </label>
              <label>
                Last name
                <input name="last_name" value={form.last_name} onChange={handleChange} />
              </label>
              <label>
                Email
                <input name="email" type="email" value={form.email} onChange={handleChange} />
              </label>
              <label>
                Bio
                <textarea name="bio" value={form.bio} onChange={handleChange} rows="4" />
              </label>
              <label>
                GitHub
                <input name="github" value={form.github} onChange={handleChange} />
              </label>
              <label>
                LinkedIn
                <input name="linkedin" value={form.linkedin} onChange={handleChange} />
              </label>
              <label>
                Website
                <input name="website" value={form.website} onChange={handleChange} />
              </label>

              <button type="button" className="primary-button" onClick={handleSaveProfile} disabled={saving}>
                {saving ? "Saving..." : "Save profile"}
              </button>
            </div>
          ) : (
            <>
              <div className="stats-grid compact-grid">
                <div className="stat-card">
                  <span>Username</span>
                  <strong>{profile?.username || "-"}</strong>
                </div>
                <div className="stat-card">
                  <span>Email</span>
                  <strong>{profile?.email || "-"}</strong>
                </div>
                <div className="stat-card">
                  <span>Website</span>
                  <strong>{profile?.website ? "Linked" : "-"}</strong>
                </div>
              </div>

              <div className="profile-bio">
                <h3>About</h3>
                <p>
                  {profile?.bio ||
                    "I build product-focused interfaces and backend systems that scale with a team. My stack is centered around React, Django, and AI-native developer workflows."}
                </p>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
