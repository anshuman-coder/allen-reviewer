import PageHelmet from "@/components/global/PageHelmet";
import { DEFAULT_LANGUAGE, DEMO_CODE, DEMO_REVIEW } from "@/constants/demo";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useCallback } from "react";
import Editor from "react-simple-code-editor";
import Markdown from "react-markdown";

import Layout from "@/components/global/layout";

/* ══════════════════════════════════════════════════════════════════════
   PRISM  (loaded via CDN <script> tags in _document.tsx)
══════════════════════════════════════════════════════════════════════ */
declare const Prism: {
  highlight: (code: string, grammar: unknown, language: string) => string;
  languages: Record<string, unknown>;
};

/* ══════════════════════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════════════════════ */
const LANGUAGES = [
  "javascript", "typescript", "python", "java",
  "go", "rust", "cpp", "csharp", "php", "ruby",
];

const EXT: Record<string, string> = {
  typescript: "ts", python: "py", java: "java",
  go: "go", rust: "rs", cpp: "cpp",
  csharp: "cs", php: "php", ruby: "rb",
};

/* ══════════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════════ */
export default function EditorPage() {
  const router      = useRouter();
  const { id }      = router.query;

  const [code, setCode]         = useState(DEMO_CODE);
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [review]                = useState(DEMO_REVIEW);
  const [isReviewing]           = useState(false);

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

  const ext = EXT[language] ?? "js";

  return (
    <>
      <PageHelmet
        title={String(id ?? "New Review")}
        description="AI-powered code review session"
      />

      <Layout
        activeChatId={String(id ?? "")}
        isAuthenticated={false}
        userName="Guest User"
        userImage={null}
      >

        {/* ════════════════════════════════════════
            TOP NAV BAR
        ════════════════════════════════════════ */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-brand-border/40 bg-brand-bg/95 px-5 backdrop-blur-md">

          {/* Chat ID pill */}
          <div className="flex items-center gap-2 rounded-full border border-purple-500/35 bg-purple-500/12 px-3 py-1 text-xs font-medium text-purple-400">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_#A78BFA]" />
            {String(id ?? "new-session")}
          </div>

          {/* Model badge */}
          <div className="flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/7 px-3 py-1 text-xs text-blue-300">
            <Image src="/logo.png" alt="" width={14} height={14} />
            Allen AI
          </div>
        </header>

        {/* ════════════════════════════════════════
            SPLIT PANE  (editor | review)
        ════════════════════════════════════════ */}
        <div className="flex flex-1 overflow-hidden">

          {/* ──────────────────────────────────────
              LEFT — Code editor
          ────────────────────────────────────── */}
          <div className="flex w-1/2 flex-col border-r border-brand-border/40">

            {/* Editor toolbar */}
            <div className="flex h-11 shrink-0 items-center justify-between border-b border-brand-border/30 bg-surface-dark/75 px-4">

              {/* Traffic lights + filename */}
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-error opacity-70" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning opacity-70" />
                <span className="h-2.5 w-2.5 rounded-full bg-success opacity-70" />
                <span className="ml-3 text-xs text-text-muted/40">
                  snippet.{ext}
                </span>
              </div>

              {/* Language picker */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="cursor-pointer rounded-md border border-brand-border/50 bg-brand-bg/90 px-2 py-1 text-xs font-medium text-blue-300 outline-none"
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l.charAt(0).toUpperCase() + l.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Editor body */}
            <div className="relative flex-1 overflow-auto bg-editor-bg">
              {/* Gutter shadow */}
              <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-10 border-r border-brand-border/25 bg-purple-500/4" />
              <Editor
                value={code}
                onValueChange={setCode}
                highlight={highlight}
                padding={{ top: 16, bottom: 16, left: 48, right: 16 }}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13.5,
                  lineHeight: 1.75,
                  color: "#E2E8F0",
                  minHeight: "100%",
                  caretColor: "#F97316",
                }}
                textareaClassName="editor-ta"
              />
            </div>

            {/* Footer: stats + Review button */}
            <div className="flex h-16 shrink-0 items-center justify-between border-t border-brand-border/30 bg-surface-dark/85 px-4">
              <span className="text-xs text-text-muted/40">
                {code.split("\n").length} lines · {code.length} chars
              </span>

              <button
                disabled={isReviewing || !code.trim()}
                className="group relative flex items-center gap-2.5 overflow-hidden rounded-xl border border-orange-500/50 bg-linear-[135deg] from-orange-500 to-orange-600 px-6 py-2.5 text-sm font-bold text-white shadow-btn-review transition-all duration-300 hover:-translate-y-px hover:shadow-btn-review-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                {/* Shimmer sweep */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/10 transition-transform duration-700 group-hover:translate-x-full" />

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

          {/* ──────────────────────────────────────
              RIGHT — AI Review output
          ────────────────────────────────────── */}
          <div className="flex w-1/2 flex-col bg-review-bg">

            {/* Review panel header */}
            <div className="flex h-11 shrink-0 items-center justify-between border-b border-blue-400/18 bg-review-bg/90 px-4">
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-linear-[135deg] from-blue-400 to-blue-300">
                  <svg viewBox="0 0 16 16" fill="white" className="h-3 w-3" aria-hidden="true">
                    <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 2a5 5 0 110 10A5 5 0 018 3zm-.5 2.5v3l2.5 1.5.5-.87-2-.5V5.5h-1z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold tracking-wide text-blue-300">
                  AI Review
                </span>
              </div>

              {/* Status pill */}
              <div className="flex items-center gap-1.5 rounded-full border border-success/28 bg-success/9 px-2 py-0.5 text-xs text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_5px_#22C55E]" />
                Ready
              </div>
            </div>

            {/* Markdown output */}
            <div className="review-scroll flex-1 overflow-y-auto px-6 py-5">
              {review ? (
                <div className="review-fade">
                  <Markdown
                    components={{
                      h2: ({ children }) => (
                        <h2 className="text-gradient-allen mb-3 mt-6 text-lg font-bold first:mt-0">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="mb-2 mt-5 text-base font-semibold text-text-secondary">
                          {children}
                        </h3>
                      ),
                      h4: ({ children }) => (
                        <h4 className="mb-1.5 mt-4 text-sm font-semibold text-text-muted">
                          {children}
                        </h4>
                      ),
                      p: ({ children }) => (
                        <p className="mb-3 text-sm leading-relaxed text-text-secondary">
                          {children}
                        </p>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="my-3 rounded-lg border-l-4 border-orange-500 bg-orange-500/[0.07] px-4 py-2.5 text-sm text-orange-300">
                          {children}
                        </blockquote>
                      ),
                      code: ({ children, className }) =>
                        className?.includes("language-") ? (
                          <code className={`${className} block font-mono text-[12.5px] leading-[1.72] text-text-primary`}>
                            {children}
                          </code>
                        ) : (
                          <code className="rounded bg-purple-500/17 px-1.5 py-0.5 font-mono text-xs text-purple-400">
                            {children}
                          </code>
                        ),
                      pre: ({ children }) => (
                        <pre className="my-3 overflow-x-auto rounded-xl border border-brand-border/38 bg-code-bg p-4 font-mono text-xs leading-[1.75]">
                          {children}
                        </pre>
                      ),
                      ul: ({ children }) => (
                        <ul className="mb-3 list-disc space-y-1 pl-5 text-sm text-text-secondary">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="mb-3 list-decimal space-y-1 pl-5 text-sm text-text-secondary">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="leading-relaxed text-text-secondary">{children}</li>
                      ),
                      hr: () => <hr className="divider my-4" />,
                      table: ({ children }) => (
                        <div className="my-4 overflow-x-auto rounded-xl border border-brand-border/38">
                          <table className="w-full text-xs">{children}</table>
                        </div>
                      ),
                      thead: ({ children }) => (
                        <thead className="border-b border-brand-border/38 bg-brand-bg/80">
                          {children}
                        </thead>
                      ),
                      th: ({ children }) => (
                        <th className="px-4 py-2.5 text-left font-semibold text-blue-300">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="border-t border-brand-border/20 px-4 py-2.5 text-text-secondary">
                          {children}
                        </td>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-text-primary">{children}</strong>
                      ),
                    }}
                  >
                    {review}
                  </Markdown>
                </div>
              ) : (
                /* Empty state */
                <div className="flex h-full flex-col items-center justify-center gap-4 opacity-35">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/18 bg-blue-400/[0.07]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="1.5" className="h-8 w-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                    </svg>
                  </div>
                  <p className="text-sm text-text-muted">
                    Paste your code and hit{" "}
                    <strong className="text-orange-500">Review Code</strong>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
