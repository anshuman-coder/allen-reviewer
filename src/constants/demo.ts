export const DEFAULT_LANGUAGE = "javascript";

export const DEMO_CODE = `function fetchUserData(userId) {
  var data = null;

  fetch('/api/users/' + userId)
    .then(function(res) {
      data = res.json();
    })
    .then(function() {
      console.log(data);
      document.getElementById('user').innerHTML = data.name;
    })
    .catch(function(e) {
      console.log(e);
    });

  return data;
}`;

export const DEMO_REVIEW = `## Code Review — \`fetchUserData\`

> **Overall Rating:** ⚠️ Needs Improvement — 3 / 5

---

### 🔴 Critical Issues

#### 1. Race condition — \`data\` is always \`null\` on return
The function returns \`data\` **synchronously** before the Promise resolves.
\`fetch\` is async; the assignment inside \`.then()\` never happens in time.

\`\`\`js
// ❌ Always returns null
function fetchUserData(userId) {
  var data = null;
  fetch(...).then(() => { data = res.json(); }); // too late
  return data; // ← null every single time
}
\`\`\`

#### 2. \`res.json()\` is itself a Promise
\`Response.json()\` returns a Promise — you need to \`await\` it or chain another \`.then\`.

---

### 🟠 Significant Issues

#### 3. XSS via \`innerHTML\`
\`\`\`js
// ❌ Dangerous — arbitrary HTML injection
document.getElementById('user').innerHTML = data.name;

// ✅ Safe
document.getElementById('user').textContent = data.name;
\`\`\`

#### 4. Silent error swallowing
\`console.log(e)\` discards errors silently. Propagate or handle them meaningfully.

---

### 🟡 Minor Issues

- Use \`const\` / \`let\` instead of \`var\` for block scoping.
- Use template literals instead of string concatenation for URLs.

---

### ✅ Suggested Rewrite

\`\`\`js
async function fetchUserData(userId) {
  try {
    const res = await fetch(\`/api/users/\${userId}\`);
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    const data = await res.json();
    const el = document.getElementById('user');
    if (el) el.textContent = data.name;
    return data;
  } catch (err) {
    console.error('fetchUserData failed:', err);
    throw err;
  }
}
\`\`\`

---

### 📋 Summary

| Issue | Severity | Fixed |
|---|---|---|
| Async race condition | 🔴 Critical | ✅ |
| \`res.json()\` not awaited | 🔴 Critical | ✅ |
| XSS via innerHTML | 🟠 High | ✅ |
| Silent catch | 🟠 Medium | ✅ |
| \`var\` usage | 🟡 Low | ✅ |
`;
