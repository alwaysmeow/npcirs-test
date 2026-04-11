const API_BASE = process.env.REACT_APP_API_BASE || "";

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "API error");
  }
  return response.json();
}

export async function fetchMovies(limit, offset) {
  const response = await fetch(`${API_BASE}/api/movies?limit=${limit}&offset=${offset}`);
  return handleResponse(response);
}

export async function fetchMoviesCount() {
  const response = await fetch(`${API_BASE}/api/movies/count`);
  return handleResponse(response);
}

export async function fetchMoviesForDropdown() {
  const response = await fetch(`${API_BASE}/api/movies?limit=1000&offset=0`);
  return handleResponse(response);
}

export async function fetchSessions() {
  const response = await fetch(`${API_BASE}/api/sessions`);
  return handleResponse(response);
}

export async function createSession(session) {
  const response = await fetch(`${API_BASE}/api/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(session),
  });
  return handleResponse(response);
}

export async function updateSession(id, session) {
  const response = await fetch(`${API_BASE}/api/sessions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(session),
  });
  return handleResponse(response);
}

export async function deleteSession(id) {
  const response = await fetch(`${API_BASE}/api/sessions/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
}
