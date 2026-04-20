"use client";

import { useState } from "react";
import type { QuizItem } from "@/lib/groq";

interface BreakdownItem {
  question: string;
  user_answer: string;
  correct_answer: string;
  correct: boolean;
  explanation: string;
}

interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  breakdown: BreakdownItem[];
}

interface QuizSectionProps {
  visible: boolean;
  loading: boolean;
  error: string | null;
  quiz: QuizItem[] | null;
  query: string;
  onSubmit: (answers: string[], quizData: QuizItem[]) => Promise<QuizResult | null>;
  onRegenerate: () => void;
  onShowToast: (message: string, type: "success" | "error" | "info") => void;
  isSubmitting: boolean;
  result: QuizResult | null;
}

export function QuizSection({
  visible,
  loading,
  error,
  quiz,
  query,
  onSubmit,
  onRegenerate,
  onShowToast,
  isSubmitting,
  result,
}: QuizSectionProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});

  if (!visible) return null;

  const allAnswered = quiz ? Object.keys(selectedAnswers).length === quiz.length : false;

  const handleSelect = (qIndex: number, option: string) => {
    if (result) return; // locked after submission
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmit = async () => {
    if (!quiz || !allAnswered) {
      onShowToast("Please answer all questions before submitting.", "error");
      return;
    }
    const answersArray = quiz.map((_, i) => selectedAnswers[i] ?? "");
    await onSubmit(answersArray, quiz);
  };

  const handleRegenerate = () => {
    setSelectedAnswers({});
    onRegenerate();
  };

  const getScoreColor = (pct: number) => {
    if (pct >= 80) return "#10b981";
    if (pct >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const getScoreEmoji = (pct: number) => {
    if (pct === 100) return "🏆";
    if (pct >= 80) return "🌟";
    if (pct >= 60) return "👍";
    if (pct >= 40) return "📚";
    return "💪";
  };

  const getScoreLabel = (pct: number) => {
    if (pct === 100) return "Perfect Score!";
    if (pct >= 80) return "Excellent!";
    if (pct >= 60) return "Good Job!";
    if (pct >= 40) return "Keep Practicing!";
    return "Don't Give Up!";
  };

  return (
    <section
      id="quiz-section"
      className="bg-[var(--bg-primary)] py-16"
      style={{ minHeight: "100vh" }}
    >
      <div className="container max-w-[900px] mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h2
              className="text-[1.75rem] font-bold text-[var(--text-primary)] mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <i className="fas fa-circle-question mr-3" style={{ color: "#10b981" }}></i>
              Knowledge Quiz
            </h2>
            {query && (
              <p className="text-[var(--text-secondary)] text-sm">
                Topic:{" "}
                <span className="font-medium text-[var(--text-primary)]">
                  {query.length > 80 ? query.substring(0, 80) + "…" : query}
                </span>
              </p>
            )}
          </div>
          <button
            onClick={handleRegenerate}
            disabled={loading || isSubmitting}
            className="inline-flex items-center gap-2 py-2.5 px-5 text-sm font-medium rounded-xl border border-[var(--border-custom)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-all duration-200 hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-arrows-rotate"></i>
            Regenerate Quiz
          </button>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="flex flex-col gap-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[var(--border-custom)] p-6 bg-[var(--bg-secondary)] animate-pulse"
              >
                <div className="h-4 bg-[var(--bg-tertiary)] rounded-lg w-3/4 mb-5"></div>
                {Array.from({ length: 4 }).map((_, j) => (
                  <div
                    key={j}
                    className="h-12 bg-[var(--bg-tertiary)] rounded-xl mb-3"
                  ></div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div
            className="rounded-2xl border p-6 text-center"
            style={{
              background: "rgba(239,68,68,0.05)",
              borderColor: "rgba(239,68,68,0.2)",
            }}
          >
            <i className="fas fa-circle-exclamation text-3xl mb-3" style={{ color: "#ef4444" }}></i>
            <p className="font-semibold text-[var(--text-primary)] mb-1">Quiz Generation Failed</p>
            <p className="text-[var(--text-secondary)] text-sm mb-4">{error}</p>
            <button
              onClick={handleRegenerate}
              className="inline-flex items-center gap-2 py-2.5 px-5 text-sm font-semibold text-white rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)" }}
            >
              <i className="fas fa-arrows-rotate"></i>
              Try Again
            </button>
          </div>
        )}

        {/* Result Summary Banner */}
        {result && (
          <div
            className="rounded-2xl p-6 mb-8 text-center animate-fade-in-up"
            style={{
              background: `linear-gradient(135deg, ${getScoreColor(result.percentage)}18 0%, ${getScoreColor(result.percentage)}08 100%)`,
              border: `2px solid ${getScoreColor(result.percentage)}40`,
            }}
          >
            <div
              className="text-6xl mb-3"
              style={{ lineHeight: 1.1 }}
            >
              {getScoreEmoji(result.percentage)}
            </div>
            <div
              className="text-4xl font-bold mb-1"
              style={{ color: getScoreColor(result.percentage), fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {result.score} / {result.total}
            </div>
            <div
              className="text-lg font-semibold mb-3"
              style={{ color: getScoreColor(result.percentage) }}
            >
              {getScoreLabel(result.percentage)} &mdash; {result.percentage}%
            </div>
            {/* Progress bar */}
            <div
              className="w-full max-w-xs mx-auto rounded-full overflow-hidden"
              style={{ height: 8, background: "var(--bg-tertiary)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${result.percentage}%`,
                  background: getScoreColor(result.percentage),
                }}
              ></div>
            </div>
            <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
              <button
                onClick={handleRegenerate}
                className="inline-flex items-center gap-2 py-2.5 px-5 text-sm font-semibold text-white rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)" }}
              >
                <i className="fas fa-arrows-rotate"></i>
                Try Another Quiz
              </button>
              <button
                onClick={() => window.location.assign("/dashboard")}
                className="inline-flex items-center gap-2 py-2.5 px-5 text-sm font-semibold rounded-xl border border-[var(--border-custom)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-all duration-200 hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
              >
                <i className="fas fa-chart-line"></i>
                View Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Questions */}
        {!loading && !error && quiz && (
          <div className="flex flex-col gap-5">
            {quiz.map((item, qIndex) => {
              const userAnswer = selectedAnswers[qIndex];
              const submitted = !!result;
              const breakdown = result?.breakdown[qIndex];

              return (
                <div
                  key={qIndex}
                  className="rounded-2xl border bg-[var(--bg-secondary)] p-6 transition-all duration-200 animate-fade-in-up"
                  style={{
                    borderColor: submitted
                      ? breakdown?.correct
                        ? "rgba(16,185,129,0.4)"
                        : "rgba(239,68,68,0.4)"
                      : "var(--border-custom)",
                    boxShadow: "var(--shadow-sm)",
                    animationDelay: `${qIndex * 60}ms`,
                  }}
                >
                  {/* Question header */}
                  <div className="flex items-start gap-3 mb-4">
                    <span
                      className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                      style={{ background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)" }}
                    >
                      {qIndex + 1}
                    </span>
                    <p className="font-semibold text-[var(--text-primary)] leading-relaxed flex-1">
                      {item.question}
                    </p>
                    {submitted && (
                      <span className="flex-shrink-0 text-xl">
                        {breakdown?.correct ? "✅" : "❌"}
                      </span>
                    )}
                  </div>

                  {/* Options */}
                  <div className="flex flex-col gap-2 ml-11">
                    {item.options.map((option, oIndex) => {
                      const isSelected = userAnswer === option;
                      const isCorrect = option === item.correct_answer;
                      const showCorrect = submitted && isCorrect;
                      const showWrong = submitted && isSelected && !isCorrect;

                      let borderColor = "var(--border-custom)";
                      let bgColor = "transparent";
                      let textColor = "var(--text-primary)";

                      if (showCorrect) {
                        borderColor = "#10b981";
                        bgColor = "rgba(16,185,129,0.08)";
                        textColor = "#10b981";
                      } else if (showWrong) {
                        borderColor = "#ef4444";
                        bgColor = "rgba(239,68,68,0.08)";
                        textColor = "#ef4444";
                      } else if (!submitted && isSelected) {
                        borderColor = "#10b981";
                        bgColor = "rgba(16,185,129,0.06)";
                      }

                      const optionLetters = ["A", "B", "C", "D"];

                      return (
                        <button
                          key={oIndex}
                          type="button"
                          onClick={() => handleSelect(qIndex, option)}
                          disabled={submitted}
                          className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer disabled:cursor-default"
                          style={{
                            borderColor,
                            background: bgColor,
                            color: textColor,
                          }}
                        >
                          <span
                            className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold border transition-all duration-200"
                            style={{
                              borderColor: showCorrect
                                ? "#10b981"
                                : showWrong
                                ? "#ef4444"
                                : !submitted && isSelected
                                ? "#10b981"
                                : "var(--border-custom)",
                              background: showCorrect
                                ? "#10b981"
                                : showWrong
                                ? "#ef4444"
                                : !submitted && isSelected
                                ? "#10b981"
                                : "transparent",
                              color:
                                showCorrect || showWrong || (!submitted && isSelected)
                                  ? "white"
                                  : "var(--text-secondary)",
                            }}
                          >
                            {optionLetters[oIndex]}
                          </span>
                          <span className="text-sm leading-relaxed">{option}</span>
                          {showCorrect && (
                            <span className="ml-auto text-xs font-semibold" style={{ color: "#10b981" }}>
                              Correct ✓
                            </span>
                          )}
                        </button>
                      );
                    })}

                    {/* Explanation (shown after submit) */}
                    {submitted && breakdown && (
                      <div
                        className="mt-3 px-4 py-3 rounded-xl text-sm leading-relaxed"
                        style={{
                          background: "var(--bg-tertiary)",
                          borderLeft: "3px solid #6366f1",
                        }}
                      >
                        <span className="font-semibold text-[var(--text-primary)]">
                          <i className="fas fa-lightbulb mr-1.5" style={{ color: "#f59e0b" }}></i>
                          Explanation:{" "}
                        </span>
                        <span className="text-[var(--text-secondary)]">{breakdown.explanation}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Submit button */}
            {!result && (
              <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                <p className="text-sm text-[var(--text-secondary)]">
                  {Object.keys(selectedAnswers).length} / {quiz.length} answered
                </p>
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered || isSubmitting}
                  className="inline-flex items-center gap-2 py-3.5 px-8 font-semibold text-white rounded-xl transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  style={{
                    background: allAnswered
                      ? "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)"
                      : "var(--bg-tertiary)",
                    color: allAnswered ? "white" : "var(--text-secondary)",
                    boxShadow: allAnswered ? "var(--shadow)" : "none",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      Submit Quiz
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
