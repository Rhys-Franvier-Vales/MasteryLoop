# Mastery Loop database (MongoDB, via Mongoose)

| Collection | Key fields | Notes |
|---|---|---|
| `users` | name, email (unique), passwordHash, avatar, xp, streak, longestStreak, lastPracticeDate | Password hash is never returned by the API |
| `skillnodes` | title (unique), description, difficulty 1-3, prerequisites[], order | Prerequisites are references to other nodes |
| `questions` | skillNode, text, options[], answer, explanation | The answer is only ever used server-side |
| `userprogresses` | user, skillNode, easeFactor, repetitions, intervalDays, nextReviewDate, masteryLevel, attempts | One row per user per topic; unique index on (user, skillNode) |
| `attempts` | user, skillNode, question, selected, correct, quality, xpEarned, timeMs | Append-only history |

Indexes: `userprogresses {user, nextReviewDate}` makes "what is due today" fast.

MongoDB cannot follow prerequisite chains with a recursive query, so unlocking is
checked in application code (`services/questService.js`). Because a topic can only be
practiced after its prerequisites are mastered, checking direct prerequisites is enough.
