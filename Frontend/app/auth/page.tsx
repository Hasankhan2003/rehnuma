/**
 * app/auth/page.tsx — Login / Signup Page
 * Styled to match the Rehnuma main page theme.
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type AuthMode = "login" | "signup";

interface FormState {
  username: string;
  email: string;
  password: string;
}

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [form, setForm] = useState<FormState>({ username: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Read saved theme
  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle("dark", saved === "dark");
    }
    // If already logged in, go straight to main page
    const token = localStorage.getItem("rehnuma_token");
    if (token) {
      fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => { if (r.ok) router.replace("/"); })
        .catch(() => {});
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const switchMode = (m: AuthMode) => {
    setMode(m);
    setError(null);
    setSuccess(null);
    setForm({ username: "", email: "", password: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        // --- SIGNUP ---
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: form.username, email: form.email, password: form.password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Signup failed.");
        setSuccess("Account created! Logging you in...");
        // Auto-login after signup
        const loginRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
        const loginData = await loginRes.json();
        if (!loginRes.ok) throw new Error(loginData.error || "Login failed.");
        localStorage.setItem("rehnuma_token", loginData.token);
        localStorage.setItem("rehnuma_user", JSON.stringify(loginData.user));
        router.replace("/");
      } else {
        // --- LOGIN ---
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed.");
        localStorage.setItem("rehnuma_token", data.token);
        localStorage.setItem("rehnuma_user", JSON.stringify(data.user));
        router.replace("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--hero-bg)" }}>
      {/* Minimal Navbar */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1rem 2rem",
        background: "var(--nav-bg)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-custom)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--rehnuma-primary), var(--rehnuma-secondary))",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem" }}>R</span>
          </div>
          <span style={{ fontFamily: "var(--font-heading, Space Grotesk, sans-serif)", fontWeight: 700, fontSize: "1.2rem", color: "var(--text-primary)" }}>
            Rehnuma
          </span>
        </div>
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{
            background: "none", border: "1px solid var(--border-custom)",
            borderRadius: 8, padding: "0.4rem 0.75rem", cursor: "pointer",
            color: "var(--text-secondary)", fontSize: "0.85rem",
            transition: "all 0.2s",
          }}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </nav>

      {/* Auth Card */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
        {/* Decorative background blobs */}
        <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
          <div style={{
            position: "absolute", top: "-10%", right: "-5%",
            width: 400, height: 400, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
            animation: "float 8s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", bottom: "-10%", left: "-5%",
            width: 350, height: 350, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)",
            animation: "float 10s ease-in-out infinite 2s",
          }} />
        </div>

        <div style={{
          position: "relative", zIndex: 1,
          width: "100%", maxWidth: 440,
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-custom)",
          borderRadius: 20,
          boxShadow: "var(--shadow-xl)",
          padding: "2.5rem",
          backdropFilter: "blur(16px)",
          animation: "fadeInUp 0.5s ease-out",
        }}>

          {/* Logo + Title */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%", margin: "0 auto 1rem",
              background: "linear-gradient(135deg, var(--rehnuma-primary), var(--rehnuma-secondary))",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 24px rgba(99,102,241,0.35)",
            }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.4rem" }}>R</span>
            </div>
            <h1 style={{
              fontFamily: "var(--font-heading, Space Grotesk, sans-serif)",
              fontSize: "1.6rem", fontWeight: 700,
              color: "var(--text-primary)", margin: "0 0 0.25rem",
            }}>
              Welcome to Rehnuma
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: 0 }}>
              Your AI-powered statistics tutor
            </p>
          </div>

          {/* Tab Switch */}
          <div style={{
            display: "flex", background: "var(--bg-tertiary)",
            borderRadius: 10, padding: 4, marginBottom: "1.75rem",
            border: "1px solid var(--border-light)",
          }}>
            {(["login", "signup"] as AuthMode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                style={{
                  flex: 1, padding: "0.55rem", border: "none", cursor: "pointer",
                  borderRadius: 7, fontWeight: 600, fontSize: "0.9rem",
                  transition: "all 0.25s ease",
                  background: mode === m
                    ? "linear-gradient(135deg, var(--rehnuma-primary), var(--rehnuma-primary-light))"
                    : "transparent",
                  color: mode === m ? "#fff" : "var(--text-secondary)",
                  boxShadow: mode === m ? "0 2px 8px rgba(99,102,241,0.3)" : "none",
                }}
              >
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {mode === "signup" && (
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
                  Username
                </label>
                <input
                  type="text" name="username" value={form.username}
                  onChange={handleChange} required
                  placeholder="e.g. john_doe"
                  style={inputStyle}
                />
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
                Email Address
              </label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} required
                placeholder="you@example.com"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password" name="password" value={form.password}
                onChange={handleChange} required
                placeholder={mode === "signup" ? "At least 6 characters" : "Enter your password"}
                style={inputStyle}
              />
            </div>

            {/* Error / Success messages */}
            {error && (
              <div style={{
                padding: "0.75rem 1rem", borderRadius: 8,
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                color: "#ef4444", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 8,
              }}>
                <span>⚠️</span> {error}
              </div>
            )}
            {success && (
              <div style={{
                padding: "0.75rem 1rem", borderRadius: 8,
                background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
                color: "#10b981", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 8,
              }}>
                <span>✅</span> {success}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              style={{
                padding: "0.8rem", borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer",
                background: loading
                  ? "var(--border-custom)"
                  : "linear-gradient(135deg, var(--rehnuma-primary), var(--rehnuma-primary-light))",
                color: loading ? "var(--text-muted)" : "#fff",
                fontWeight: 700, fontSize: "0.95rem",
                boxShadow: loading ? "none" : "0 4px 15px rgba(99,102,241,0.4)",
                transition: "all 0.2s ease",
                marginTop: 4,
              }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={{
                    width: 16, height: 16, border: "2px solid var(--text-muted)",
                    borderTopColor: "transparent", borderRadius: "50%",
                    animation: "spin 0.8s linear infinite", display: "inline-block",
                  }} />
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </span>
              ) : (
                mode === "login" ? "Sign In →" : "Create Account →"
              )}
            </button>
          </form>

          {/* Footer hint */}
          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.82rem", color: "var(--text-muted)" }}>
            {mode === "login" ? (
              <>Don&apos;t have an account?{" "}
                <button onClick={() => switchMode("signup")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--rehnuma-primary)", fontWeight: 600, padding: 0 }}>
                  Sign up free
                </button>
              </>
            ) : (
              <>Already have an account?{" "}
                <button onClick={() => switchMode("login")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--rehnuma-primary)", fontWeight: 600, padding: 0 }}>
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </main>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.7rem 0.9rem",
  borderRadius: 9,
  border: "1px solid var(--border-custom)",
  background: "var(--bg-tertiary)",
  color: "var(--text-primary)",
  fontSize: "0.9rem",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s, box-shadow 0.2s",
};
