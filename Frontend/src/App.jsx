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
import { Colors } from "chart.js";
import HomePage from "./Pages/Home/HomePages";
import NavBar from "./components/NavBar";
import ExplorePage from "./Pages/Explore/Explore";
import WorkflowsPage from "./Pages/WorkFlows/WorkFlows";
import FavoritesPage from "./Pages/Favorites/Favorites";
import ResourcesPage from "./Pages/Resources/Resources";
import AuthPage from "./Pages/Auth/Auth";
import DashboardPage from "./Pages/Dashbourd/Dashboard";
import ProfilePage from "./Pages/Profile/Profile";
import Footer from "./components/Footer/Footer";

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
    description:
      "Ship secure and scalable APIs with a productive Python-first backend.",
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
    description:
      "Run consistent environments from development through production.",
    accent: "blue",
    rating: "4.7",
    descriptionLong:
      "Docker simplifies environment parity and deployment confidence. It allows developers to build once and run consistently across local, CI, and production environments.",
    features: [
      "Container isolation",
      "CI/CD portability",
      "Environment parity",
    ],
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
    features: [
      "Prompt-based workflows",
      "Product intelligence",
      "Automation support",
    ],
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
    title: "Production-ready React patterns",
    type: "Guide",
    category: "Frontend",
    description:
      "Patterns for clean state, architecture, and scalable UI systems.",
  },
  {
    id: 2,
    title: "Django REST API patterns",
    type: "Tutorial",
    category: "Backend",
    description:
      "Learn serializers, permissions, and robust API layers for real apps.",
  },
  {
    id: 3,
    title: "Engineering workflow templates",
    type: "Template",
    category: "Productivity",
    description:
      "Reusable setups for team rituals, issue flow, and development planning.",
  },
  {
    id: 4,
    title: "AI-assisted engineering playbook",
    type: "Playbook",
    category: "AI",
    description:
      "A practical resource for integrating AI into the product development loop.",
  },
];

