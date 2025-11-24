const BASE_URL = 'http://localhost:3000/api/v1';

const getCookie = (name) => {
  const value = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`));
  return value ? decodeURIComponent(value.split('=')[1]) : null;
};

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = getCookie('token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || 'Error en la petición');
    error.response = { data, status: response.status };
    throw error;
  }
  return { data };
};

export const authService = {
  signup: async (username, email, password) => {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ username, email, password }),
    });
    return handleResponse(response);
  },

  signin: async (email, password) => {
    const response = await fetch(`${BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  getProtected: async () => {
    const response = await fetch(`${BASE_URL}/protected`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};
