# Mastery Loop API

Base URL (local): `http://localhost:5000/api`
All bodies are JSON. Errors always look like `{ "message": "..." }`.
Routes marked **auth** need the header `Authorization: Bearer <token>`.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/health` | no | Is the server up? |
| POST | `/auth/register` | no | Create an account. Body: `name`, `email`, `password` (8+ chars). Returns `{ token, user }` |
| POST | `/auth/login` | no | Body: `email`, `password`. Returns `{ token, user }` |
| GET | `/auth/me` | yes | The logged-in user |
| GET | `/users/me/stats` | yes | `{ xp, level, streak, longestStreak, mastered, totalNodes }` |
| PATCH | `/users/me` | yes | Any of `name`, `email`, `avatar` (image data URL), `password` + `currentPassword` |
| GET | `/skills` | yes | Whole skill tree: each node has `mastery`, `unlocked`, `needs`, `attempts`, `due` |
| GET | `/skills/due` | yes | Review queue: overdue topics weakest-first, then new unlocked topics |
| GET | `/attempts/question/:nodeId` | yes | One question for an unlocked topic (answer is never sent) |
| POST | `/attempts` | yes | Body: `nodeId`, `questionId`, `selected`, optional `timeMs`. Grades, runs SM-2, awards XP |

## What `POST /attempts` returns

```json
{
  "correct": true,
  "correctAnswer": "O(log n)",
  "explanation": "...",
  "quality": 5,
  "xpEarned": 40,
  "masteryLevel": 0.65,
  "intervalDays": 1,
  "nextReviewDate": "2026-11-11T12:00:00.000Z",
  "newlyUnlocked": ["Recursion", "Sorting algorithms"],
  "user": { "xp": 40, "level": 1, "streak": 1 }
}
```

## Status codes

400 bad input, 401 not logged in or session expired, 403 topic is locked, 404 not found,
409 email already in use, 413 upload too large, 429 too many login attempts.

## Learning rules (server/src/config/env.js and services/)

- Answer quality: wrong = 1, correct and fast (8s or less) = 5, correct = 4, correct and slow (over 20s) = 3.
- SM-2 intervals: 1 day, then 6 days, then previous interval x ease factor. Ease never drops below 1.3.
- Mastery: a good answer closes 30-40% of the gap to 1; a wrong answer loses 40%.
- A topic unlocks when all its prerequisites reach 0.6 mastery; "mastered" is 0.8.
- XP for a correct answer: 15 + 10 x difficulty (+5 for quality 5). Level = every 200 XP.
- Streaks roll over at local midnight (India time by default).
