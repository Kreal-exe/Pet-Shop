// Backend origin, e.g. http://localhost:3333 — set VITE_API_URL in .env.local
// for development and as a repository variable for the Pages build.
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3333').replace(/\/$/, '');

async function request(path, options) {
  const response = await fetch(`${API_URL}${path}`, options);
  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`);
  }
  return response.json();
}

function post(path, body) {
  return request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export const imageUrl = (path) => `${API_URL}${path}`;
export const getCategories = () => request('/categories/all');
export const getCategory = (id) => request(`/categories/${id}`);
export const getProducts = () => request('/products/all');
export const getProduct = (id) => request(`/products/${id}`);
export const sendOrder = (order) => post('/order/send', order);
export const sendSale = (form) => post('/sale/send', form);
