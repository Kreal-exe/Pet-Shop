# Pet Shop

<img src="Pet-Shop-Frontend/src/assets/logo.svg" alt="Pet Shop logo" width="72">

An online store for pet products: categories, product listings with price/discount filters and sorting, product pages, a cart with a discount coupon and an order form. Built with React, Redux Toolkit and React Router on the frontend and Express + SQLite on the backend.

**Live demo:** https://blunt0ff.github.io/Pet-Shop/

## Structure

- `Pet-Shop-Frontend` — Vite + React 19, Redux Toolkit (cart persisted to `localStorage`), React Router 7, SCSS
- `Pet-Shop-Backend` — Express, Sequelize, SQLite; serves the REST API and product images on port 3333

## Run locally

### Backend

```bash
cd Pet-Shop-Backend
npm install
npm run dev
```

### Frontend

```bash
cd Pet-Shop-Frontend
npm install
npm run dev
```

The frontend talks to `http://localhost:3333` by default. To point it elsewhere, create `Pet-Shop-Frontend/.env.local`:

```
VITE_API_URL=https://your-backend.example.com
```

## API

| Method | Route             | Description                 |
| ------ | ----------------- | --------------------------- |
| GET    | `/categories/all` | All categories              |
| GET    | `/categories/:id` | Category with its products  |
| GET    | `/products/all`   | All products                |
| GET    | `/products/:id`   | Single product              |
| POST   | `/order/send`     | Place an order              |
| POST   | `/sale/send`      | Request the discount coupon |

## Deployment

- **Backend** runs on [Render](https://render.com) as a Node web service described in `render.yaml` (root `Pet-Shop-Backend`, `node index.js`, listens on `$PORT`).
- **Frontend** is published to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`. The build reads the backend origin from the repository variable `VITE_API_URL` (Settings → Secrets and variables → Actions → Variables).
