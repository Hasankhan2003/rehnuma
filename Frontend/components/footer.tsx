"use client"

export function Footer() {
  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border)] pt-12 pb-8">
      <div className="container max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h3
              className="text-[1.5rem] font-bold mb-4 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Rehnuma
            </h3>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-6 text-[0.95rem]">
              Built with ❤️ for students who learn better through visualization. Transform complex mathematical concepts
              into beautiful, interactive animations.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4 text-[var(--text-primary)] text-base">About Us</h4>
            <div className="flex flex-col gap-3">
              <a
                href="#"
                className="text-[var(--text-secondary)] no-underline transition-colors duration-200 text-[0.9rem] hover:text-[var(--primary)]"
              >
                Documentation
              </a>
              <a
                href="#"
                className="text-[var(--text-secondary)] no-underline transition-colors duration-200 text-[0.9rem] hover:text-[var(--primary)]"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-[var(--text-secondary)] no-underline transition-colors duration-200 text-[0.9rem] hover:text-[var(--primary)]"
              >
                Terms of Service
              </a>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-[var(--text-primary)] text-base">Connect with Us</h4>
            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="#"
                className="text-[var(--text-muted)] text-[1.25rem] transition-all duration-200 hover:text-[var(--primary)] hover:-translate-y-0.5"
                aria-label="GitHub"
              >
                <i className="fab fa-github"></i>
              </a>
              <a
                href="#"
                className="text-[var(--text-muted)] text-[1.25rem] transition-all duration-200 hover:text-[var(--primary)] hover:-translate-y-0.5"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin"></i>
              </a>
              <a
                href="#"
                className="text-[var(--text-muted)] text-[1.25rem] transition-all duration-200 hover:text-[var(--primary)] hover:-translate-y-0.5"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
