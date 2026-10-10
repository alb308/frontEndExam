async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(`/api${path}`, {
    method,
    credentials: 'same-origin',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || 'Qualcosa è andato storto.');
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  me: () => request('/auth/me'),
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  logout: () => request('/auth/logout', { method: 'POST' }),

  cans: () => request('/cans'),
  can: (id) => request(`/cans/${id}`),
  vote: (id, score) => request(`/cans/${id}/vote`, { method: 'PUT', body: { score } }),
  unvote: (id) => request(`/cans/${id}/vote`, { method: 'DELETE' }),
};
