import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useCallback } from "react";
import Editor from "react-simple-code-editor";
import Markdown from "react-markdown";

/* ─── Prism highlight (loaded via CDN script in _document or inline) ─── */
declare const Prism: {
  highlight: (code: string, grammar: unknown, language: string) => string;
  languages: Record<string, unknown>;
};

/* ─── Demo fixtures ──────────────────────────────────────────────────── */
const DEMO_CODE = `function fetchUserData(userId) {
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

const DEMO_REVIEW = `## Code Review — \`fetchUserData\`

> **Overall Rating:** ⚠️ Needs Improvement — 3 / 5

---

### 🔴 Critical Issues

#### 1. Race condition — \`data\` is always \`null\` on return
The function returns \`data\` **synchronously** before the Promise resolves. \`fetch\` is async; the assignment inside \`.then()\` never happens in time.

\`\`\`js
// ❌ Current — always returns null
function fetchUserData(userId) {
  var data = null;
  fetch(...).then(() => { data = res.json(); }); // too late
  return data; // ← null, every time
}
\`\`\`

#### 2. \`res.json()\` is itself a Promise
\`Response.json()\` returns a Promise — you need to \`return\` it and chain another \`.then\`, or \`await\` it.

---

### 🟠 Significant Issues

#### 3. XSS via \`innerHTML\`
\`\`\`js
// ❌ Dangerous
document.getElementById('user').innerHTML = data.name;

// ✅ Safe
document.getElementById('user').textContent = data.name;
\`\`\`
Untrusted server data set via \`innerHTML\` opens a Cross-Site Scripting vector.

#### 4. Silent error swallowing
\`console.log(e)\` discards the error silently in production. Propagate it or handle meaningfully.

---

### 🟡 Minor Issues

- Use \`const\` / \`let\` instead of \`var\` for block scoping.
- String concatenation for URLs is fragile — use template literals or \`URL\`.

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
    throw err; // let the caller decide how to handle
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

/* ─── Language options ───────────────────────────────────────────────── */
const LANGUAGES = [
  "javascript", "typescript", "python", "java", "go",
  "rust", "cpp", "csharp", "php", "ruby",
];

/* ─── Component ─────────────────────────────────────────────────────── */
export default function ChatEditor() {
  const router = useRouter();
  const { chat_id } = router.query;

  const [code, setCode] = useState(DEMO_CODE);
  const [language, setLanguage] = useState("javascript");
  const [review] = useState(DEMO_REVIEW);
  const [isReviewing] = useState(false);

  /* prism highlight — gracefully falls back if Prism not loaded */
  const highlight = useCallback(
    (src: string) => {
      try {
        return Prism.highlight(src, Prism.languages[language] ?? {}, language);
      } catch {
        return src;
      }
    },
    [language],
  );

  return (
    <>
      <Head>
        <title>Allen Reviewer — {String(chat_id ?? "New Review")}</title>
        <meta name="description" content="AI code review session" />
        <link rel="icon" href="/favicon.ico" />
        {/* Prism theme */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css"
        />
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"
          defer
        />
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js"
          defer
        />
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-typescript.min.js"
          defer
        />
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"
          defer
        />
      </Head>

      {/* ── Root shell ── */}
      <div className="flex h-screen flex-col overflow-hidden bg-brand-bg">

        {/* ════════════════════════════════
            TOP NAV
        ════════════════════════════════ */}
        <header
          className="relative z-20 flex h-14 shrink-0 items-center justify-between border-b px-5"
          style={{
            borderColor: "rgba(91,42,138,0.5)",
            background: "rgba(42,10,82,0.95)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Allen Reviewer"
              width={32}
              height={32}
              className="rounded"
            />
            <div className="flex items-baseline gap-1.5">
              <span
                className="text-base font-bold tracking-wide"
                style={{
                  background: "linear-gradient(90deg,#38BDF8,#7DD3FC)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                ALLEN
              </span>
              <span
                className="text-xs font-semibold tracking-widest"
                style={{ color: "#F97316" }}
              >
                REVIEWER
              </span>
            </div>
          </div>

          {/* Chat ID pill */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
              style={{
                background: "rgba(139,92,246,0.12)",
                border: "1px solid rgba(139,92,246,0.35)",
                color: "#A78BFA",
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full bg-purple-400"
                style={{ boxShadow: "0 0 6px #A78BFA" }}
              />
              {String(chat_id ?? "new-session")}
            </div>

            {/* New chat */}
            <button
              onClick={() => void router.push("/")}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200"
              style={{
                color: "rgba(148,163,184,0.7)",
                border: "1px solid rgba(91,42,138,0.4)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#F1F5F9";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(139,92,246,0.6)";
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(139,92,246,0.1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "rgba(148,163,184,0.7)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(91,42,138,0.4)";
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              ← Home
            </button>
          </div>
        </header>

        {/* ════════════════════════════════
            MAIN SPLIT PANE
        ════════════════════════════════ */}
        <div className="flex flex-1 overflow-hidden">

          {/* ──────────────────────────────
              LEFT — Code Editor
          ────────────────────────────── */}
          <div
            className="flex w-1/2 flex-col border-r"
            style={{ borderColor: "rgba(91,42,138,0.4)" }}
          >

            {/* Editor toolbar */}
            <div
              className="flex h-11 shrink-0 items-center justify-between border-b px-4"
              style={{
                borderColor: "rgba(91,42,138,0.35)",
                background: "rgba(15,5,37,0.7)",
              }}
            >
              <div className="flex items-center gap-2">
                {/* Traffic lights */}
                <span className="h-2.5 w-2.5 rounded-full bg-error opacity-70" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning opacity-70" />
                <span className="h-2.5 w-2.5 rounded-full bg-success opacity-70" />
                <span
                  className="ml-3 text-xs font-medium"
                  style={{ color: "rgba(148,163,184,0.5)" }}
                >
                  snippet.{language === "typescript" ? "ts" : language === "python" ? "py" : language === "java" ? "java" : language === "go" ? "go" : language === "rust" ? "rs" : language === "cpp" ? "cpp" : language === "csharp" ? "cs" : language === "php" ? "php" : language === "ruby" ? "rb" : "js"}
                </span>
              </div>

              {/* Language selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded-md px-2 py-1 text-xs font-medium outline-none transition-all duration-200"
                style={{
                  background: "rgba(42,10,82,0.9)",
                  border: "1px solid rgba(91,42,138,0.5)",
                  color: "#7DD3FC",
                  cursor: "pointer",
                }}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang} style={{ background: "#2A0A52" }}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Editor body */}
            <div
              className="relative flex-1 overflow-auto"
              style={{
                background: "#0F0520",
                fontFamily: '"Fira Code", "Cascadia Code", "JetBrains Mono", monospace',
              }}
            >
              {/* Line number gutter decoration */}
              <div
                className="pointer-events-none absolute bottom-0 left-0 top-0 w-10 opacity-30"
                style={{
                  background: "rgba(139,92,246,0.05)",
                  borderRight: "1px solid rgba(91,42,138,0.3)",
                }}
              />

              <Editor
                value={code}
                onValueChange={setCode}
                highlight={highlight}
                padding={{ top: 16, bottom: 16, left: 48, right: 16 }}
                style={{
                  fontFamily: '"Fira Code","Cascadia Code","JetBrains Mono",monospace',
                  fontSize: 13.5,
                  lineHeight: 1.75,
                  color: "#E2E8F0",
                  minHeight: "100%",
                  caretColor: "#F97316",
                }}
                textareaClassName="editor-textarea"
                className="editor-root"
              />
            </div>

            {/* Editor footer — Review button */}
            <div
              className="flex h-16 shrink-0 items-center justify-between border-t px-4"
              style={{
                borderColor: "rgba(91,42,138,0.35)",
                background: "rgba(15,5,37,0.8)",
              }}
            >
              <span
                className="text-xs"
                style={{ color: "rgba(148,163,184,0.4)" }}
              >
                {code.split("\n").length} lines · {code.length} chars
              </span>

              <button
                disabled={isReviewing || !code.trim()}
                className="relative flex items-center gap-2.5 overflow-hidden rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40"
                style={{
                  background: isReviewing
                    ? "rgba(249,115,22,0.4)"
                    : "linear-gradient(135deg,#F97316 0%,#EA6A08 100%)",
                  border: "1px solid rgba(249,115,22,0.5)",
                  boxShadow: isReviewing ? "none" : "0 4px 20px rgba(249,115,22,0.3)",
                }}
                onMouseEnter={(e) => {
                  if (!isReviewing) {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 6px 28px rgba(249,115,22,0.5), 0 0 40px rgba(249,115,22,0.2)";
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 4px 20px rgba(249,115,22,0.3)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                }}
              >
                {/* shimmer */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/10 transition-transform duration-700 hover:translate-x-full" />
                {isReviewing ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Reviewing…
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Review Code
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ──────────────────────────────
              RIGHT — AI Review Output
          ────────────────────────────── */}
          <div className="flex w-1/2 flex-col" style={{ background: "#0D0420" }}>

            {/* Review panel header */}
            <div
              className="flex h-11 shrink-0 items-center justify-between border-b px-4"
              style={{
                borderColor: "rgba(56,189,248,0.2)",
                background: "rgba(13,4,32,0.9)",
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="flex h-5 w-5 items-center justify-center rounded"
                  style={{ background: "linear-gradient(135deg,#38BDF8,#7DD3FC)" }}
                >
                  <svg viewBox="0 0 16 16" fill="white" className="h-3 w-3" aria-hidden="true">
                    <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 2a5 5 0 110 10A5 5 0 018 3zm-.5 2.5v3l2.5 1.5.5-.87-2-.5V5.5h-1z" />
                  </svg>
                </div>
                <span
                  className="text-xs font-semibold tracking-wide"
                  style={{ color: "#7DD3FC" }}
                >
                  AI Review
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Status dot */}
                <div
                  className="flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs"
                  style={{
                    background: "rgba(34,197,94,0.1)",
                    border: "1px solid rgba(34,197,94,0.3)",
                    color: "#22C55E",
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-success"
                    style={{ boxShadow: "0 0 5px #22C55E" }}
                  />
                  Ready
                </div>
              </div>
            </div>

            {/* Markdown output */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {review ? (
                <div className="markdown-body">
                  <Markdown
                    components={{
                      h2: ({ children }) => (
                        <h2
                          className="mb-3 mt-6 text-lg font-bold first:mt-0"
                          style={{
                            background: "linear-gradient(90deg,#38BDF8,#7DD3FC)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3
                          className="mb-2 mt-5 text-base font-semibold"
                          style={{ color: "#CBD5E1" }}
                        >
                          {children}
                        </h3>
                      ),
                      h4: ({ children }) => (
                        <h4
                          className="mb-1.5 mt-4 text-sm font-semibold"
                          style={{ color: "#94A3B8" }}
                        >
                          {children}
                        </h4>
                      ),
                      p: ({ children }) => (
                        <p
                          className="mb-3 text-sm leading-relaxed"
                          style={{ color: "#CBD5E1" }}
                        >
                          {children}
                        </p>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote
                          className="my-3 rounded-lg border-l-4 px-4 py-2.5 text-sm"
                          style={{
                            borderColor: "#F97316",
                            background: "rgba(249,115,22,0.07)",
                            color: "#FDB373",
                          }}
                        >
                          {children}
                        </blockquote>
                      ),
                      code: ({ children, className }) => {
                        const isBlock = className?.includes("language-");
                        return isBlock ? (
                          <code
                            className={className}
                            style={{
                              display: "block",
                              fontFamily:
                                '"Fira Code","Cascadia Code","JetBrains Mono",monospace',
                              fontSize: 12.5,
                              lineHeight: 1.7,
                              color: "#E2E8F0",
                            }}
                          >
                            {children}
                          </code>
                        ) : (
                          <code
                            className="rounded px-1.5 py-0.5 text-xs font-medium"
                            style={{
                              background: "rgba(139,92,246,0.18)",
                              color: "#A78BFA",
                              fontFamily:
                                '"Fira Code","Cascadia Code","JetBrains Mono",monospace',
                            }}
                          >
                            {children}
                          </code>
                        );
                      },
                      pre: ({ children }) => (
                        <pre
                          className="my-3 overflow-x-auto rounded-xl p-4 text-xs"
                          style={{
                            background: "#0A0118",
                            border: "1px solid rgba(91,42,138,0.4)",
                            fontFamily:
                              '"Fira Code","Cascadia Code","JetBrains Mono",monospace',
                            lineHeight: 1.75,
                            color: "#E2E8F0",
                          }}
                        >
                          {children}
                        </pre>
                      ),
                      ul: ({ children }) => (
                        <ul
                          className="mb-3 space-y-1 pl-5 text-sm"
                          style={{ color: "#CBD5E1", listStyleType: "disc" }}
                        >
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol
                          className="mb-3 space-y-1 pl-5 text-sm"
                          style={{ color: "#CBD5E1", listStyleType: "decimal" }}
                        >
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="leading-relaxed" style={{ color: "#CBD5E1" }}>
                          {children}
                        </li>
                      ),
                      hr: () => (
                        <hr
                          className="my-4 border-none"
                          style={{
                            height: 1,
                            background:
                              "linear-gradient(90deg,transparent,rgba(91,42,138,0.7) 30%,rgba(139,92,246,0.5) 50%,rgba(91,42,138,0.7) 70%,transparent)",
                          }}
                        />
                      ),
                      table: ({ children }) => (
                        <div className="my-4 overflow-x-auto rounded-xl" style={{ border: "1px solid rgba(91,42,138,0.4)" }}>
                          <table className="w-full text-xs">{children}</table>
                        </div>
                      ),
                      thead: ({ children }) => (
                        <thead style={{ background: "rgba(42,10,82,0.8)", borderBottom: "1px solid rgba(91,42,138,0.4)" }}>
                          {children}
                        </thead>
                      ),
                      th: ({ children }) => (
                        <th
                          className="px-4 py-2.5 text-left font-semibold tracking-wide"
                          style={{ color: "#7DD3FC" }}
                        >
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td
                          className="px-4 py-2.5"
                          style={{
                            color: "#CBD5E1",
                            borderTop: "1px solid rgba(91,42,138,0.2)",
                          }}
                        >
                          {children}
                        </td>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold" style={{ color: "#F1F5F9" }}>
                          {children}
                        </strong>
                      ),
                    }}
                  >
                    {review}
                  </Markdown>
                </div>
              ) : (
                /* Empty state */
                <div className="flex h-full flex-col items-center justify-center gap-4 opacity-40">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl"
                    style={{
                      background: "rgba(56,189,248,0.08)",
                      border: "1px solid rgba(56,189,248,0.2)",
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="1.5" className="h-8 w-8" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                    </svg>
                  </div>
                  <p className="text-sm" style={{ color: "#94A3B8" }}>
                    Paste your code and click <strong style={{ color: "#F97316" }}>Review Code</strong>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Scoped styles ── */}
      <style>{`
        /* Editor textarea reset */
        .editor-textarea:focus { outline: none !important; }
        .editor-root textarea  { background: transparent !important; }

        /* Markdown body base */
        .markdown-body { animation: fadeSlideIn 0.4s cubic-bezier(0.19,1,0.22,1) both; }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }

        /* Scrollbar — editor & review */
        ::-webkit-scrollbar       { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(91,42,138,0.6); border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(139,92,246,0.8); }

        /* Select dropdown */
        select option { background: #2A0A52; color: #E2E8F0; }
      `}</style>
    </>
  );
}