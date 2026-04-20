"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface Attempt {
  id: string;
  query: string;
  score: number;
  total_questions: number;
  percentage: number;
  created_at: string;
  quiz_data: QuizItem[];
}

interface QuizItem {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

interface Stats {
  total_attempts: number;
  average_score: number;
  best_score: number;
  average_percentage: number;
}

interface DashboardData {
  stats: Stats;
  attempts: Attempt[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getScoreColor(pct: number) {
  if (pct >= 80) return "#10b981";
  if (pct >= 60) return "#f59e0b";
  return "#ef4444";
}

function getBadgeStyle(pct: number) {
  const color = getScoreColor(pct);
  return {
    color,
    background: `${color}18`,
    border: `1px solid ${color}40`,
    padding: "2px 10px",
    borderRadius: 20,
    fontSize: "0.78rem",
    fontWeight: 700,
  };
}

// Stat card component
function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div
      className="rounded-2xl border bg-[var(--bg-secondary)] p-6 flex items-start gap-4 flex-1 min-w-[160px]"
      style={{ borderColor: "var(--border-custom)", boxShadow: "var(--shadow-sm)" }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18` }}
      >
        <i className={`fas ${icon} text-lg`} style={{ color }}></i>
      </div>
      <div>
        <p className="text-[var(--text-secondary)] text-xs font-medium uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <p
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {value}
        </p>
        {sub && (
          <p className="text-xs text-[var(--text-muted)] mt-0.5">{sub}</p>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [redirecting, setRedirecting] = useState(false);

  const getAuthHeaders = useCallback((): HeadersInit => {
    const token = localStorage.getItem("rehnuma_token") || "";
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, []);

  useEffect(() => {
    // Theme sync
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle("dark", saved === "dark");
    }

    // Auth gate
    const token = localStorage.getItem("rehnuma_token");
    if (!token) {
      setRedirecting(true);
      router.replace("/auth");
      return;
    }

    // Fetch dashboard
    fetch("/api/dashboard", { headers: getAuthHeaders() })
      .then((res) => {
        if (res.status === 401) {
          setRedirecting(true);
          router.replace("/auth");
          return null;
        }
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        if (json) setData(json);
      })
      .catch((err) => {
        setError(err.message || "Failed to load dashboard.");
      })
      .finally(() => setLoading(false));
  }, [router, getAuthHeaders]);

  // Chart data — last 20 attempts in chronological order
  const chartData =
    data?.attempts
      .slice(0, 20)
      .reverse()
      .map((a, i) => ({
        attempt: `#${i + 1}`,
        score: a.score,
        max: a.total_questions,
        percentage: a.percentage,
        label: a.query.substring(0, 30) + (a.query.length > 30 ? "…" : ""),
      })) ?? [];

  const isDark = theme === "dark";
  const gridColor = isDark ? "#334155" : "#e2e8f0";
  const textColor = isDark ? "#94a3b8" : "#64748b";

