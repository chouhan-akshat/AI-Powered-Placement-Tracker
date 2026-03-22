# AI Placement Mentor — API

Base URL: `http://localhost:5000/api` (configurable)

All JSON bodies use `Content-Type: application/json`.

Protected routes require header: `Authorization: Bearer <token>`

---

## Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Service check |

---

## Auth

| Method | Path | Auth | Body | Description |
|--------|------|------|------|-------------|
| POST | `/auth/signup` | No | `name`, `email`, `password`, optional `branch`, `semester`, `goal`, `goalDetail` | Register; creates user roadmap |
| POST | `/auth/login` | No | `email`, `password` | Returns JWT + user |
| GET | `/auth/me` | Yes | — | Profile + `topicProgress`, `weeklyGoals` |
| PATCH | `/auth/me` | Yes | optional `name`, `branch`, `semester`, `goal`, `goalDetail`, `resumeText` | Update profile; may regenerate roadmap |

**Goals:** `service` | `product` | `specific_role` | `general`

---

## Roadmap

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/roadmap/me` | Yes | User’s roadmap document (`plan` is JSON) |
| POST | `/roadmap/regenerate` | Yes | Rebuild plan from current profile |

---

## Topics

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/topics` | No | List topics; query `?category=dsa\|core\|aptitude\|project\|system_design` |
| GET | `/topics/:slug` | No | Single topic |
| POST | `/topics/progress` | Yes | `{ topicId, completed }` — toggle completion |

---

## Tests

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/tests` | No | List active tests (no correct answers) |
| GET | `/tests/:id` | No | Test without correct answers |
| POST | `/tests/:id/submit` | Yes | `{ answers: number[] }` (index per question), optional `durationSeconds` |

---

## Results

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/results/me` | Yes | User’s recent results |
| GET | `/results/leaderboard` | No | Optional `?testId=` — top users by best percentage |

---

## Progress

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/progress` | Yes | Aggregates topics/tests + weekly stats |
| PATCH | `/progress/weekly` | Yes | `{ targetTopics, targetTests }` |

---

## AI (OpenAI)

| Method | Path | Auth | Body | Description |
|--------|------|------|------|-------------|
| POST | `/ai/mentor` | Yes | `{ messages: [{ role, content }] }` | Placement mentor chat |
| POST | `/ai/mock-interview` | Yes | Same shape | Interview turn / feedback |
| POST | `/ai/resume` | Yes | `{ text }` optional if `resumeText` saved on profile | Resume analysis |

**503** if `OPENAI_API_KEY` missing.

---

## Admin (`role: admin`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/admin/tests` | Admin | All tests (includes answers) |
| POST | `/admin/tests` | Admin | Create test + questions |
| PATCH | `/admin/tests/:id` | Admin | Update test |
| POST | `/admin/topics` | Admin | Create topic |
| PATCH | `/admin/topics/:id` | Admin | Update topic |

---

## Socket.io (optional)

Connect to same host as HTTP server with `auth: { token: "<JWT>" }`.

**Client → Server:** `mock_interview:message` — `{ messages: OpenAI-style array }`

**Server → Client:** `mock_interview:reply` — `{ reply }` · `mock_interview:error` — `{ message }`

REST endpoint `/ai/mock-interview` mirrors the same AI behavior without sockets.

---

## Collections (MongoDB)

| Collection | Purpose |
|------------|---------|
| users | Credentials, profile, `topicProgress`, `weeklyGoals`, `resumeText` |
| roadmaps | One per user: dynamic `plan` JSON |
| topics | Slug, category, resources, practice links |
| tests | MCQ sets, timer metadata |
| results | Per-attempt scores and answers |
