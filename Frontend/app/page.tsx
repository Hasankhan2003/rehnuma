"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { InputSection } from "@/components/input-section";
import { SolutionSection } from "@/components/solution-section";
import { VideoSection } from "@/components/video-section";
import { QuizSection } from "@/components/quiz-section";
import { Footer } from "@/components/footer";
import { Toast } from "@/components/toast";
import type { QuizItem } from "@/lib/groq";

interface Source {
  topic: string;
  problem: string;
}

interface ToastState {
  visible: boolean;
  message: string;
  type: "success" | "error" | "info";
}

interface AuthUser {
  id: number;
  username: string;
  email: string;
}

export default function Home() {
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auth state
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Solution state
  const [showSolution, setShowSolution] = useState(false);
  const [solutionLoading, setSolutionLoading] = useState(false);
  const [solutionError, setSolutionError] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [processingTime, setProcessingTime] = useState<string | null>(null);
  const [sources, setSources] = useState<Source[]>([]);

  // Video state
  const [showVideo, setShowVideo] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoProcessingTime, setVideoProcessingTime] = useState<string | null>(null);
  const [videoAttempts, setVideoAttempts] = useState(1);
  const [animationId, setAnimationId] = useState<string | null>(null);

  // Quiz state
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [quizData, setQuizData] = useState<QuizItem[] | null>(null);
  const [quizResult, setQuizResult] = useState<{ score: number; total: number; percentage: number; breakdown: { question: string; user_answer: string; correct_answer: string; correct: boolean; explanation: string }[] } | null>(null);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
  const [quizQuery, setQuizQuery] = useState<string>("");

  // Solution buffer for animation-first workflow
  const [bufferedSolution, setBufferedSolution] = useState<{
    answer: string;
    processing_time: string;
    sources: Source[];
  } | null>(null);

  const [originalQuery, setOriginalQuery] = useState<string>("");

  // Toast state
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: "",
    type: "success",
  });

  // ── Auth Gate ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }

    const token = localStorage.getItem("rehnuma_token");
    if (!token) {
      // No token — redirect to login
      router.replace("/auth");
      return;
    }

    // Validate token via /api/auth/me
    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) {
          // Token invalid/expired — clear and redirect
          localStorage.removeItem("rehnuma_token");
          localStorage.removeItem("rehnuma_user");
          router.replace("/auth");
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (data?.user) setAuthUser(data.user);
        setAuthChecked(true);
      })
      .catch(() => {
        localStorage.removeItem("rehnuma_token");
        router.replace("/auth");
      });
  }, [router]);

  // ── Helpers ─────────────────────────────────────────────────────────────────

  /** Returns the stored JWT for use in fetch headers */
  const getAuthHeaders = useCallback((): HeadersInit => {
    const token = localStorage.getItem("rehnuma_token") || "";
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    showToast(`Switched to ${newTheme} theme`, "success");
  };

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info") => {
      setToast({ visible: true, message, type });
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  const scrollToInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
    document.querySelector(".input-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const isErrorText = (text: string): boolean => {
    const errorPatterns = [/manim/i, /stdout/i, /stderr/i, /execution error/i, /traceback/i, /exception/i, /\bError:/i, /Failed to/i];
    return errorPatterns.some((pattern) => pattern.test(text));
  };

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (query: string) => {
    if (isErrorText(query)) {
      showToast("Cannot generate solution from error text. Please enter a valid probability question.", "error");
      return;
    }
    setOriginalQuery(query);
    setShowSolution(true);
    setShowVideo(false);
    setSolutionLoading(true);
    setSolutionError(null);
    setAnswer(null);
    setSources([]);
    setBufferedSolution(null);

    setTimeout(() => {
      document.getElementById("solution-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    try {
      const response = await fetch("/api/generate-solution", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate solution");
      setAnswer(data.answer);
      setProcessingTime(data.processing_time);
      setSources(data.sources || []);
      showToast("✨ Solution generated successfully!", "success");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred. Please try again.";
      setSolutionError(errorMessage);
      showToast("Error generating solution", "error");
    } finally {
      setSolutionLoading(false);
    }
  };

  const handleGenerateAnimation = async (query: string) => {
    if (isErrorText(query)) {
      showToast("Cannot generate animation from error text. Please enter a valid probability question.", "error");
      return;
    }
    setOriginalQuery(query);
    setShowVideo(true);
    setShowSolution(false);
    setVideoLoading(true);
    setVideoError(null);
    setVideoUrl(null);
    setBufferedSolution(null);

    setTimeout(() => {
      document.getElementById("video-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    try {
      const response = await fetch("/api/generate-animation", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || "Failed to generate animation");

      setVideoUrl(data.video_url);
      setVideoProcessingTime(data.processing_time);
      setVideoAttempts(data.attempts || 1);
      setAnimationId(data.animation_id);

      if (data.solution) {
        setBufferedSolution({ answer: data.solution.answer, processing_time: data.solution.processing_time, sources: data.solution.sources || [] });
      }

      if (data.fixed_errors && data.fixed_errors.length > 0) {
        showToast(`🎬 Animation generated! (${data.fixed_errors.length} error${data.fixed_errors.length > 1 ? "s" : ""} auto-fixed)`, "success");
      } else {
        showToast("🎬 Animation generated successfully!", "success");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred while generating the animation. Please try again.";
      setVideoError(errorMessage);
      showToast("Error generating animation", "error");
    } finally {
      setVideoLoading(false);
    }
  };

  const handleShowSolutionFromVideo = async () => {
    setShowVideo(false);
    setShowSolution(true);

    if (bufferedSolution) {
      setAnswer(bufferedSolution.answer);
      setProcessingTime(bufferedSolution.processing_time);
      setSources(bufferedSolution.sources);
      setSolutionError(null);
    } else if (originalQuery) {
      setSolutionLoading(true);
      setSolutionError(null);
      setAnswer(null);
      setSources([]);

      try {
        const response = await fetch("/api/generate-solution", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ query: originalQuery }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to generate solution");
        setAnswer(data.answer);
        setProcessingTime(data.processing_time);
        setSources(data.sources || []);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred. Please try again.";
        setSolutionError(errorMessage);
      } finally {
        setSolutionLoading(false);
      }
    }

    setTimeout(() => {
      document.getElementById("solution-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleGenerateQuiz = async (query: string, fresh = false) => {
    setOriginalQuery(query);
    setQuizQuery(query);
    setShowQuiz(true);
    setShowSolution(false);
    setShowVideo(false);
    setQuizLoading(true);
    setQuizError(null);
    setQuizData(null);
    setQuizResult(null);

    setTimeout(() => {
      document.getElementById("quiz-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ query, fresh }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate quiz");
      setQuizData(data.quiz);
      showToast(data.cached ? "📋 Quiz loaded from cache!" : "🧠 Quiz generated successfully!", "success");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate quiz. Please try again.";
      setQuizError(errorMessage);
      showToast("Error generating quiz", "error");
    } finally {
      setQuizLoading(false);
    }
  };

  const handleSubmitQuiz = async (answers: string[], quizItems: QuizItem[]) => {
    setIsSubmittingQuiz(true);
    try {
      const response = await fetch("/api/submit-quiz", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ query: quizQuery, answers, quiz_data: quizItems }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to submit quiz");
      setQuizResult(data);
      const emoji = data.percentage === 100 ? "🏆" : data.percentage >= 80 ? "🌟" : "📊";
      showToast(`${emoji} Score: ${data.score}/${data.total} (${data.percentage}%)`, "success");
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to submit quiz. Please try again.";
      showToast(errorMessage, "error");
      return null;
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  // Block render until auth is confirmed (avoids flash of main content)
  if (!authChecked) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--hero-bg)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 48, height: 48, border: "3px solid var(--border-custom)",
            borderTopColor: "var(--rehnuma-primary)", borderRadius: "50%",
            animation: "spin 0.8s linear infinite", margin: "0 auto 1rem",
          }} />
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onShowToast={showToast}
        username={authUser?.username}
        onLogout={() => setAuthUser(null)}
      />

      <main>
        <HeroSection onScrollToInput={scrollToInput} />

        <InputSection
          inputRef={inputRef}
          onSubmit={handleSubmit}
          onGenerateAnimation={handleGenerateAnimation}
          onGenerateQuiz={handleGenerateQuiz}
          onShowToast={showToast}
          isGenerating={solutionLoading}
          isAnimating={videoLoading}
          isQuizzing={quizLoading}
        />

        <SolutionSection
          visible={showSolution}
          loading={solutionLoading}
          error={solutionError}
          answer={answer}
          processingTime={processingTime}
          sources={sources}
          onScrollToInput={scrollToInput}
          onShowToast={showToast}
        />

        <VideoSection
          visible={showVideo}
          loading={videoLoading}
          error={videoError}
          videoUrl={videoUrl}
          processingTime={videoProcessingTime}
          attempts={videoAttempts}
          animationId={animationId}
          onScrollToInput={scrollToInput}
          onShowSolution={handleShowSolutionFromVideo}
          onShowToast={showToast}
        />

        <QuizSection
          visible={showQuiz}
          loading={quizLoading}
          error={quizError}
          quiz={quizData}
          query={quizQuery}
          onSubmit={handleSubmitQuiz}
          onRegenerate={() => handleGenerateQuiz(quizQuery, true)}
          onShowToast={showToast}
          isSubmitting={isSubmittingQuiz}
          result={quizResult}
        />
      </main>

      <Footer />

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={hideToast}
      />
    </>
  );
}
