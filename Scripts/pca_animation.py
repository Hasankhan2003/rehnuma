from manim import *
import numpy as np


class PCAExplained(Scene):
    def construct(self):
        # ============================================
        # TITLE SEQUENCE (0-6 seconds)
        # ============================================
        title = Text("Principal Component Analysis", font_size=56,
                     weight=BOLD, gradient=(BLUE, PURPLE))
        subtitle = Text(
            "A Geometric Journey Through Dimensionality Reduction", font_size=26)
        subtitle.next_to(title, DOWN, buff=0.5)

        self.play(Write(title, run_time=2))
        self.wait(0.5)
        self.play(FadeIn(subtitle, shift=UP), run_time=1.5)
        self.wait(2)
        self.play(FadeOut(title, shift=UP), FadeOut(
            subtitle, shift=UP), run_time=1)
        self.wait(0.5)

        # ============================================
        # SCENE 1: INTRODUCTION WITH DATA (6-18 seconds)
        # ============================================

        # Narration function
        def show_narration(text, duration=3):
            narration = Text(text, font_size=26,
                             color=YELLOW).to_edge(DOWN, buff=0.4)
            narration.add_background_rectangle(
                color=BLACK, opacity=0.7, buff=0.2)
            self.play(FadeIn(narration, shift=UP), run_time=0.4)
            self.wait(duration)
            self.play(FadeOut(narration, shift=DOWN), run_time=0.4)

        intro_text = Text(
            "PCA transforms data to maximize variance", font_size=32)
        self.play(Write(intro_text), run_time=2)
        self.wait(1.5)
        self.play(FadeOut(intro_text), run_time=0.8)

        # Generate correlated 2D data
        np.random.seed(42)
        n_points = 100
        mean = [0, 0]
        cov = [[2.5, 1.8], [1.8, 1.2]]
        data = np.random.multivariate_normal(mean, cov, n_points)

        # Create coordinate system
        axes = Axes(
            x_range=[-5, 5, 1],
            y_range=[-4, 4, 1],
            x_length=8,
            y_length=6,
            axis_config={
                "include_tip": True,
                "stroke_width": 2.5,
                "tip_length": 0.2
            },
        ).shift(DOWN * 0.2)

        x_label = MathTex("x_1", font_size=36).next_to(
            axes.x_axis.get_end(), RIGHT, buff=0.2)
        y_label = MathTex("x_2", font_size=36).next_to(
            axes.y_axis.get_end(), UP, buff=0.2)
        axes_labels = VGroup(x_label, y_label)

        self.play(Create(axes), run_time=2)
        self.play(Write(axes_labels), run_time=1)
        self.wait(1)

        show_narration("Start with correlated 2D data points", 2.5)

        # Plot data points with animation
        dots = VGroup(*[
            Dot(axes.c2p(data[i, 0], data[i, 1]),
                radius=0.045, color=BLUE, fill_opacity=0.8)
            for i in range(n_points)
        ])

        self.play(
            LaggedStart(*[GrowFromCenter(dot)
                        for dot in dots], lag_ratio=0.015),
            run_time=3
        )
        self.wait(1.5)

        # ============================================
        # SCENE 2: COVARIANCE VISUALIZATION (18-30 seconds)
        # ============================================

        show_narration("Data shows clear correlation structure", 2.8)

        # Highlight correlation with connecting lines (sample)
        sample_lines = VGroup()
        for i in range(0, min(20, n_points), 2):
            for j in range(i+1, min(i+3, n_points)):
                if np.linalg.norm(data[i] - data[j]) < 2:
                    line = Line(
                        axes.c2p(data[i, 0], data[i, 1]),
                        axes.c2p(data[j, 0], data[j, 1]),
                        stroke_width=1,
                        stroke_opacity=0.15,
                        color=BLUE_C
                    )
                    sample_lines.add(line)

        self.play(Create(sample_lines), run_time=1.5)
        self.wait(1)
        self.play(FadeOut(sample_lines), run_time=0.8)

        # Draw covariance ellipse
        ellipse = Ellipse(
            width=5.5, height=3.6,
            stroke_color=YELLOW,
            stroke_width=4,
            fill_opacity=0.12,
            fill_color=YELLOW
        ).rotate(33 * DEGREES).move_to(axes.c2p(0, 0))

        ellipse_label = Text("Covariance\nEllipse", font_size=24, color=YELLOW)
        ellipse_label.next_to(ellipse, UR, buff=0.3)

        self.play(Create(ellipse), run_time=2)
        self.play(Write(ellipse_label), run_time=1)
        self.wait(1.5)

        show_narration("Ellipse reveals the data's orientation", 2.5)
        self.play(FadeOut(ellipse_label), run_time=0.5)

        # ============================================
        # SCENE 3: EIGENVECTORS (30-48 seconds)
        # ============================================

        show_narration("Compute eigenvectors of covariance matrix", 3)

        # Calculate eigenvectors and eigenvalues
        eigenvalues, eigenvectors = np.linalg.eig(cov)
        idx = eigenvalues.argsort()[::-1]
        eigenvalues = eigenvalues[idx]
        eigenvectors = eigenvectors[:, idx]

        # Create arrows with guaranteed length in screen space
        origin = axes.c2p(0, 0)

        # PC1: Use actual eigenvector direction but scale appropriately
        pc1_direction = eigenvectors[:, 0]
        pc1_angle = np.arctan2(pc1_direction[1], pc1_direction[0])
        pc1_length = 2.5  # Fixed visual length
        pc1_end = origin + pc1_length * \
            np.array([np.cos(pc1_angle), np.sin(pc1_angle), 0])

        pc1_arrow = Arrow(
            origin,
            pc1_end,
            buff=0,
            color=BLUE_B,
            stroke_width=8,
            max_tip_length_to_length_ratio=0.15
        )

        pc1_label = MathTex(r"\vec{v}_1", font_size=42, color=BLUE_B)
        pc1_label.next_to(pc1_arrow.get_end(), UR, buff=0.25)

        pc1_text = Text("PC1: Maximum Variance", font_size=28, color=BLUE_B)
        pc1_text.to_edge(UP, buff=0.5)

        self.play(GrowArrow(pc1_arrow), run_time=1.8)
        self.play(Write(pc1_label), run_time=0.8)
        self.play(FadeIn(pc1_text, shift=DOWN), run_time=1)
        self.wait(2)

        # Show variance along PC1 with pulsing effect
        self.play(
            pc1_arrow.animate.set_stroke(width=12, opacity=1),
            rate_func=there_and_back,
            run_time=1.5
        )
        self.wait(1)

        show_narration("PC1 captures the most variance in data", 2.8)

        # PC2: Orthogonal to PC1
        pc2_direction = eigenvectors[:, 1]
        pc2_angle = np.arctan2(pc2_direction[1], pc2_direction[0])
        pc2_length = 1.8  # Shorter to represent less variance
        pc2_end = origin + pc2_length * \
            np.array([np.cos(pc2_angle), np.sin(pc2_angle), 0])

        pc2_arrow = Arrow(
            origin,
            pc2_end,
            buff=0,
            color=ORANGE,
            stroke_width=8,
            max_tip_length_to_length_ratio=0.15
        )

        pc2_label = MathTex(r"\vec{v}_2", font_size=42, color=ORANGE)
        pc2_label.next_to(pc2_arrow.get_end(), UL, buff=0.25)

        pc2_text = Text("PC2: Orthogonal, Next Variance",
                        font_size=28, color=ORANGE)
        pc2_text.next_to(pc1_text, DOWN, buff=0.3)

        self.play(GrowArrow(pc2_arrow), run_time=1.8)
        self.play(Write(pc2_label), run_time=0.8)
        self.play(FadeIn(pc2_text, shift=DOWN), run_time=1)
        self.wait(2)

        # Show orthogonality with right angle marker
        angle_arc = Angle(
            Line(origin, pc1_end),
            Line(origin, pc2_end),
            radius=0.4,
            color=GREEN,
            stroke_width=3
        )

        self.play(Create(angle_arc), run_time=1)
        self.wait(1.5)

        show_narration("Components are orthogonal (perpendicular)", 2.5)

        self.play(
            FadeOut(angle_arc),
            FadeOut(pc1_text),
            FadeOut(pc2_text),
            run_time=1
        )

        # ============================================
        # SCENE 4: AXIS ROTATION (48-60 seconds)
        # ============================================

        show_narration("Rotate axes to align with principal components", 3)

        self.play(FadeOut(ellipse, scale=0.8), run_time=1)

        angle = np.arctan2(eigenvectors[1, 0], eigenvectors[0, 0])

        # Create new PC-aligned axes
        pc_axes = Axes(
            x_range=[-5, 5, 1],
            y_range=[-4, 4, 1],
            x_length=8,
            y_length=6,
            axis_config={"stroke_width": 3, "stroke_opacity": 0.7},
        ).shift(DOWN * 0.2).rotate(angle, about_point=axes.c2p(0, 0))

        pc_axes.set_color(GREEN)

        pc_x_label = MathTex(r"PC_1", font_size=36, color=GREEN)
        pc_y_label = MathTex(r"PC_2", font_size=36, color=GREEN)

        # Position labels on rotated axes
        pc_x_label.move_to(pc_axes.c2p(4.5, -0.5))
        pc_y_label.move_to(pc_axes.c2p(-0.5, 3.5))

        self.play(Create(pc_axes), run_time=2.5)
        self.play(Write(pc_x_label), Write(pc_y_label), run_time=1.5)
        self.wait(2)

        show_narration("New coordinate system matches data orientation", 3)

        # ============================================
        # SCENE 5: PROJECTION (60-78 seconds)
        # ============================================

        show_narration(
            "Project all points onto first principal component", 3.2)

        # Fade out PC2 since we're reducing dimensions
        self.play(
            FadeOut(pc2_arrow),
            FadeOut(pc2_label),
            pc1_arrow.animate.set_stroke(width=10),
            run_time=1.5
        )
        self.wait(0.5)

        # Create projection lines and projected points
        projection_lines = VGroup()
        projected_dots = VGroup()

        # Project every 2nd point for clarity
        for i in range(0, n_points, 2):
            original_point = axes.c2p(data[i, 0], data[i, 1])

            # Calculate projection onto PC1
            proj_scalar = np.dot(data[i], eigenvectors[:, 0])
            proj_point = proj_scalar * eigenvectors[:, 0]
            projected_point = axes.c2p(proj_point[0], proj_point[1])

            line = DashedLine(
                original_point,
                projected_point,
                stroke_width=2,
                stroke_opacity=0.5,
                dash_length=0.08,
                color=GRAY_B
            )

            proj_dot = Dot(projected_point, radius=0.05,
                           color=RED, fill_opacity=0.9)

            projection_lines.add(line)
            projected_dots.add(proj_dot)

        # Animate projections in waves
        self.play(
            LaggedStart(*[Create(line)
                        for line in projection_lines], lag_ratio=0.025),
            run_time=3
        )
        self.wait(1)

        self.play(
            LaggedStart(*[GrowFromCenter(dot)
                        for dot in projected_dots], lag_ratio=0.025),
            run_time=2.5
        )
        self.wait(2)

        show_narration("Original points mapped to lower dimension", 3)

        # ============================================
        # SCENE 6: COMPARISON (78-96 seconds)
        # ============================================

        self.play(
            FadeOut(projection_lines),
            FadeOut(pc_axes),
            FadeOut(pc_x_label),
            FadeOut(pc_y_label),
            run_time=1.5
        )
        self.wait(0.5)

        # Shrink and move original to left
        original_group = VGroup(axes, dots, pc1_arrow, pc1_label, axes_labels)

        self.play(
            original_group.animate.scale(0.55).shift(LEFT * 3.8 + UP * 0.8),
            run_time=2
        )

        original_title = Text(
            "Original Space", font_size=28, weight=BOLD, color=BLUE)
        original_title.next_to(axes, UP, buff=0.4)
        original_dim = Text("2 Dimensions", font_size=22, color=GRAY)
        original_dim.next_to(original_title, DOWN, buff=0.2)

        self.play(Write(original_title), Write(original_dim), run_time=1.5)
        self.wait(1)

        # Create 1D representation on right
        line_1d = Line(LEFT * 3, RIGHT * 3, color=BLUE_B, stroke_width=6)
        line_1d.shift(RIGHT * 3 + DOWN * 0.3)

        # Add tick marks
        ticks_1d = VGroup(*[
            Line(UP * 0.15, DOWN * 0.15, stroke_width=2,
                 color=GRAY).move_to(line_1d.point_from_proportion(t))
            for t in np.linspace(0.1, 0.9, 5)
        ])

        self.play(Create(line_1d), Create(ticks_1d), run_time=2)

        # Map projected dots to 1D line
        dots_1d = VGroup()
        for i in range(n_points):
            proj_scalar = np.dot(data[i], eigenvectors[:, 0])
            normalized_pos = (proj_scalar + 3) / 6  # Normalize to [0, 1]
            normalized_pos = np.clip(normalized_pos, 0.05, 0.95)

            dot_1d = Dot(
                line_1d.point_from_proportion(normalized_pos),
                radius=0.045,
                color=RED,
                fill_opacity=0.8
            )
            dots_1d.add(dot_1d)

        self.play(
            LaggedStart(*[GrowFromCenter(dot)
                        for dot in dots_1d], lag_ratio=0.015),
            run_time=3
        )
        self.wait(1.5)

        reduced_title = Text("Reduced Space", font_size=28,
                             weight=BOLD, color=RED)
        reduced_title.next_to(line_1d, UP, buff=0.7)
        reduced_dim = Text("1 Dimension", font_size=22, color=GRAY)
        reduced_dim.next_to(reduced_title, DOWN, buff=0.2)

        self.play(Write(reduced_title), Write(reduced_dim), run_time=1.5)
        self.wait(2)

        show_narration(
            "Dimensionality reduced while preserving structure", 3.5)

        # ============================================
        # SCENE 7: FINAL SUMMARY (96-120 seconds)
        # ============================================

        # Add variance preservation percentage
        variance_text = Text(
            "~85% variance preserved",
            font_size=24,
            color=YELLOW,
            weight=BOLD
        )
        variance_text.next_to(reduced_dim, DOWN, buff=0.5)

        self.play(Write(variance_text), run_time=1.5)
        self.wait(2)

        # Fade out comparison
        self.play(
            *[FadeOut(mob) for mob in [
                original_group, original_title, original_dim,
                line_1d, ticks_1d, dots_1d, reduced_title, reduced_dim, variance_text
            ]],
            run_time=2
        )
        self.wait(0.5)

        # Final summary
        final_title = Text(
            "Principal Component Analysis",
            font_size=48,
            weight=BOLD,
            gradient=(BLUE, PURPLE)
        )

        summary_points = VGroup(
            Text("• Finds directions of maximum variance", font_size=28),
            Text("• Orthogonal transformation", font_size=28),
            Text("• Optimal linear dimensionality reduction", font_size=28),
            Text("• Preserves most important information", font_size=28),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.4)

        summary_points.next_to(final_title, DOWN, buff=0.8)

        self.play(Write(final_title), run_time=2)
        self.wait(1)
        self.play(
            LaggedStart(*[FadeIn(point, shift=RIGHT)
                        for point in summary_points], lag_ratio=0.4),
            run_time=3
        )
        self.wait(3)

        # Final fade out
        self.play(
            *[FadeOut(mob) for mob in self.mobjects],
            run_time=2.5
        )
        self.wait(1)
