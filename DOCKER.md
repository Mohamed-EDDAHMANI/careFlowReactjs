# Docker instructions for careFlowReactjs

This file explains how to build and run the provided Docker images for production and development.

Files included:


Quick start (PowerShell on Windows):

Build production image and run it:

```powershell
docker build -t careflow-app:prod -f Dockerfile .
docker run -p 3000:80 --name careflow-prod --rm careflow-app:prod
```

docker-compose examples:

```powershell
# Production: builds the Dockerfile and serves on http://localhost:3000
docker-compose up --build app

# Development: runs Vite dev server inside a container on http://localhost:5173
docker-compose up --build dev
```

Notes:

## Continuous Deployment (GitHub Pages)

This repository now includes a GitHub Actions workflow that will automatically build and deploy the static site to GitHub Pages whenever you push to `main`.

Details:

- Workflow path: `.github/workflows/deploy-gh-pages.yml`
- On push to `main` it runs `npm ci`, `npm run build` and publishes the `./dist` folder to the `gh-pages` branch using `peaceiris/actions-gh-pages`.
- The workflow uses the built-in `GITHUB_TOKEN` so you don't need to create a separate token.

How it serves:

- After the first successful run the action will create and push the `gh-pages` branch. You can then enable GitHub Pages in the repository settings (or GitHub may automatically serve from `gh-pages`). The site will be available at `https://<your-username>.github.io/<repo-name>/` unless you configure a custom domain.

Notes / troubleshooting:

- If the site doesn't appear immediately, check the workflow run (Actions tab) for errors and confirm `dist` contains built assets.
- If you want a manual deploy trigger or preview deploys from other branches, I can add `workflow_dispatch` and branch-specific options.