  if (loading || redirecting) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--hero-bg)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 48,
              height: 48,
              border: "3px solid var(--border-custom)",
              borderTopColor: "#10b981",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 1rem",
            }}
          />
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            {redirecting ? "Redirecting…" : "Loading dashboard…"}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-primary)",
          padding: "2rem",
        }}
      >
        <div className="text-center">
          <i
            className="fas fa-circle-exclamation text-4xl mb-4"
            style={{ color: "#ef4444" }}
          ></i>
          <p className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            Failed to load dashboard
          </p>
          <p className="text-[var(--text-secondary)] mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 py-2.5 px-5 font-semibold text-white rounded-xl transition-all duration-200"
            style={{ background: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)" }}
          >
            <i className="fas fa-arrow-left"></i>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Guard: data should always be set here, but defend against edge cases
  if (!data) {
    return null;
  }

  const stats = data.stats;
  const attempts = data.attempts;

  return (
    <div
      className="min-h-screen bg-[var(--bg-primary)] pb-16"
      style={{ paddingTop: "5rem" }}
    >
      <div className="container max-w-[1100px] mx-auto px-6">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1
              className="text-[2rem] font-bold text-[var(--text-primary)] mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <i
                className="fas fa-chart-line mr-3"
                style={{ color: "#10b981" }}
              ></i>
              Performance Dashboard
            </h1>
            <p className="text-[var(--text-secondary)]">
              Track your quiz history and learning progress
            </p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 py-2.5 px-5 text-sm font-medium rounded-xl border border-[var(--border-custom)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-all duration-200 hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
          >
            <i className="fas fa-arrow-left"></i>
            Back to Rehnuma
          </button>
        </div>

        {/* Empty State */}
        {attempts.length === 0 && (
          <div
            className="rounded-2xl border p-16 text-center"
            style={{
              borderColor: "var(--border-custom)",
              background: "var(--bg-secondary)",
            }}
          >
            <div className="text-6xl mb-4">📊</div>
            <h2
              className="text-xl font-bold text-[var(--text-primary)] mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              No quiz attempts yet
            </h2>
            <p className="text-[var(--text-secondary)] mb-6">
              Generate your first quiz from the home page to start tracking your progress!
            </p>
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 py-3 px-7 font-semibold text-white rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)" }}
            >
              <i className="fas fa-circle-question"></i>
              Take a Quiz
            </button>
          </div>
        )}

        {attempts.length > 0 && (
          <>
            {/* Stats Cards */}
            <div className="flex flex-wrap gap-4 mb-8">
              <StatCard
                icon="fa-list-check"
                label="Total Quizzes"
                value={stats.total_attempts}
                sub="attempts recorded"
                color="#6366f1"
              />
              <StatCard
                icon="fa-star"
                label="Best Score"
                value={`${stats.best_score}/5`}
                sub="highest in one quiz"
                color="#f59e0b"
              />
              <StatCard
                icon="fa-chart-bar"
                label="Average Score"
                value={`${stats.average_score}/5`}
                sub={`${stats.average_percentage}% avg accuracy`}
                color="#10b981"
              />
              <StatCard
                icon="fa-trophy"
                label="Avg Accuracy"
                value={`${stats.average_percentage}%`}
                sub={stats.average_percentage >= 70 ? "Great performance!" : "Keep practicing!"}
                color={getScoreColor(stats.average_percentage)}
              />
            </div>

            {/* Chart */}
            {chartData.length > 1 && (
              <div
                className="rounded-2xl border bg-[var(--bg-secondary)] p-6 mb-8"
                style={{ borderColor: "var(--border-custom)", boxShadow: "var(--shadow-sm)" }}
              >
                <h2
                  className="text-lg font-semibold text-[var(--text-primary)] mb-5"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <i
                    className="fas fa-wave-square mr-2"
                    style={{ color: "#6366f1" }}
                  ></i>
                  Score History
                </h2>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis
                      dataKey="attempt"
                      tick={{ fill: textColor, fontSize: 12 }}
                      tickLine={false}
                      axisLine={{ stroke: gridColor }}
                    />
                    <YAxis
                      domain={[0, 5]}
                      ticks={[0, 1, 2, 3, 4, 5]}
                      tick={{ fill: textColor, fontSize: 12 }}
                      tickLine={false}
                      axisLine={{ stroke: gridColor }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: isDark ? "#1e293b" : "#ffffff",
                        border: `1px solid ${gridColor}`,
                        borderRadius: 12,
                        fontSize: 13,
                        color: isDark ? "#f8fafc" : "#0f172a",
                      }}
                      formatter={(value: number) => [`${value}/5`, "Score"]}
                      labelFormatter={(label: string) => `Attempt ${label}`}
                    />
                    <ReferenceLine y={3} stroke="#f59e0b" strokeDasharray="4 4" />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#6366f1"
                      strokeWidth={3}
                      dot={{ fill: "#6366f1", strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 7, fill: "#818cf8" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-xs text-center text-[var(--text-muted)] mt-2">
                  Dashed line = 3/5 benchmark
                </p>
              </div>
            )}

            {/* Attempts Table */}
            <div
              className="rounded-2xl border bg-[var(--bg-secondary)] overflow-hidden"
              style={{ borderColor: "var(--border-custom)", boxShadow: "var(--shadow-sm)" }}
            >
              <div className="px-6 py-4 border-b" style={{ borderColor: "var(--border-custom)" }}>
                <h2
                  className="text-lg font-semibold text-[var(--text-primary)]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <i className="fas fa-clock-rotate-left mr-2" style={{ color: "#6366f1" }}></i>
                  Attempt History
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Click any row to review questions & answers
                </p>
              </div>

              <div className="divide-y" style={{ borderColor: "var(--border-custom)" }}>
                {attempts.map((attempt) => {
                  const isExpanded = expandedId === attempt.id;
                  return (
                    <div key={attempt.id}>
                      {/* Row */}
                      <button
                        type="button"
                        className="w-full text-left px-6 py-4 flex items-center gap-4 transition-all duration-150 hover:bg-[var(--bg-tertiary)]"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : attempt.id)
                        }
                      >
                        {/* Date */}
                        <div className="flex-shrink-0 w-24 text-center">
                          <p className="text-xs font-semibold text-[var(--text-primary)]">
                            {formatDate(attempt.created_at)}
                          </p>
                          <p className="text-[10px] text-[var(--text-muted)]">
                            {formatTime(attempt.created_at)}
                          </p>
                        </div>

                        {/* Query */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                            {attempt.query}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] mt-0.5">
                            {attempt.total_questions} questions
                          </p>
                        </div>

                        {/* Score badge */}
                        <div className="flex-shrink-0 flex items-center gap-3">
                          <span style={getBadgeStyle(attempt.percentage)}>
                            {attempt.score}/{attempt.total_questions}
                          </span>
                          <span className="text-xs" style={{ color: getScoreColor(attempt.percentage) }}>
                            {attempt.percentage}%
                          </span>
                          <i
                            className={`fas ${isExpanded ? "fa-chevron-up" : "fa-chevron-down"} text-xs`}
                            style={{ color: "var(--text-muted)" }}
                          ></i>
                        </div>
                      </button>

                      {/* Expanded review */}
                      {isExpanded && attempt.quiz_data && (
                        <div
                          className="px-6 pb-6"
                          style={{ background: "var(--bg-tertiary)" }}
                        >
                          <div className="flex flex-col gap-3 pt-4">
                            {attempt.quiz_data.map((item, qi) => (
                              <div
                                key={qi}
                                className="rounded-xl border p-4 bg-[var(--bg-secondary)]"
                                style={{ borderColor: "var(--border-custom)" }}
                              >
                                <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                                  <span
                                    className="inline-flex items-center justify-center w-5 h-5 rounded-md text-white text-[10px] font-bold mr-2"
                                    style={{ background: "#6366f1" }}
                                  >
                                    {qi + 1}
                                  </span>
                                  {item.question}
                                </p>
                                <div className="flex flex-col gap-1 ml-7 mb-3">
                                  {item.options.map((opt, oi) => (
                                    <span
                                      key={oi}
                                      className="text-xs px-3 py-1.5 rounded-lg inline-block"
                                      style={{
                                        background:
                                          opt === item.correct_answer
                                            ? "rgba(16,185,129,0.1)"
                                            : "transparent",
                                        color:
                                          opt === item.correct_answer
                                            ? "#10b981"
                                            : "var(--text-secondary)",
                                        border:
                                          opt === item.correct_answer
                                            ? "1px solid rgba(16,185,129,0.3)"
                                            : "1px solid transparent",
                                        fontWeight:
                                          opt === item.correct_answer ? 600 : 400,
                                      }}
                                    >
                                      {opt === item.correct_answer && "✓ "}
                                      {opt}
                                    </span>
                                  ))}
                                </div>
                                <p
                                  className="text-xs ml-7 text-[var(--text-secondary)] leading-relaxed px-3 py-2 rounded-lg"
                                  style={{ background: "var(--bg-tertiary)" }}
                                >
                                  <i
                                    className="fas fa-lightbulb mr-1"
                                    style={{ color: "#f59e0b" }}
                                  ></i>
                                  {item.explanation}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
