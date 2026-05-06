import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";

/* ══════════════════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════════════ */
export interface ChatSession {
  id: string;
  title: string;
  language: string;
  preview: string;
  timestamp: Date;
}

interface LayoutProps {
  children: React.ReactNode;
  /** Currently open chat id — highlights the correct sidebar item */
  activeChatId?: string;
  /** Hardcode to false until auth is wired up */
  isAuthenticated?: boolean;
  userName?: string;
  userImage?: string | null;
  sessions?: ChatSession[];
  onNewChat?: () => void;
  onDeleteChat?: (id: string) => void;
  onRenameChat?: (id: string, title: string) => void;
}

/* ══════════════════════════════════════════════════════════════════════
   STATIC DEMO DATA  (swap with real tRPC data later)
══════════════════════════════════════════════════════════════════════ */
const DEMO_SESSIONS: ChatSession[] = [
  {
    id: "abc123",
    title: "fetchUserData async fix",
    language: "javascript",
    preview: "Race condition in fetch callback, XSS via innerHTML...",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "def456",
    title: "Python sort algorithm",
    language: "python",
    preview: "Bubble sort O(n²) — suggested merge sort...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "ghi789",
    title: "React useEffect cleanup",
    language: "typescript",
    preview: "Memory leak in subscription, missing dep array...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "jkl012",
    title: "SQL injection vulnerability",
    language: "php",
    preview: "Direct user input in query, use prepared statements...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
  {
    id: "mno345",
    title: "Rust lifetime error",
    language: "rust",
    preview: "Borrow checker conflict, suggested Arc<Mutex<T>>...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
  {
    id: "pqr678",
    title: "Go goroutine leak",
    language: "go",
    preview: "Unbounded goroutine creation, context cancellation...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
  },
  {
    id: "stu901",
    title: "CSS specificity chaos",
    language: "javascript",
    preview: "!important overuse, suggested BEM instead...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
  },
  {
    id: "vwx234",
    title: "Java null pointer chain",
    language: "java",
    preview: "Optional not used, deep null checks throughout...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
  },
];

/* ══════════════════════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════════════════════ */
const LANG_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  javascript: { bg: "rgba(251,191,36,0.12)",  text: "#FBB324", dot: "#FBB324" },
  typescript: { bg: "rgba(56,189,248,0.12)",  text: "#38BDF8", dot: "#38BDF8" },
  python:     { bg: "rgba(52,211,153,0.12)",  text: "#34D399", dot: "#34D399" },
  java:       { bg: "rgba(249,115,22,0.12)",  text: "#F97316", dot: "#F97316" },
  go:         { bg: "rgba(96,165,250,0.12)",  text: "#60A5FA", dot: "#60A5FA" },
  rust:       { bg: "rgba(251,113,133,0.12)", text: "#FB7185", dot: "#FB7185" },
  cpp:        { bg: "rgba(167,139,250,0.12)", text: "#A78BFA", dot: "#A78BFA" },
  php:        { bg: "rgba(139,92,246,0.12)",  text: "#8B5CF6", dot: "#8B5CF6" },
  ruby:       { bg: "rgba(248,113,113,0.12)", text: "#F87171", dot: "#F87171" },
  csharp:     { bg: "rgba(52,211,153,0.12)",  text: "#34D399", dot: "#34D399" },
};

const S = {
  sidebar:     "rgba(15,5,37,0.97)",
  sidebarBdr:  "rgba(91,42,138,0.4)",
  sidebarBdrS: "rgba(91,42,138,0.3)",
  purple:      "rgba(139,92,246,0.12)",
  purpleHov:   "rgba(139,92,246,0.2)",
  text:        "#CBD5E1",
  textMute:    "rgba(148,163,184,0.45)",
  textDim:     "rgba(148,163,184,0.35)",
};

/* ══════════════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════════════ */
function getLang(lang: string) {
  return LANG_COLORS[lang] ?? { bg: "rgba(148,163,184,0.1)", text: "#94A3B8", dot: "#94A3B8" };
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7)  return `${d}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function groupSessions(sessions: ChatSession[]) {
  const DAY = 86400000;
  const now = Date.now();
  const buckets: Record<string, ChatSession[]> = {
    Today: [], Yesterday: [], "This Week": [], Older: [],
  };
  sessions.forEach((s) => {
    const diff = now - s.timestamp.getTime();
    if      (diff < DAY)       buckets["Today"]!.push(s);
    else if (diff < 2 * DAY)   buckets["Yesterday"]!.push(s);
    else if (diff < 7 * DAY)   buckets["This Week"]!.push(s);
    else                        buckets["Older"]!.push(s);
  });
  return Object.entries(buckets).filter(([, items]) => items.length > 0);
}

/* ══════════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════════════════════════════════ */

/* ── Right-click / three-dot context menu ── */
function ContextMenu({
  x, y, onClose, onRename, onDelete,
}: {
  x: number; y: number;
  onClose: () => void;
  onRename: () => void;
  onDelete: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [onClose]);

  const items = [
    { icon: "✏️", label: "Rename", action: onRename, danger: false },
    { icon: "🗑️", label: "Delete", action: onDelete, danger: true  },
  ];

  return (
    <div
      ref={ref}
      className="fixed z-50 min-w-[148px] overflow-hidden rounded-xl py-1"
      style={{
        left: x, top: y,
        background: "#1A0636",
        border: "1px solid rgba(91,42,138,0.65)",
        boxShadow: "0 20px 48px rgba(0,0,0,0.75), 0 0 0 1px rgba(139,92,246,0.08)",
      }}
    >
      {items.map(({ icon, label, action, danger }) => (
        <button
          key={label}
          onClick={() => { action(); onClose(); }}
          className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-xs font-medium transition-colors duration-150"
          style={{ color: danger ? "#F87171" : S.text }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = danger
              ? "rgba(248,113,113,0.1)" : S.purple;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          <span>{icon}</span>{label}
        </button>
      ))}
    </div>
  );
}

/* ── Single chat row in the list ── */
function ChatItem({
  session, isActive, onDelete, onRename,
}: {
  session: ChatSession;
  isActive: boolean;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
}) {
  const [menu, setMenu]       = useState<{ x: number; y: number } | null>(null);
  const [editing, setEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(session.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const lang     = getLang(session.language);

  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  const commit = () => {
    setEditing(false);
    if (localTitle.trim() && localTitle !== session.title)
      onRename(session.id, localTitle.trim());
    else setLocalTitle(session.title);
  };

  return (
    <>
      <Link
        href={`/c/${session.id}`}
        onContextMenu={(e) => { e.preventDefault(); setMenu({ x: e.clientX, y: e.clientY }); }}
        className="group relative flex flex-col gap-1 rounded-xl px-3 py-2.5 transition-all duration-200"
        style={{
          background: isActive
            ? "linear-gradient(135deg,rgba(139,92,246,0.18),rgba(56,189,248,0.07))"
            : "transparent",
          border: `1px solid ${isActive ? "rgba(139,92,246,0.38)" : "transparent"}`,
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLAnchorElement).style.background = S.purple;
            (e.currentTarget as HTMLAnchorElement).style.borderColor = S.sidebarBdrS;
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "transparent";
          }
        }}
      >
        {/* Active left bar */}
        {isActive && (
          <span
            className="absolute bottom-2.5 left-0 top-2.5 w-[3px] rounded-full"
            style={{ background: "linear-gradient(180deg,#F97316,#8B5CF6)" }}
          />
        )}

        {/* Row 1 — title + three-dot */}
        <div className="flex items-center gap-2 pl-2">
          {editing ? (
            <input
              ref={inputRef}
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit();
                if (e.key === "Escape") { setEditing(false); setLocalTitle(session.title); }
              }}
              onClick={(e) => e.preventDefault()}
              className="flex-1 bg-transparent text-xs font-semibold outline-none"
              style={{ color: "#F1F5F9", borderBottom: "1px solid rgba(139,92,246,0.55)" }}
            />
          ) : (
            <span
              className="flex-1 truncate text-xs font-semibold"
              style={{ color: isActive ? "#F1F5F9" : S.text }}
            >
              {localTitle}
            </span>
          )}

          {/* ⋯ menu button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const r = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
              setMenu({ x: r.left, y: r.bottom + 4 });
            }}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md opacity-0 transition-all duration-150 group-hover:opacity-100"
            style={isActive ? { opacity: 0.65 } : {}}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = S.purpleHov;
              (e.currentTarget as HTMLButtonElement).style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
            aria-label="Options"
          >
            <svg viewBox="0 0 16 16" fill="#94A3B8" className="h-3 w-3">
              <circle cx="3" cy="8" r="1.3" />
              <circle cx="8" cy="8" r="1.3" />
              <circle cx="13" cy="8" r="1.3" />
            </svg>
          </button>
        </div>

        {/* Row 2 — language badge + preview */}
        <div className="flex items-center gap-2 pl-2">
          <span
            className="inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
            style={{ background: lang.bg, color: lang.text }}
          >
            <span className="h-1 w-1 rounded-full" style={{ background: lang.dot }} />
            {session.language}
          </span>
          <span className="flex-1 truncate text-[10px]" style={{ color: "rgba(148,163,184,0.45)" }}>
            {session.preview}
          </span>
        </div>

        {/* Row 3 — timestamp */}
        <span className="pl-2 text-[10px]" style={{ color: S.textDim }}>
          {timeAgo(session.timestamp)}
        </span>
      </Link>

      {menu && (
        <ContextMenu
          x={menu.x} y={menu.y}
          onClose={() => setMenu(null)}
          onRename={() => setEditing(true)}
          onDelete={() => onDelete(session.id)}
        />
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   MAIN LAYOUT EXPORT
══════════════════════════════════════════════════════════════════════ */
export default function Layout({
  children,
  activeChatId,
  isAuthenticated = false,   // ← hardcoded false until auth is wired
  userName    = "Guest User",
  userImage   = null,
  sessions    = DEMO_SESSIONS,
  onNewChat,
  onDeleteChat   = () => undefined,
  onRenameChat   = () => undefined,
}: LayoutProps) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch]       = useState("");

  const groups   = groupSessions(sessions);
  const filtered = search.trim()
    ? sessions.filter(
        (s) =>
          s.title.toLowerCase().includes(search.toLowerCase()) ||
          s.language.toLowerCase().includes(search.toLowerCase()),
      )
    : null;

  const handleNew = () => {
    if (onNewChat) onNewChat();
    else void router.push(`/c/chat-${Date.now()}`);
  };

  /* ─── helpers to make inline style hover work with ts ─── */
  const hoverOn  = (el: HTMLElement, styles: Partial<CSSStyleDeclaration>) =>
    Object.assign(el.style, styles);
  const hoverOff = (el: HTMLElement, styles: Partial<CSSStyleDeclaration>) =>
    Object.assign(el.style, styles);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#2A0A52" }}>

      {/* ════════════════════════════════════════════════════════
          SIDEBAR
      ════════════════════════════════════════════════════════ */}
      <aside
        className="relative flex shrink-0 flex-col transition-[width] duration-300 ease-in-out"
        style={{
          width: collapsed ? "60px" : "256px",
          background: S.sidebar,
          borderRight: `1px solid ${S.sidebarBdr}`,
        }}
      >

        {/* ── Header: logo + collapse toggle ── */}
        <div
          className="flex h-14 shrink-0 items-center border-b px-3"
          style={{ borderColor: S.sidebarBdr, gap: collapsed ? 0 : "auto" }}
        >
          {/* Logo — hidden when collapsed */}
          {!collapsed && (
            <Link href="/" className="flex flex-1 items-center gap-2.5 overflow-hidden">
              <Image src="/logo.png" alt="Allen Reviewer" width={26} height={26} className="shrink-0" />
              <div className="flex min-w-0 items-baseline gap-1">
                <span
                  className="text-sm font-bold tracking-wide"
                  style={{
                    background: "linear-gradient(90deg,#38BDF8,#7DD3FC)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  ALLEN
                </span>
                <span className="text-[10px] font-bold tracking-widest" style={{ color: "#F97316" }}>
                  REVIEWER
                </span>
              </div>
            </Link>
          )}

          {/* Logo icon only when collapsed */}
          {collapsed && (
            <Link href="/" className="mx-auto">
              <Image src="/logo.png" alt="Allen Reviewer" width={26} height={26} />
            </Link>
          )}

          {/* Collapse toggle — only in expanded mode */}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-150"
              style={{ color: "rgba(148,163,184,0.45)" }}
              onMouseEnter={(e) => hoverOn(e.currentTarget, { background: S.purple, color: "#A78BFA" })}
              onMouseLeave={(e) => hoverOff(e.currentTarget, { background: "transparent", color: "rgba(148,163,184,0.45)" })}
              aria-label="Collapse sidebar"
            >
              {/* ‹‹ icon */}
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        {/* ════════ COLLAPSED STATE ════════ */}
        {collapsed && (
          <div className="flex flex-col items-center gap-3 py-4">
            {/* Expand button */}
            <button
              onClick={() => setCollapsed(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-150"
              style={{ color: "rgba(148,163,184,0.45)" }}
              onMouseEnter={(e) => hoverOn(e.currentTarget, { background: S.purple, color: "#A78BFA" })}
              onMouseLeave={(e) => hoverOff(e.currentTarget, { background: "transparent", color: "rgba(148,163,184,0.45)" })}
              aria-label="Expand sidebar"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>

            {/* New chat */}
            <button
              onClick={handleNew}
              className="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-150"
              style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)", color: "#FB923C" }}
              title="New Review"
              onMouseEnter={(e) => hoverOn(e.currentTarget, { background: "rgba(249,115,22,0.2)", boxShadow: "0 0 12px rgba(249,115,22,0.25)" })}
              onMouseLeave={(e) => hoverOff(e.currentTarget, { background: "rgba(249,115,22,0.1)", boxShadow: "none" })}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Language-dot shortcuts */}
            <div className="flex flex-col items-center gap-1 pt-1">
              {sessions.slice(0, 7).map((s) => {
                const l = getLang(s.language);
                const active = s.id === activeChatId;
                return (
                  <Link
                    key={s.id}
                    href={`/c/${s.id}`}
                    title={s.title}
                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-150"
                    style={{
                      background: active ? l.bg : "transparent",
                      border: `1px solid ${active ? `${l.dot}55` : "transparent"}`,
                    }}
                    onMouseEnter={(e) => hoverOn(e.currentTarget, { background: l.bg })}
                    onMouseLeave={(e) => { if (!active) hoverOff(e.currentTarget, { background: "transparent" }); }}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: l.dot, boxShadow: `0 0 5px ${l.dot}` }}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ════════ EXPANDED STATE ════════ */}
        {!collapsed && (
          <>
            {/* New review button */}
            <div className="px-3 pt-3">
              <button
                onClick={handleNew}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg,rgba(249,115,22,0.14),rgba(234,106,8,0.09))",
                  border: "1px solid rgba(249,115,22,0.32)",
                  color: "#FB923C",
                }}
                onMouseEnter={(e) => hoverOn(e.currentTarget, {
                  background: "linear-gradient(135deg,rgba(249,115,22,0.24),rgba(234,106,8,0.17))",
                  borderColor: "rgba(249,115,22,0.58)",
                  boxShadow: "0 4px 16px rgba(249,115,22,0.18)",
                })}
                onMouseLeave={(e) => hoverOff(e.currentTarget, {
                  background: "linear-gradient(135deg,rgba(249,115,22,0.14),rgba(234,106,8,0.09))",
                  borderColor: "rgba(249,115,22,0.32)",
                  boxShadow: "none",
                })}
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Review
              </button>
            </div>

            {/* Search */}
            <div className="px-3 pt-2.5">
              <div
                className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-150"
                style={{ background: "rgba(42,10,82,0.5)", border: "1px solid rgba(91,42,138,0.3)" }}
              >
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5 shrink-0" style={{ color: "rgba(148,163,184,0.35)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search reviews…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-xs outline-none"
                  style={{ color: S.text }}
                />
                {search && (
                  <button onClick={() => setSearch("")} style={{ color: "rgba(148,163,184,0.35)" }}>
                    <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
                      <path d="M4.293 4.293a1 1 0 011.414 0L8 6.586l2.293-2.293a1 1 0 111.414 1.414L9.414 8l2.293 2.293a1 1 0 01-1.414 1.414L8 9.414l-2.293 2.293a1 1 0 01-1.414-1.414L6.586 8 4.293 5.707a1 1 0 010-1.414z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* ── Chat list ── */}
            <div className="sidebar-scroll flex-1 overflow-y-auto px-2 py-2">
              {isAuthenticated ? (
                /* ── Authenticated: show chat history ── */
                filtered ? (
                  filtered.length > 0 ? (
                    <div className="space-y-0.5">
                      <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: S.textDim }}>
                        {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                      </p>
                      {filtered.map((s) => (
                        <ChatItem
                          key={s.id} session={s}
                          isActive={s.id === activeChatId}
                          onDelete={onDeleteChat}
                          onRename={onRenameChat}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 pt-12 opacity-40">
                      <span className="text-2xl">🔍</span>
                      <p className="text-xs" style={{ color: "#94A3B8" }}>No reviews found</p>
                    </div>
                  )
                ) : (
                  groups.map(([label, items]) => (
                    <div key={label} className="mb-1">
                      <p
                        className="sticky top-0 px-3 pb-1.5 pt-3 text-[10px] font-semibold uppercase tracking-widest"
                        style={{ color: S.textDim, background: S.sidebar }}
                      >
                        {label}
                      </p>
                      <div className="space-y-0.5">
                        {items.map((s) => (
                          <ChatItem
                            key={s.id} session={s}
                            isActive={s.id === activeChatId}
                            onDelete={onDeleteChat}
                            onRename={onRenameChat}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                )
              ) : (
                /* ── Guest: lock state ── */
                <div className="flex flex-col items-center gap-3 px-2 pt-10 text-center">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-2xl"
                    style={{ background: "rgba(56,189,248,0.07)", border: "1px solid rgba(56,189,248,0.18)" }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="1.5" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                  </div>
                  <p className="text-xs font-semibold" style={{ color: "#7DD3FC" }}>
                    Sign in to save reviews
                  </p>
                  <p className="text-[11px] leading-relaxed" style={{ color: "rgba(148,163,184,0.4)" }}>
                    Guest sessions are not saved. Your history won&apos;t persist.
                  </p>
                  <Link
                    href="/"
                    className="mt-1 rounded-xl px-4 py-2 text-xs font-semibold text-white transition-all duration-200"
                    style={{
                      background: "linear-gradient(135deg,#F97316,#EA6A08)",
                      border: "1px solid rgba(249,115,22,0.45)",
                    }}
                    onMouseEnter={(e) => hoverOn(e.currentTarget, { boxShadow: "0 4px 16px rgba(249,115,22,0.35)" })}
                    onMouseLeave={(e) => hoverOff(e.currentTarget, { boxShadow: "none" })}
                  >
                    Sign in with GitHub
                  </Link>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── User footer ── */}
        <div
          className="mt-auto shrink-0 border-t p-3"
          style={{ borderColor: S.sidebarBdr }}
        >
          {collapsed ? (
            /* Collapsed avatar only */
            <div className="flex justify-center">
              {userImage ? (
                <img src={userImage} alt={userName} className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{
                    background: isAuthenticated
                      ? "linear-gradient(135deg,#F97316,#8B5CF6)"
                      : "rgba(91,42,138,0.5)",
                  }}
                >
                  {isAuthenticated ? userName.charAt(0).toUpperCase() : "G"}
                </div>
              )}
            </div>
          ) : (
            /* Expanded user row */
            <div
              className="flex cursor-default items-center gap-2.5 rounded-xl px-2 py-2 transition-colors duration-150"
              onMouseEnter={(e) => hoverOn(e.currentTarget, { background: S.purple })}
              onMouseLeave={(e) => hoverOff(e.currentTarget, { background: "transparent" })}
            >
              {userImage ? (
                <img src={userImage} alt={userName} className="h-8 w-8 shrink-0 rounded-full object-cover" />
              ) : (
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{
                    background: isAuthenticated
                      ? "linear-gradient(135deg,#F97316,#8B5CF6)"
                      : "rgba(91,42,138,0.5)",
                  }}
                >
                  {isAuthenticated ? userName.charAt(0).toUpperCase() : "G"}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold" style={{ color: "#E2E8F0" }}>{userName}</p>
                <p className="text-[10px]" style={{ color: S.textMute }}>
                  {isAuthenticated ? "GitHub account" : "Guest session"}
                </p>
              </div>

              <button
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition-colors duration-150"
                style={{ color: "rgba(148,163,184,0.38)" }}
                onMouseEnter={(e) => hoverOn(e.currentTarget, { background: S.purpleHov, color: "#A78BFA" })}
                onMouseLeave={(e) => hoverOff(e.currentTarget, { background: "transparent", color: "rgba(148,163,184,0.38)" })}
                aria-label="Settings"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ════════════════════════════════════════════════════════
          MAIN CONTENT SLOT
      ════════════════════════════════════════════════════════ */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {children}
      </main>

      {/* ── Sidebar scrollbar ── */}
      <style>{`
        .sidebar-scroll::-webkit-scrollbar       { width: 3px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(91,42,138,0.45);
          border-radius: 999px;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(139,92,246,0.7);
        }
      `}</style>
    </div>
  );
}