const workflowLibrary = [
  {
    id: 1,
    title: "Full-stack delivery",
    level: "Intermediate",
    duration: "2-3 weeks",
    summary:
      "A practical flow for building product-ready full-stack features with clear ownership.",
    steps: ["Scope", "UI prototype", "API build", "QA", "Ship"],
  },
  {
    id: 2,
    title: "API-first product",
    level: "Advanced",
    duration: "1-2 weeks",
    summary:
      "Design the contract first, then ship stable interfaces with documentation and testing.",
    steps: ["Spec", "Model", "Build", "Document", "Validate"],
  },
  {
    id: 3,
    title: "CI/CD pipeline",
    level: "Intermediate",
    duration: "Daily",
    summary:
      "Keep releases reliable with fast checks and predictable deployment processes.",
    steps: ["Commit", "Test", "Build", "Deploy", "Monitor"],
  },
  {
    id: 4,
    title: "AI-assisted dev",
    level: "Beginner",
    duration: "Flexible",
    summary:
      "Use AI to accelerate exploration, coding, and product iteration without losing quality.",
    steps: ["Prompt", "Prototype", "Review", "Refine", "Ship"],
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
  const [page, setPage] = useState("home");
  const [selectedTool, setSelectedTool] = useState(tools[0]);
  const [selectedWorkflow, setSelectedWorkflow] = useState(workflowLibrary[0]);
  const [authMode, setAuthMode] = useState("login");
  const [favoriteTools, setFavoriteTools] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [resourceData, setResourceData] = useState(resourceLibrary);
  const [workflowData, setWorkflowData] = useState(workflowLibrary);
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("access")),
  );
  const [authError, setAuthError] = useState(null);

  const handleLogout = () => {
    clearAuth();
    setIsAuthenticated(false);
    setPage("auth");
  };

  useEffect(() => {
    try {
      const savedFavorites = JSON.parse(
        localStorage.getItem("favoriteTools") || "[]",
      );
      if (Array.isArray(savedFavorites)) {
        setFavoriteTools(savedFavorites);
      }
    } catch (error) {
      console.error("Failed to load favorite tools:", error);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setFavoriteTools((current) =>
        current.filter((item) => item.isLocalOnly ?? true),
      );
      return;
    }

    const loadFavorites = async () => {
      try {
        const response = await apiFetch("/favorites/");
        const data = await response.json();

        const normalized = Array.isArray(data)
          ? data.map((item) => ({
              id: item.id,
              name: item.tool_name,
              tag: item.tag || "General",
              description: item.description || "Saved tool",
              accent: "cyan",
              isLocalOnly: false,
            }))
          : [];

        setFavoriteTools(normalized);
      } catch (error) {
        console.error("Failed to load favorites from API:", error);
      }
    };

    loadFavorites();
  }, [isAuthenticated]);

  useEffect(() => {
    const loadLibraries = async () => {
      try {
        const [resourcesResponse, workflowsResponse] = await Promise.all([
          apiFetch("/resources/"),
          apiFetch("/workflows/"),
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
        console.error("Failed to load library data:", error);
      }
    };

    if (isAuthenticated) {
      loadLibraries();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem("favoriteTools", JSON.stringify(favoriteTools));
  }, [favoriteTools]);

  useEffect(() => {
    setIsAuthenticated(Boolean(localStorage.getItem("access")));
  }, [page]);

  useEffect(() => {
    const handler = (e) => {
      const msg = e?.detail?.message || "Authentication required";
      setAuthError(msg);
      setIsAuthenticated(false);
      setPage("auth");
    };

    window.addEventListener("auth:expired", handler);
    return () => window.removeEventListener("auth:expired", handler);
  }, [setPage]);

  const toggleFavorite = async (tool) => {
    if (!tool) {
      return;
    }

    const exists = favoriteTools.some(
      (item) => item.name === tool.name || item.id === tool.id,
    );

    if (isAuthenticated) {
      try {
        if (exists) {
          const match = favoriteTools.find(
            (item) => item.name === tool.name || item.id === tool.id,
          );
          if (match) {
            await apiFetch(`/favorites/`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ tool_name: tool.name }),
            });

            setFavoriteTools((current) =>
              current.filter(
                (item) => item.name !== tool.name && item.id !== tool.id,
              ),
            );
            return;
          }
        } else {
          const response = await apiFetch("/favorites/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
              accent: tool.accent || "cyan",
              isLocalOnly: false,
            },
          ]);
          return;
        }
      } catch (error) {
        console.error("Favorite sync failed:", error);
      }
    }

    setFavoriteTools((current) => {
      const alreadyFavorite = current.some(
        (item) => item.name === tool.name || item.id === tool.id,
      );
      if (alreadyFavorite) {
        return current.filter(
          (item) => item.name !== tool.name && item.id !== tool.id,
        );
      }
      return [...current, { ...tool, isLocalOnly: !isAuthenticated }];
    });
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setPage("dashboard");
  };

  const src = "./assets/devlogo.png";

  return (
    <div className="developeros-page">
      <NavBar
        setPage={setPage}
        isAuthenticated={isAuthenticated}
        handleLogout={handleLogout}
      />

      {page === "home" && (
        <HomePage
          setPage={setPage}
          setSelectedTool={setSelectedTool}
          favoriteTools={favoriteTools}
          toggleFavorite={toggleFavorite}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          tools={tools}
          workflows={workflowLibrary}
          resources={resourceLibrary}
          recommendations={recommendations}
        />
      )}
      {page === "explore" && (
        <ExplorePage
          setPage={setPage}
          setSelectedTool={setSelectedTool}
          favoriteTools={favoriteTools}
          toggleFavorite={toggleFavorite}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          tools={tools}
        />
      )}
      {page === "workflows" && (
        <WorkflowsPage
          setPage={setPage}
          setSelectedWorkflow={setSelectedWorkflow}
          workflowData={workflowData}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}
      {page === "favorites" && (
        <FavoritesPage
          setPage={setPage}
          favoriteTools={favoriteTools}
          toggleFavorite={toggleFavorite}
          setSelectedTool={setSelectedTool}
        />
      )}
      {page === "resources" && (
        <ResourcesPage
          setPage={setPage}
          resourceData={resourceData}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}
      {page === "auth" && (
        <AuthPage
          authMode={authMode}
          setAuthMode={setAuthMode}
          setPage={setPage}
          onAuthSuccess={handleAuthSuccess}
          loginWithBackend={loginWithBackend}
          registerWithBackend={registerWithBackend}
          initialError={authError}
        />
      )}
      {page === "dashboard" && (
        <DashboardPage
          setPage={setPage}
          isAuthenticated={isAuthenticated}
          favoriteTools={favoriteTools}
          toggleFavorite={toggleFavorite}
          setSelectedTool={setSelectedTool}
        />
      )}
      {page === "tool" && (
        <ToolDetailPage
          tool={selectedTool}
          setPage={setPage}
          toggleFavorite={toggleFavorite}
          favoriteTools={favoriteTools}
        />
      )}
      {page === "profile" && (
        <ProfilePage setPage={setPage} isAuthenticated={isAuthenticated} />
      )}
      {page === "workflow-detail" && (
        <WorkflowDetailPage workflow={selectedWorkflow} setPage={setPage} />
      )}

      <Footer />
    </div>
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
        <button
          type="button"
          className="ghost-button"
          onClick={() => setPage("workflows")}
        >
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
              <span key={step} className="workflow-step">
                {step}
              </span>
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
          <button
            type="button"
            className="primary-button full-width"
            onClick={() => setPage("dashboard")}
          >
            Save to workspace
          </button>
        </aside>
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
            {isFavorite ? "Remove from favorites" : "Save to workspace"}
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

const fallbackTools = tools;

export default App;
