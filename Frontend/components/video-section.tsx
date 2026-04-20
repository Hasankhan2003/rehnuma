"use client";

import { useRef } from "react";

interface VideoSectionProps {
  visible: boolean;
  loading: boolean;
  error: string | null;
  videoUrl: string | null;
  processingTime: string | null;
  attempts: number;
  animationId: string | null;
  onScrollToInput: () => void;
  onShowSolution: () => void;
  onShowToast: (message: string, type: "success" | "error" | "info") => void;
}

export function VideoSection({
  visible,
  loading,
  error,
  videoUrl,
  processingTime,
  attempts,
  animationId,
  onScrollToInput,
  onShowSolution,
  onShowToast,
}: VideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!visible) return null;

  const attemptsInfo = attempts > 1 ? ` (${attempts} attempts)` : "";

  return (
    <section
      id="video-section"
      className="bg-[var(--bg-primary)] min-h-screen flex flex-col pt-20 pb-8 animate-fade-in"
    >
      <div className="container max-w-[1100px] mx-auto px-6 flex-1 flex flex-col">
        <div className="max-w-[950px] mx-auto w-full flex-1 flex flex-col">
          {/* Section Header */}
          <div className="text-center mb-6 shrink-0">
            <h3
              className="text-[1.85rem] font-semibold mb-2 text-[var(--text-primary)]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Visual Animation <span className="text-[1.3rem]">🎬</span>
            </h3>
          </div>

          <div
            className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-custom)] p-8 mb-6 flex-1 flex flex-col"
            style={{
              boxShadow: "var(--shadow-sm)",
            }}
          >
            {/* Loading State */}
            {loading && (
              <div className="text-center py-16 flex-1 flex flex-col items-center justify-center">
                {/* Animated Squares Loader */}
                <div className="loadingspinner mb-8">
                  <div id="square1"></div>
                  <div id="square2"></div>
                  <div id="square3"></div>
                  <div id="square4"></div>
                  <div id="square5"></div>
                </div>
                <h4
                  className="text-[1.1rem] font-semibold text-[var(--text-primary)] mb-2"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Generating Animation...
                </h4>
                <p className="text-[var(--text-secondary)] mt-0 mb-0 text-[0.95rem] max-w-md">
                  <i className="fas fa-clock mr-2"></i>
                  This may take 2-3 minutes.
                </p>
                <style jsx>{`
                  .loadingspinner {
                    --square: 26px;
                    --offset: 30px;
                    --duration: 2.4s;
                    --delay: 0.2s;
                    --timing-function: ease-in-out;
                    --in-duration: 0.4s;
                    --in-delay: 0.1s;
                    --in-timing-function: ease-out;
                    width: calc(3 * var(--offset) + var(--square));
                    height: calc(2 * var(--offset) + var(--square));
                    padding: 0px;
                    margin-left: auto;
                    margin-right: auto;
                    position: relative;
                  }

                  .loadingspinner div {
                    display: inline-block;
                    background: linear-gradient(
                      135deg,
                      #6366f1 0%,
                      #8b5cf6 100%
                    );
                    border: none;
                    border-radius: 4px;
                    width: var(--square);
                    height: var(--square);
                    position: absolute;
                    padding: 0px;
                    margin: 0px;
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
                  }

                  .loadingspinner #square1 {
                    left: calc(0 * var(--offset));
                    top: calc(0 * var(--offset));
                    animation: square1 var(--duration) var(--delay)
                        var(--timing-function) infinite,
                      squarefadein var(--in-duration) calc(1 * var(--in-delay))
                        var(--in-timing-function) both;
                  }

                  .loadingspinner #square2 {
                    left: calc(0 * var(--offset));
                    top: calc(1 * var(--offset));
                    animation: square2 var(--duration) var(--delay)
                        var(--timing-function) infinite,
                      squarefadein var(--in-duration) calc(1 * var(--in-delay))
                        var(--in-timing-function) both;
                  }

                  .loadingspinner #square3 {
                    left: calc(1 * var(--offset));
                    top: calc(1 * var(--offset));
                    animation: square3 var(--duration) var(--delay)
                        var(--timing-function) infinite,
                      squarefadein var(--in-duration) calc(2 * var(--in-delay))
                        var(--in-timing-function) both;
                  }

                  .loadingspinner #square4 {
                    left: calc(2 * var(--offset));
                    top: calc(1 * var(--offset));
                    animation: square4 var(--duration) var(--delay)
                        var(--timing-function) infinite,
                      squarefadein var(--in-duration) calc(3 * var(--in-delay))
                        var(--in-timing-function) both;
                  }

                  .loadingspinner #square5 {
                    left: calc(3 * var(--offset));
                    top: calc(1 * var(--offset));
                    animation: square5 var(--duration) var(--delay)
                        var(--timing-function) infinite,
                      squarefadein var(--in-duration) calc(4 * var(--in-delay))
                        var(--in-timing-function) both;
                  }

                  @keyframes square1 {
                    0% {
                      left: calc(0 * var(--offset));
                      top: calc(0 * var(--offset));
                    }
                    8.333% {
                      left: calc(0 * var(--offset));
                      top: calc(1 * var(--offset));
                    }
                    100% {
                      left: calc(0 * var(--offset));
                      top: calc(1 * var(--offset));
                    }
                  }

                  @keyframes square2 {
                    0% {
                      left: calc(0 * var(--offset));
                      top: calc(1 * var(--offset));
                    }
                    8.333% {
                      left: calc(0 * var(--offset));
                      top: calc(2 * var(--offset));
                    }
                    16.67% {
                      left: calc(1 * var(--offset));
                      top: calc(2 * var(--offset));
                    }
                    25% {
                      left: calc(1 * var(--offset));
                      top: calc(1 * var(--offset));
                    }
                    83.33% {
                      left: calc(1 * var(--offset));
                      top: calc(1 * var(--offset));
                    }
                    91.67% {
                      left: calc(1 * var(--offset));
                      top: calc(0 * var(--offset));
                    }
                    100% {
                      left: calc(0 * var(--offset));
                      top: calc(0 * var(--offset));
                    }
                  }

                  @keyframes square3 {
                    0%,
                    100% {
                      left: calc(1 * var(--offset));
                      top: calc(1 * var(--offset));
                    }
                    16.67% {
                      left: calc(1 * var(--offset));
                      top: calc(1 * var(--offset));
                    }
                    25% {
                      left: calc(1 * var(--offset));
                      top: calc(0 * var(--offset));
                    }
                    33.33% {
                      left: calc(2 * var(--offset));
                      top: calc(0 * var(--offset));
                    }
                    41.67% {
                      left: calc(2 * var(--offset));
                      top: calc(1 * var(--offset));
                    }
                    66.67% {
                      left: calc(2 * var(--offset));
                      top: calc(1 * var(--offset));
                    }
                    75% {
                      left: calc(2 * var(--offset));
                      top: calc(2 * var(--offset));
                    }
                    83.33% {
                      left: calc(1 * var(--offset));
                      top: calc(2 * var(--offset));
                    }
                    91.67% {
                      left: calc(1 * var(--offset));
                      top: calc(1 * var(--offset));
                    }
                  }

                  @keyframes square4 {
                    0% {
                      left: calc(2 * var(--offset));
                      top: calc(1 * var(--offset));
                    }
                    33.33% {
                      left: calc(2 * var(--offset));
                      top: calc(1 * var(--offset));
                    }
                    41.67% {
                      left: calc(2 * var(--offset));
                      top: calc(2 * var(--offset));
                    }
                    50% {
                      left: calc(3 * var(--offset));
                      top: calc(2 * var(--offset));
                    }
                    58.33% {
                      left: calc(3 * var(--offset));
                      top: calc(1 * var(--offset));
                    }
                    100% {
                      left: calc(3 * var(--offset));
                      top: calc(1 * var(--offset));
                    }
                  }

                  @keyframes square5 {
                    0% {
                      left: calc(3 * var(--offset));
                      top: calc(1 * var(--offset));
                    }
                    50% {
                      left: calc(3 * var(--offset));
                      top: calc(1 * var(--offset));
                    }
                    58.33% {
                      left: calc(3 * var(--offset));
                      top: calc(0 * var(--offset));
                    }
                    66.67% {
                      left: calc(2 * var(--offset));
                      top: calc(0 * var(--offset));
                    }
                    75% {
                      left: calc(2 * var(--offset));
                      top: calc(1 * var(--offset));
                    }
                    100% {
                      left: calc(2 * var(--offset));
                      top: calc(1 * var(--offset));
                    }
                  }

                  @keyframes squarefadein {
                    0% {
                      transform: scale(0.75);
                      opacity: 0;
                    }
                    100% {
                      transform: scale(1);
                      opacity: 1;
                    }
                  }
                `}</style>
              </div>
            )}

            {/* Video Content - Clean Direct Display */}
            {!loading && !error && videoUrl && (
              <div className="flex-1 flex flex-col justify-center">
                {/* <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-[var(--border-custom)]">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-xl shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--rehnuma-secondary) 0%, var(--rehnuma-accent) 100%)",
                    }}
                  >
                    <i className="fas fa-film"></i>
                  </div>
                  <div>
                    <h4
                      className="m-0 mb-1 text-[1.15rem] font-semibold text-[var(--text-primary)]"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      Animation Ready
                    </h4>
                    <p className="text-[var(--text-secondary)] m-0 text-[0.9rem]">
                      Processing: {processingTime || "--"}
                      {attemptsInfo}
                    </p>
                  </div>
                </div> */}

                {/* Video Player - No Scrollbar, Clean Embedded Display */}
                <div className="flex-1 flex items-center justify-center">
                  <video
                    ref={videoRef}
                    controls
                    controlsList="nodownload nofullscreen"
                    disablePictureInPicture
                    className="w-full rounded-xl"
                    style={{
                      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                      maxHeight: "520px",
                      objectFit: "contain",
                    }}
                    src={videoUrl}
                    autoPlay
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="text-center py-16 flex-1 flex flex-col items-center justify-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "#fee2e2" }}
                >
                  <i className="fas fa-exclamation-triangle text-[1.75rem] text-[#dc2626]"></i>
                </div>
                <h4 className="m-0 mb-2 text-[var(--text-primary)]">
                  Error Generating Animation
                </h4>
                <p className="text-[var(--text-secondary)] m-0">{error}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 items-center justify-center flex-wrap shrink-0">
            <button
              onClick={onScrollToInput}
              className="inline-flex items-center justify-center gap-2 py-2.5 px-5 font-medium text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--border-custom)] rounded-xl cursor-pointer transition-all duration-200 hover:bg-[var(--bg-tertiary)] hover:-translate-y-0.5 text-sm"
              style={{ boxShadow: "var(--shadow-sm)" }}
            >
              <i className="fas fa-arrow-up"></i>
              Ask Another Question
            </button>
            <button
              onClick={onShowSolution}
              className="inline-flex items-center justify-center gap-2 py-2.5 px-5 font-semibold text-white rounded-xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5 text-sm"
              style={{
                background: "var(--gradient-primary)",
                boxShadow: "var(--shadow)",
              }}
            >
              <i className="fas fa-lightbulb"></i>
              View Text Solution
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
