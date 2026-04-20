#!/usr/bin/env python3
"""
add_narration.py -- Rehnuma Voice Narration Pipeline
=====================================================
Generates a tutorial-style TTS narration audio track and merges it with a
Manim video.

Narration text format:
  Sentences are separated by the literal " || " token. Each segment is
  synthesised individually with gTTS and joined with a short silence so the
  final audio sounds like a paced tutorial voice-over.

Usage:
    python add_narration.py --text-file /path/to/text.txt \\
                            --video /path/to/input.mp4 \\
                            --output /path/to/output.mp4

    # Legacy: pass text inline (may have shell-escaping issues on Windows)
    python add_narration.py --text "Your narration" \\
                            --video input.mp4 --output output.mp4

Dependencies:
    pip install gTTS moviepy pydub
"""

import argparse
import os
import sys
import tempfile
import traceback


# ---------------------------------------------------------------------------
# Dependency check (fail early with clear message)
# ---------------------------------------------------------------------------

def check_dependencies():
    missing = []
    try:
        import gtts  # noqa: F401
    except ImportError:
        missing.append("gTTS")
    try:
        import moviepy  # noqa: F401
    except ImportError:
        missing.append("moviepy")
    try:
        import pydub  # noqa: F401
    except ImportError:
        missing.append("pydub")
    if missing:
        print("[Narration] MISSING: {}. Run: pip install {}".format(
            ", ".join(missing), " ".join(missing)), file=sys.stderr)
        sys.exit(1)


check_dependencies()

from gtts import gTTS

# moviepy 2.x removed the .editor submodule.
try:
    from moviepy import VideoFileClip, AudioFileClip, CompositeAudioClip
    MOVIEPY_V2 = True
    print("[Narration] moviepy 2.x detected")
except ImportError:
    from moviepy.editor import VideoFileClip, AudioFileClip, CompositeAudioClip  # type: ignore
    MOVIEPY_V2 = False
    print("[Narration] moviepy 1.x detected")

from pydub import AudioSegment

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

# Silence (ms) inserted between narration segments — gives a tutorial feel.
PAUSE_BETWEEN_SENTENCES_MS = 450
# Silence (ms) added at the very start before narration begins.
LEAD_IN_SILENCE_MS = 300

# Separator token used by manim-executor.ts to mark sentence boundaries.
SEGMENT_SEPARATOR = " || "


# ---------------------------------------------------------------------------
# TTS helpers
# ---------------------------------------------------------------------------

def _synthesise_segment(text: str, path: str) -> bool:
    """Generate a single TTS mp3 for one sentence segment."""
    try:
        tts = gTTS(text=text, lang="en", tld="co.uk", slow=False)
        tts.save(path)
        return True
    except Exception as e:
        print("[Narration] gTTS error for segment '{}': {}".format(text[:40], e),
              file=sys.stderr)
        return False


def generate_tts(text: str, output_path: str) -> bool:
    """
    Split narration text on the '||' separator, synthesise each segment
    separately and join them with pydub silences.  This produces a natural
    tutorial voice-over with breathing room between sentences.
    Falls back to a single gTTS call if pydub fails.
    """
    segments = [s.strip() for s in text.split(SEGMENT_SEPARATOR) if s.strip()]
    if not segments:
        segments = [text.strip()]

    print("[Narration] Synthesising {} segment(s)…".format(len(segments)))

    tmp_files = []
    try:
        combined = AudioSegment.silent(duration=LEAD_IN_SILENCE_MS)
        silence  = AudioSegment.silent(duration=PAUSE_BETWEEN_SENTENCES_MS)

        for i, seg in enumerate(segments):
            tmp = tempfile.NamedTemporaryFile(suffix=".mp3", delete=False)
            tmp.close()
            tmp_files.append(tmp.name)

            print("[Narration]   Segment {}/{}: {}…".format(
                i + 1, len(segments), seg[:60]))

            if not _synthesise_segment(seg, tmp.name):
                # Skip failed segments rather than aborting entirely.
                continue

            chunk = AudioSegment.from_mp3(tmp.name)
            combined = combined + chunk + silence

        # Export the combined audio
        combined.export(output_path, format="mp3")
        size = os.path.getsize(output_path)
        print("[Narration] Combined audio saved: {} bytes -> {}".format(size, output_path))
        return True

    except Exception as e:
        print("[Narration] pydub error — falling back to simple TTS: {}".format(e),
              file=sys.stderr)
        traceback.print_exc()
        # Simple fallback: concatenate all segments into one string and call gTTS once.
        try:
            flat = ". ".join(segments)
            tts = gTTS(text=flat, lang="en", tld="co.uk", slow=False)
            tts.save(output_path)
            return True
        except Exception as e2:
            print("[Narration] Fallback TTS also failed: {}".format(e2), file=sys.stderr)
            return False

    finally:
        for f in tmp_files:
            try:
                os.unlink(f)
            except OSError:
                pass


