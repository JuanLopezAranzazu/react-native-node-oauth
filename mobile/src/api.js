export const API_URL = process.env.EXPO_PUBLIC_API_URL;

let token = null;
let onUnauthorized = () => {};
export const setToken = (t) => (token = t);
export const setOnUnauthorized = (fn) => (onUnauthorized = fn);

async function request(path, { method = "GET", body } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) {
    onUnauthorized();
    throw new Error("Sesión vencida");
  }
  if (!res.ok)
    throw new Error(
      (await res.json().catch(() => ({}))).error || "Error de red",
    );
  return res.status === 204 ? null : res.json();
}

export const api = {
  me: () => request("/auth/me/profile"),
  listNotes: (q) => request(`/notes${q ? `?q=${encodeURIComponent(q)}` : ""}`),
  createNote: (data) => request("/notes", { method: "POST", body: data }),
  updateNote: (id, data) =>
    request(`/notes/${id}`, { method: "PUT", body: data }),
  deleteNote: (id) => request(`/notes/${id}`, { method: "DELETE" }),
};
