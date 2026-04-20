import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from datetime import datetime

# -----------------------------
# Data (Actual vs Ideal Timeline)
# -----------------------------
tasks = [
    "Audio Sync Component",
    "API Integration",
    "Manim Animation Module",
    "Model Development",
    "System Design",
    "Requirement Analysis"
]

# Ideal timeline (task completion milestones)
ideal_dates = [
    "2025-09-08",  # Requirement Analysis
    "2025-09-15",  # System Design
    "2025-10-15",  # Model Development
    "2025-11-10",  # Manim Animation Module
    "2025-11-25",  # API Integration
    "2025-12-01"   # Audio Sync Component
]

# Actual timeline (task completion milestones)
actual_dates = [
    "2025-09-10",  # Requirement Analysis
    "2025-10-07",  # System Design
    "2025-11-15",  # Model Development
    "2025-12-01",  # Manim Animation Module
    "2025-12-07",  # API Integration
    "2025-12-12"   # Audio Sync Component
]

# Convert to datetime and reverse to match task order
ideal_dt = [datetime.strptime(d, "%Y-%m-%d") for d in ideal_dates][::-1]
actual_dt = [datetime.strptime(d, "%Y-%m-%d") for d in actual_dates][::-1]

# Task indices for y-axis (reversed order)
task_indices = list(range(len(tasks)))

# -----------------------------
# Plot
# -----------------------------
fig, ax = plt.subplots(figsize=(14, 8))

# Plot Ideal Line (dashed)
ax.plot(ideal_dt, task_indices, linestyle="--", linewidth=3,
        color="#2E86AB", marker="o", markersize=8,
        label="Ideal Timeline", alpha=0.8)

# Plot Actual Line (solid)
ax.plot(actual_dt, task_indices, linestyle="-", linewidth=3,
        color="#A23B72", marker="s", markersize=8,
        label="Actual Timeline", alpha=0.9)

# Formatting
ax.set_yticks(task_indices)
ax.set_yticklabels(tasks, fontsize=12)
ax.set_ylabel("Project Phases", fontsize=13, fontweight="bold")

ax.set_title("Project Timeline: Ideal vs Actual Progress\nIteration 1 & 2",
             fontsize=16, fontweight="bold", pad=20)
ax.set_xlabel("Timeline (2025)", fontsize=13, fontweight="bold")

# Improve date formatting
ax.xaxis.set_major_formatter(mdates.DateFormatter("%b %d"))
ax.xaxis.set_major_locator(mdates.WeekdayLocator(interval=2))
plt.xticks(rotation=45, ha="right")

# Grid and legend
plt.grid(axis="both", linestyle=":", alpha=0.4)
ax.legend(loc="upper right", fontsize=12, framealpha=0.9)

plt.tight_layout()
plt.show()
