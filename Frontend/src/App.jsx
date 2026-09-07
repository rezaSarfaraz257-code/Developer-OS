import { useEffect, useState } from "react";
import "./App.css";
import { API_URL, apiFetch, clearAuth, getAccessToken, revokeRefreshToken } from "./services/api";
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
import ProjectDetailPage from "./Project/ProjectDetail/ProjectDetail";
import TasksPage from "./Project/Tasks/Tasks";
import NotesPage from "./Project/Notes/Notes";
import ActivityPage from "./Project/Activity/Activity";
import TagsPage from "./Project/Tags/Tags";
import BookmarksPage from "./Project/Bookmarks/Bookmarks";
import AdvancedDashboardPage from "./Project/AdvancedDashboard/AdvancedDashboard";
import AIAssistantPage from "./Project/AIAssistant/AIAssistant";
import CollaborationPage from "./Project/Collaboration/Collaboration";
import ProductionPage from "./Project/Production/Production";
import OverviewPage from "./Project/Overview/Overview";
import SnippetsPage from "./Project/Snippets/Snippets";
import GitHubPage from "./Project/GitHub/GitHub";

/* Legacy category presets retained for future catalog filtering.
const categories = [
  "Frontend",
  "Backend",
  "DevOps",
  "AI",
  "Design",
  "Testing",
  "Data",
  "Security",
]; */

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

/* Legacy landing-page samples retained for a future seed command.
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
*/

const recommendations = [
  "React + Django stack",
  "AI coding productivity",
  "Production DevOps",
  "Architecture reviews",
];

/* Legacy dashboard samples retained for a future seed command.
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

*/
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
  sessionStorage.setItem("access", data.access);
  sessionStorage.setItem("refresh", data.refresh);
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
  const [selectedProject, setSelectedProject] = useState({
    id: 1,
    title: "Developer OS",
    description: "A digital workspace for tools, workflows, knowledge, and engineering context.",
    category: "Productivity",
    status: "In Progress",
    owner: "Developer",
    updated: "Today",
    tags: ["Frontend", "Backend", "AI"],
  });
  const [projectTab, setProjectTab] = useState("overview");
  const [projectTasks] = useState([
    { id: 1, title: "Refine workspace flow", status: "in review", description: "Improve project clarity and navigation." },
    { id: 2, title: "Add resource library", status: "todo", description: "Prepare reusable knowledge modules." },
    { id: 3, title: "Review AI assistant loop", status: "done", description: "Define smarter context prompts." },
  ]);
  const [projectNotes] = useState([
    { id: 1, title: "System idea", tag: "Product", content: "Keep the digital workspace focused on context, momentum, and reusable patterns." },
    { id: 2, title: "Engineering note", tag: "Architecture", content: "Frontend and backend should stay loosely coupled while sharing clear contracts." },
  ]);
  const [projectActivity] = useState([
    { id: 1, actor: { username: "Ava" }, verb: "Updated roadmap and milestones", created_at: "2026-09-05T10:00:00Z" },
    { id: 2, actor: { username: "Leo" }, verb: "Refined the dashboard experience", created_at: "2026-09-05T09:30:00Z" },
    { id: 3, actor: { username: "System" }, verb: "Initialized the developer ecosystem workspace", created_at: "2026-09-05T08:00:00Z" },
  ]);
  const [selectedWorkflow, setSelectedWorkflow] = useState(workflowLibrary[0]);
  const [authMode, setAuthMode] = useState("login");
  const [favoriteTools, setFavoriteTools] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [resourceData, setResourceData] = useState(resourceLibrary);
  const [workflowData, setWorkflowData] = useState(workflowLibrary);
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(getAccessToken()),
  );
  const [accountProfile, setAccountProfile] = useState(null);
  const [authError, setAuthError] = useState(null);

  const handleLogout = () => {
    revokeRefreshToken();
    clearAuth();
    setAccountProfile(null);
    setIsAuthenticated(false);
    setPage("auth");
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setAccountProfile(null);
      return undefined;
    }

    let isCurrent = true;
    const loadAccountProfile = async () => {
      try {
        const response = await apiFetch("/profile/");
        const data = await response.json();
        if (isCurrent) {
          setAccountProfile(data);
        }
      } catch (error) {
        console.error("Failed to load account profile:", error);
      }
    };

    loadAccountProfile();
    return () => {
      isCurrent = false;
    };
  }, [isAuthenticated]);

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
    const handler = (e) => {
      const msg = e?.detail?.message || "Authentication required";
      setAuthError(msg);
      setAccountProfile(null);
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

  return (
    <div className="developeros-page">
      <NavBar
        setPage={setPage}
        isAuthenticated={isAuthenticated}
        handleLogout={handleLogout}
        profile={accountProfile}
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
          setSelectedProject={setSelectedProject}
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
        <ProfilePage
          setPage={setPage}
          isAuthenticated={isAuthenticated}
          onProfileUpdate={setAccountProfile}
        />
      )}
      {page === "project-detail" && (
        <ProjectDetailPage
          setPage={setPage}
          project={selectedProject}
          activeTab={projectTab}
          setActiveTab={setProjectTab}
          tasks={projectTasks}
          notes={projectNotes}
          activity={projectActivity}
        />
      )}
      {page === "tasks" && <TasksPage setPage={setPage} tasks={[]} />}
      {page === "notes" && <NotesPage setPage={setPage} notes={[]} />}
      {page === "activity" && <ActivityPage setPage={setPage} activities={[]} />}
      {page === "tags" && <TagsPage setPage={setPage} tags={[]} />}
      {page === "bookmarks" && <BookmarksPage setPage={setPage} bookmarks={favoriteTools} />}
      {page === "advanced" && <AdvancedDashboardPage setPage={setPage} />}
      {page === "ai" && <AIAssistantPage setPage={setPage} />}
      {page === "collaboration" && <CollaborationPage setPage={setPage} />}
      {page === "production" && <ProductionPage setPage={setPage} />}
      {page === "overview" && <OverviewPage setPage={setPage} project={{}} />}
      {page === "snippets" && <SnippetsPage setPage={setPage} snippets={[]} />}
      {page === "github" && <GitHubPage setPage={setPage} repo={{}} />}
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

export default App;
