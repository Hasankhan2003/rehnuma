"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  visible: boolean;
  onClose: () => void;
}

export function Toast({ message, type, visible, onClose }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const timeout = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  const config = {
    success: {
      icon: "fas fa-check",
      bgColor: "var(--rehnuma-accent)",
    },
    error: {
      icon: "fas fa-exclamation-triangle",
      bgColor: "var(--rehnuma-secondary)",
    },
    info: {
      icon: "fas fa-info-circle",
      bgColor: "var(--rehnuma-primary)",
    },
  };

  const { icon, bgColor } = config[type];

  return (
    <div
      className="
        fixed left-1/2 -translate-x-1/2 z-[9999]
        bg-[var(--bg-secondary)] text-[var(--text-primary)]
        py-4 px-5 rounded-2xl
        animate-toast-from-top
      "
      style={{
        top: "0px",
        boxShadow: "var(--shadow-xl)",
        border: "1px solid var(--border-custom)",
        minWidth: "280px",
        maxWidth: "450px",
      }}
    >
      <div className="flex items-center gap-3 relative">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: bgColor }}
        >
          <i className={`${icon} text-[0.9rem] text-white`}></i>
        </div>

        <span className="text-[0.9rem] leading-[1.4] flex-1">{message}</span>

        <button
          onClick={onClose}
          className="
            bg-transparent border-none text-[var(--text-muted)]
            cursor-pointer p-1 rounded flex items-center justify-center ml-2
            transition-all duration-200 opacity-70 hover:opacity-100 hover:bg-[var(--bg-tertiary)]
          "
          aria-label="Close notification"
        >
          <i className="fas fa-times text-[0.8rem]"></i>
        </button>
      </div>
    </div>
  );
}
