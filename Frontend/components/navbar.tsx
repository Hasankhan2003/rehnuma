"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface NavbarProps {
  theme: "light" | "dark"
  onToggleTheme: () => void
  onShowToast: (message: string, type: "success" | "error" | "info") => void
  // Auth props — username shown in navbar, onLogout clears session
  username?: string | null
  onLogout?: () => void
}

export function Navbar({ theme, onToggleTheme, onShowToast, username, onLogout }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleDashboard = () => {
    router.push("/dashboard")
  }

  // Logout: clear storage, redirect to /auth
  const handleLogout = () => {
    localStorage.removeItem("rehnuma_token")
    localStorage.removeItem("rehnuma_user")
    if (onLogout) onLogout()
    router.replace("/auth")
  }

  return (
    <nav
      className="fixed top-0 w-full z-[1000] border-b border-[var(--border-light)] transition-all duration-300"
      style={{
        background: theme === "dark" ? "rgba(15, 23, 42, 0.9)" : "#f1f5f9",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex justify-between items-center px-6 py-4 max-w-full mx-auto">
        {/* Logo */}
        <div>
          <h1
            className="text-[1.75rem] font-bold m-0 cursor-pointer bg-gradient-to-r from-[var(--rehnuma-primary)] to-[var(--rehnuma-primary-light)] bg-clip-text antialiased"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textRendering: "optimizeLegibility",
              letterSpacing: "-0.01em",
            }}
            onClick={() => window.location.reload()}
          >
            Rehnuma
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <button
            className="p-3 bg-transparent text-[var(--text-secondary)] border border-transparent rounded-xl transition-all duration-200 hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
            onClick={handleDashboard}
            aria-label="View Dashboard"
            title="Dashboard"
          >
            <i className="fas fa-chart-line text-base"></i>
          </button>

          <button
            className="p-3 bg-transparent text-[var(--text-secondary)] border border-transparent rounded-xl transition-all duration-200 hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
            onClick={onToggleTheme}
            aria-label="Toggle Theme"
          >
            <i className={`fas ${theme === "light" ? "fa-moon" : "fa-sun"} text-base`}></i>
          </button>

          {/* User greeting + Logout (shown when logged in) */}
          {username ? (
            <div className="flex items-center gap-2">
              <span style={{
                fontSize: "0.82rem", fontWeight: 600,
                color: "var(--text-secondary)",
                padding: "0.35rem 0.7rem",
                background: "var(--bg-tertiary)",
                borderRadius: 8,
                border: "1px solid var(--border-light)",
              }}>
                👤 {username}
              </span>
              <button
                onClick={handleLogout}
                aria-label="Logout"
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "0.4rem 0.85rem",
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: 9,
                  color: "#ef4444",
                  fontWeight: 600, fontSize: "0.82rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <i className="fas fa-right-from-bracket text-sm"></i>
                Logout
              </button>
            </div>
          ) : (
            <button
              className="p-3 bg-transparent text-[var(--text-secondary)] border border-transparent rounded-xl transition-all duration-200 hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
              onClick={() => router.push("/auth")}
              aria-label="Sign In"
            >
              <i className="fas fa-user text-base"></i>
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-3 bg-transparent text-[var(--text-secondary)] border border-transparent rounded-xl transition-all duration-200 hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
          onClick={toggleMobileMenu}
          aria-label="Toggle Menu"
        >
          <i className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"} text-base`}></i>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden py-4 border-t border-[var(--border-light)] bg-[var(--bg-secondary)] rounded-b-2xl shadow-lg animate-slide-down">
          <div className="flex flex-col gap-2 px-6">
            <button
              className="flex items-center justify-start gap-2 p-3 bg-transparent text-[var(--text-secondary)] border border-transparent rounded-xl transition-all duration-200 hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
              onClick={handleDashboard}
            >
              <i className="fas fa-chart-line"></i>
              <span>Dashboard</span>
            </button>
            <button
              className="flex items-center justify-start gap-2 p-3 bg-transparent text-[var(--text-secondary)] border border-transparent rounded-xl transition-all duration-200 hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
              onClick={onToggleTheme}
            >
              <i className={`fas ${theme === "light" ? "fa-moon" : "fa-sun"}`}></i>
              <span>Toggle Theme</span>
            </button>
            {username ? (
              <button
                onClick={handleLogout}
                className="flex items-center justify-start gap-2 p-3 rounded-xl transition-all duration-200"
                style={{ color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "none", cursor: "pointer" }}
              >
                <i className="fas fa-right-from-bracket"></i>
                <span>Logout ({username})</span>
              </button>
            ) : (
              <button
                className="flex items-center justify-start gap-2 p-3 bg-transparent text-[var(--text-secondary)] border border-transparent rounded-xl transition-all duration-200 hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
                onClick={() => router.push("/auth")}
              >
                <i className="fas fa-user"></i>
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
