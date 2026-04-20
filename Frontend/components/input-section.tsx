"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";

interface InputSectionProps {
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  onSubmit: (query: string) => void;
  onGenerateAnimation: (query: string) => void;
  onGenerateQuiz: (query: string) => void;
  onShowToast: (message: string, type: "success" | "error" | "info") => void;
  isGenerating: boolean;
  isAnimating: boolean;
  isQuizzing: boolean;
}

const exampleQuestions = [
  { label: "Bayes Theorem", query: "Explain Bayes theorem with an example" },
  {
    label: "Binomial Distribution",
    query: "Calculate binomial probability for n=10, p=0.3, X=5",
  },
  {
    label: "Central Limit Theorem",
    query: "What is the central limit theorem?",
  },
  { label: "Confidence Intervals", query: "Explain confidence intervals" },
];

export function InputSection({
  inputRef,
  onSubmit,
  onGenerateAnimation,
  onGenerateQuiz,
  onShowToast,
  isGenerating,
  isAnimating,
  isQuizzing,
}: InputSectionProps) {
  const [query, setQuery] = useState("");
  const sectionRef = useRef<HTMLElement>(null);

  // Validate that query is not error text
  const isErrorText = (text: string): boolean => {
    const errorPatterns = [
      /manim/i,
      /stdout/i,
      /stderr/i,
      /execution error/i,
      /traceback/i,
      /exception/i,
      /\bError:/i,
      /Failed to/i,
    ];
    return errorPatterns.some((pattern) => pattern.test(text));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      onShowToast("Please enter a question", "error");
      return;
    }
    if (isErrorText(query.trim())) {
      onShowToast(
        "Please enter a valid probability question, not error text",
        "error"
      );
      return;
    }
    onSubmit(query.trim());
  };

  const handleAnimationClick = () => {
    if (!query.trim()) {
      onShowToast("Please enter a question first", "error");
      return;
    }
    if (isErrorText(query.trim())) {
      onShowToast(
        "Please enter a valid probability question, not error text",
        "error"
      );
      return;
    }
    onGenerateAnimation(query.trim());
  };

  const handleQuizClick = () => {
    if (!query.trim()) {
      onShowToast("Please enter a question first", "error");
      return;
    }
    if (isErrorText(query.trim())) {
      onShowToast(
        "Please enter a valid probability question, not error text",
        "error"
      );
      return;
    }
    onGenerateQuiz(query.trim());
  };

  const fillExample = (text: string) => {
    setQuery(text);
    inputRef.current?.focus();
    onShowToast("Example loaded successfully", "success");
  };

  const clearInput = () => {
    setQuery("");
    inputRef.current?.focus();
    onShowToast("Input cleared", "info");
  };

  // Auto-focus when section becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              inputRef.current?.focus();
            }, 500);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [inputRef]);

  return (
    <section
      ref={sectionRef}
      className="input-section bg-[var(--bg-primary)] h-screen flex flex-col justify-center pt-16"
    >
      <div className="container max-w-[1200px] mx-auto px-6">
        <div className="max-w-[1000px] mx-auto">
          {/* Input Card */}
          <form onSubmit={handleSubmit}>
            <div
              className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-custom)] p-8 mb-8 transition-all duration-200"
              style={{ boxShadow: "var(--shadow-sm)" }}
            >
              {/* Section Header */}
              <div className="text-center mb-6">
                <h3
                  className="text-[1.5rem] font-semibold mb-2 text-[var(--text-primary)]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  What problem would you like to solve?
                </h3>
                <p className="text-[var(--text-secondary)] m-0">
                  Ask anything about probability and statistics
                </p>
              </div>

              {/* Textarea Input */}
              <div className="mb-6">
                <textarea
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full py-4 px-5 border border-[var(--border-custom)] rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] font-sans text-[0.95rem] transition-all duration-200 resize-y outline-none min-h-[100px] leading-relaxed"
                  style={{ boxShadow: "var(--shadow-sm)" }}
                  rows={4}
                  placeholder="E.g., Explain Bayes' theorem with an example, or calculate P(X=5) for binomial distribution with n=10, p=0.3"
                  aria-describedby="input-help"
                  required
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--rehnuma-primary)";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgb(99 102 241 / 0.1), var(--shadow)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border-custom)";
                    e.target.style.boxShadow = "var(--shadow-sm)";
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 items-center flex-wrap">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 py-4 px-6 font-semibold text-white rounded-xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{
                    background: "var(--gradient-primary)",
                    boxShadow: "var(--shadow)",
                  }}
                >
                  <i
                    className={`fas ${
                      isGenerating
                        ? "fa-spinner fa-spin"
                        : "fa-wand-magic-sparkles"
                    }`}
                  ></i>
                  <span>
                    {isGenerating ? "Generating..." : "Generate Solution"}
                  </span>
                </button>
                <button
                  type="button"
                  disabled={isAnimating}
                  onClick={handleAnimationClick}
                  className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 py-4 px-6 font-semibold text-white rounded-xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{
                    background: "var(--gradient-secondary)",
                    boxShadow: "var(--shadow)",
                  }}
                >
                  <i
                    className={`fas ${
                      isAnimating ? "fa-spinner fa-spin" : "fa-film"
                    }`}
                  ></i>
                  <span>
                    {isAnimating
                      ? "Generating (Auto-retry on errors)..."
                      : "Generate Animation"}
                  </span>
                </button>
                <button
                  type="button"
                  disabled={isQuizzing}
                  onClick={handleQuizClick}
                  className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 py-4 px-6 font-semibold text-white rounded-xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
                    boxShadow: "var(--shadow)",
                  }}
                >
                  <i
                    className={`fas ${
                      isQuizzing ? "fa-spinner fa-spin" : "fa-circle-question"
                    }`}
                  ></i>
                  <span>
                    {isQuizzing ? "Generating Quiz..." : "Generate Quiz"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={clearInput}
                  className="inline-flex items-center justify-center gap-2 py-4 px-6 font-medium text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--border-custom)] rounded-xl cursor-pointer transition-all duration-200 hover:bg-[var(--bg-tertiary)] hover:-translate-y-0.5"
                  style={{ boxShadow: "var(--shadow-sm)" }}
                >
                  <i className="fas fa-eraser"></i>
                  Clear
                </button>
              </div>
            </div>
          </form>

          {/* Quick Examples */}
          <div className="text-center">
            <p className="font-medium text-[var(--text-secondary)] mb-4 text-[0.9rem]">
              Try these example questions:
            </p>
            <div className="flex gap-3 flex-wrap justify-center">
              {exampleQuestions.map((example) => (
                <button
                  key={example.label}
                  onClick={() => fillExample(example.query)}
                  className="text-[0.85rem] py-2 px-4 rounded-full bg-transparent text-[var(--text-secondary)] border border-transparent transition-all duration-200 hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
                >
                  {example.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
