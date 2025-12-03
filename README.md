# Calendar App (Vite + React + TypeScript)

Small demo app that shows a calendar for the current month and lets you add/remove events (stored in `localStorage`).

Quick start

1. Install dependencies

```bash
cd /Users/amex/CodeBase/DockerNodeApp
npm install
```

2. Run dev server

```bash
npm run dev
```

3. Build

```bash
npm run build
npm run preview
```

Notes
- Click the `+` on a day to add an event (simple prompt). Events persist in the browser's `localStorage` under the key `calendar-events-v1`.
# DockerNodeApp
Single Repository for all of my Docker Images

Docker image

Build the production image (from project root):

```bash
docker build -t docker-node-app-calendar:latest .
```

Run the container (map port 8080 to container 80):

```bash
docker run -it --rm -p 8080:80 docker-node-app-calendar:latest
```

Then open http://localhost:8080 in your browser.
