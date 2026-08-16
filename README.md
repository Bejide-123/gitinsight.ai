# GitInsight AI

> Engineering intelligence for GitHub repositories

GitInsight AI is a web app that analyzes a GitHub repository and turns raw code and commit activity into a clear engineering assessment. It evaluates project health, security posture, architecture quality, testing maturity, completeness, and production readiness in a single report.

This is built for developers, engineering managers, CTOs, recruiters, and technical founders who want a faster and more honest view of a codebase than a README or a GitHub star count can provide.

---

## Why it exists

A repository tells you what was built, but not how well it was built.

GitInsight helps answer questions like:

- Is the project actually production-ready?
- Are there dangerous security issues?
- Is the architecture clear and maintainable?
- Does the repo have weak testing coverage?
- Does it look like a healthy engineering effort or a rushed prototype?
- What should be improved next?

---

## What the product does

GitInsight analyzes a repo across multiple intelligence layers:

- Security and risk review
- Architecture and maintainability signals
- Testing maturity and completeness checks
- Technology and feature detection
- Project intent and maturity scoring
- AI-generated summary and recommendations
- Saved reports and history for authenticated users

The output is structured as a product-style engineering report with clear verdicts, recommendations, and prioritized opportunities.

---

## Main features

- GitHub repository ingestion and analysis
- Project intent detection
- Security, architecture, testing, readiness, and completeness scoring
- AI-generated summary and roadmap
- Report storage in MongoDB
- Authenticated users with saved history
- Dockerized local deployment
- Test coverage for main auth and API routes

---

## Tech stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Lucide icons
- TanStack Query

### Backend
- Next.js API routes
- MongoDB with Mongoose
- JWT authentication
- Zod validation

### AI and integrations
- Google Gemini API
- GitHub REST API via Octokit

### Quality and tooling
- Vitest
- Docker
- ESLint

---

## Project structure

```bash
app/                 # App routes and UI pages
components/          # Reusable app components
config/              # runtime config and service setup
context/             # auth context
hooks/               # client-side data hooks
lib/                 # shared utilities and validation
middlewares/         # request middleware
models/              # MongoDB models
services/            # analysis and GitHub service logic
__tests__/           # Vitest test suite
Dockerfile           # container build
docker-compose.yml   # local compose setup
```

---

## Getting started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a local environment file:

```bash
cp .env.example .env.local
```

Then fill in the required values:

```env
NODE_ENV=development
PORT=3000
HOSTNAME=0.0.0.0
JWT_SECRET=replace-with-a-long-random-secret-at-least-32-characters
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
GITHUB_TOKEN=ghp_your_github_token_here
GEMINI_API_KEY=your_gemini_api_key_here
```

Important:
- `JWT_SECRET` must be long and random in production
- never commit real credentials to source control
- use a secrets manager or deployment environment variables in production

### 3) Run the app locally

```bash
npm run dev
```

Then open:

```bash
http://localhost:3000
```

---

## Docker

### Build the image

```bash
docker build -t gitinsight-ai .
```

### Run the container

```bash
docker run --rm -p 3000:3000 --env-file .env.local gitinsight-ai
```

### Or with Docker Compose

```bash
docker compose up --build
```

The app includes a health endpoint for container readiness checks:

```bash
http://localhost:3000/api/health
```

---

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run docker:build
npm run docker:run
```

---

## Testing

The project includes a Vitest setup for API and auth coverage.

Run tests with:

```bash
npm test
```

Current coverage includes:
- auth token handling
- validation checks
- auth route behavior
- analysis API behavior
- health endpoint checks
- history endpoint checks

---

## Current status

GitInsight AI is in active beta-stage development and is already functional as a real product MVP.

### Completed
- landing page and product UI
- authentication flow
- MongoDB-backed persistence
- GitHub repo analysis pipeline
- project scoring engine
- report generation and user history
- Docker setup and health checks
- automated testing foundation

### Still recommended before public launch
- production secret management via a secure platform
- request rate limiting and abuse protection
- monitoring and error tracking
- stronger production logging and alerting
- more end-to-end/error-path tests
- legal/privacy pages for public launch

---

## Public launch recommendation

This app is strong enough to be used in a private beta or controlled release, but before making it public you should complete the operational hardening work around secrets, limits, monitoring, and user protection.

---

## Future roadmap

Planned improvements include:

- richer workflow intelligence
- deeper contributor and team analytics
- historical trend tracking over time
- improved product analytics and export features
- broader AI analysis quality tuning
- enterprise-ready deployment and scale controls

---

## Author

**Bejide Mofiyinfoluwa Israel**

Frontend Developer · Product Builder · Software Engineer

---

## License

MIT
