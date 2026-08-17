import { useState } from "react";
import './Login.css'

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const response = await fetch(
      "http://127.0.0.1:8000/api/token/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      onLogin();
    } else {
      setError("Username یا Password اشتباه است.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(event) =>
          setUsername(event.target.value)
        }
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) =>
          setPassword(event.target.value)
        }
      />

      <button type="submit">
        Login
      </button>

      {error && <p>{error}</p>}
    </form>
  );
}

export default Login;