# ---------------------------------------------------------------------------
# Audio/video merge (supports both moviepy 1.x and 2.x)
# ---------------------------------------------------------------------------

def merge_audio_video(video_path, audio_path, output_path):
    print("[Narration] Loading video: {}".format(video_path))
    try:
        video = VideoFileClip(video_path)
        vid_dur = video.duration
        print("[Narration] Video duration: {:.2f}s".format(vid_dur))

        audio = AudioFileClip(audio_path)
        aud_dur = audio.duration
        print("[Narration] Audio duration: {:.2f}s".format(aud_dur))

        # Trim audio if longer than video
        if aud_dur > vid_dur:
            if MOVIEPY_V2:
                audio = audio.with_end(vid_dur)
            else:
                audio = audio.subclip(0, vid_dur)
            print("[Narration] Audio trimmed to {:.2f}s".format(vid_dur))

        # Mix with existing audio at lower volume if present
        if video.audio is not None:
            if MOVIEPY_V2:
                bg   = video.audio.with_volume_scaled(0.12)
                narr = audio.with_volume_scaled(1.0)
            else:
                bg   = video.audio.volumex(0.12)
                narr = audio.volumex(1.0)
            final_audio = CompositeAudioClip([bg, narr])
        else:
            final_audio = audio

        if MOVIEPY_V2:
            final_video = video.with_audio(final_audio)
        else:
            final_video = video.set_audio(final_audio)

        print("[Narration] Writing: {}".format(output_path))
        if MOVIEPY_V2:
            final_video.write_videofile(
                output_path,
                codec="libx264",
                audio_codec="aac",
                logger=None,
            )
        else:
            final_video.write_videofile(
                output_path,
                codec="libx264",
                audio_codec="aac",
                logger=None,
                verbose=False,
            )
        video.close()
        audio.close()
        print("[Narration] Done: {}".format(output_path))
        return True

    except Exception as e:
        print("[Narration] Merge error: {}".format(e), file=sys.stderr)
        traceback.print_exc()
        return False


# ---------------------------------------------------------------------------
# Full pipeline
# ---------------------------------------------------------------------------

def add_narration(text, video_path, output_path):
    if not os.path.isfile(video_path):
        print("[Narration] Video not found: {}".format(video_path), file=sys.stderr)
        return False

    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp:
        audio_path = tmp.name

    try:
        if not generate_tts(text, audio_path):
            return False
        return merge_audio_video(video_path, audio_path, output_path)
    finally:
        if os.path.exists(audio_path):
            os.unlink(audio_path)


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Add TTS narration to a Manim video")
    # Accept text either inline (legacy) or via file (recommended, no escaping issues)
    text_group = parser.add_mutually_exclusive_group(required=True)
    text_group.add_argument("--text", help="Narration text (inline)")
    text_group.add_argument("--text-file", help="Path to a UTF-8 text file with narration")
    parser.add_argument("--video",  required=True, help="Input MP4 path")
    parser.add_argument("--output", required=True, help="Output MP4 path (with narration)")
    args = parser.parse_args()

    # Read text
    if args.text_file:
        with open(args.text_file, "r", encoding="utf-8") as f:
            text = f.read().strip()
        print("[Narration] Text loaded from file ({} chars)".format(len(text)))
    else:
        text = args.text

    ok = add_narration(text, args.video, args.output)
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
