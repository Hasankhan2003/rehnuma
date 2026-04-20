from manim import *
import numpy as np


class CentralLimitTheorem(Scene):
    def construct(self):
        # ============================================
        # TITLE SEQUENCE (0-6 seconds)
        # ============================================
        title = Text("Central Limit Theorem", font_size=58,
                     weight=BOLD, gradient=(BLUE, GREEN))
        subtitle = Text(
            "The Foundation of Statistical Inference", font_size=28)
        subtitle.next_to(title, DOWN, buff=0.5)

        self.play(Write(title, run_time=2))
        self.wait(0.5)
        self.play(FadeIn(subtitle, shift=UP), run_time=1.5)
        self.wait(2)
        self.play(FadeOut(title, shift=UP), FadeOut(
            subtitle, shift=UP), run_time=1)

        # ============================================
        # NARRATION HELPER FUNCTION
        # ============================================
        def show_narration(text, duration=3):
            narration = Text(text, font_size=26,
                             color=YELLOW).to_edge(DOWN, buff=0.4)
            narration.add_background_rectangle(
                color=BLACK, opacity=0.75, buff=0.2)
            self.play(FadeIn(narration, shift=UP), run_time=0.4)
            self.wait(duration)
            self.play(FadeOut(narration, shift=DOWN), run_time=0.4)

        # ============================================
        # SCENE 1: INTRODUCTION (6-14 seconds)
        # ============================================
        intro_text = Text(
            "Sample means approach normality\nas sample size increases", font_size=34)
        self.play(Write(intro_text), run_time=2)
        self.wait(1.5)
        self.play(FadeOut(intro_text), run_time=0.8)

        show_narration("Start with any population distribution", 2.5)

        # ============================================
        # SCENE 2: POPULATION DISTRIBUTION (14-26 seconds)
        # ============================================
        axes_pop = Axes(
            x_range=[0, 10, 2],
            y_range=[0, 0.5, 0.1],
            x_length=7,
            y_length=4,
            axis_config={"include_tip": True, "stroke_width": 2.5},
        ).shift(UP * 0.5)

        pop_label = Text("Original Population", font_size=28,
                         color=BLUE).to_edge(UP, buff=0.5)

        # Create skewed distribution (gamma-like)
        def gamma_dist(x):
            if x <= 0:
                return 0
            return 0.15 * (x ** 1.5) * np.exp(-x / 2)

        population_curve = axes_pop.plot(
            lambda x: gamma_dist(x),
            x_range=[0.1, 10],
            color=BLUE,
            stroke_width=4
        )

        self.play(Create(axes_pop), Write(pop_label), run_time=2)
        self.play(Create(population_curve), run_time=2)
        self.wait(1)

        show_narration("This distribution is clearly NOT normal", 3)

        # Add shading under curve
        area = axes_pop.get_area(population_curve, x_range=[
                                 0.1, 10], color=BLUE, opacity=0.3)
        self.play(FadeIn(area), run_time=1.5)
        self.wait(1)

        # ============================================
        # SCENE 3: SAMPLING PROCESS (26-38 seconds)
        # ============================================
        show_narration("Take random samples from this population", 3)

        # Generate sample points
        np.random.seed(42)
        sample_x = np.random.gamma(2, 2, 30)
        sample_dots = VGroup(*[
            Dot(axes_pop.c2p(x, gamma_dist(x) + 0.02),
                radius=0.06, color=RED, fill_opacity=0.8)
            for x in sample_x if 0 < x < 10
        ])

        self.play(
            LaggedStart(*[GrowFromCenter(dot)
                        for dot in sample_dots], lag_ratio=0.05),
            run_time=2.5
        )
        self.wait(1)

        # Calculate and show sample mean
        sample_mean = np.mean(sample_x)
        mean_line = DashedLine(
            axes_pop.c2p(sample_mean, 0),
            axes_pop.c2p(sample_mean, 0.4),
            color=YELLOW,
            stroke_width=4
        )
        mean_label = MathTex(r"\bar{x}", font_size=36, color=YELLOW).next_to(
            mean_line, UP, buff=0.1)

        self.play(Create(mean_line), Write(mean_label), run_time=1.5)
        self.wait(1)

        show_narration("Compute the sample mean", 2.5)

        # ============================================
        # SCENE 4: REPEATED SAMPLING (38-52 seconds)
        # ============================================
        self.play(
            FadeOut(sample_dots),
            FadeOut(mean_line),
            FadeOut(mean_label),
            run_time=0.8
        )

        show_narration("Repeat this process many times", 2.5)

        # Show multiple sampling iterations
        num_iterations = 8
        all_means = []

        for iteration in range(num_iterations):
            sample = np.random.gamma(2, 2, 30)
            sample_mean_iter = np.mean(sample)
            all_means.append(sample_mean_iter)

            dots_iter = VGroup(*[
                Dot(axes_pop.c2p(x, gamma_dist(x) + 0.02),
                    radius=0.05, color=RED, fill_opacity=0.6)
                for x in sample[:10] if 0 < x < 10
            ])

            mean_line_iter = Line(
                axes_pop.c2p(sample_mean_iter, 0),
                axes_pop.c2p(sample_mean_iter, 0.35),
                color=YELLOW,
                stroke_width=3,
                stroke_opacity=0.7
            )

            self.play(
                LaggedStart(*[GrowFromCenter(dot)
                            for dot in dots_iter], lag_ratio=0.02),
                run_time=0.4
            )
            self.play(Create(mean_line_iter), run_time=0.3)
            self.play(FadeOut(dots_iter), run_time=0.2)

        self.wait(1.5)

        # ============================================
        # SCENE 5: SAMPLING DISTRIBUTION (52-68 seconds)
        # ============================================
        show_narration(
            "Collect all sample means - this forms a new distribution", 3.5)

        self.play(
            FadeOut(axes_pop),
            FadeOut(population_curve),
            FadeOut(area),
            FadeOut(pop_label),
            *[FadeOut(mob) for mob in self.mobjects if isinstance(mob, Line)],
            run_time=1.5
        )

        # Create sampling distribution
        axes_sampling = Axes(
            x_range=[0, 10, 2],
            y_range=[0, 1.2, 0.2],
            x_length=7,
            y_length=4,
            axis_config={"include_tip": True, "stroke_width": 2.5},
        ).shift(UP * 0.5)

        sampling_label = Text("Distribution of Sample Means",
                              font_size=28, color=GREEN).to_edge(UP, buff=0.5)

        self.play(Create(axes_sampling), Write(sampling_label), run_time=2)

        # Generate many sample means
        many_means = []
        for _ in range(500):
            sample = np.random.gamma(2, 2, 30)
            many_means.append(np.mean(sample))

        many_means = np.array(many_means)

        # Create histogram bars
        hist, bins = np.histogram(many_means, bins=20, density=True)
        bars = VGroup()

        for i in range(len(hist)):
            bar_height = hist[i]
            bar_width = bins[i + 1] - bins[i]
            bar_center = (bins[i] + bins[i + 1]) / 2

            if bar_height > 0:
                bar = Rectangle(
                    width=axes_sampling.x_axis.unit_size * bar_width * 0.9,
                    height=axes_sampling.y_axis.unit_size * bar_height,
                    stroke_width=1,
                    stroke_color=WHITE,
                    fill_color=GREEN,
                    fill_opacity=0.7
                )
                bar.move_to(axes_sampling.c2p(bar_center, bar_height / 2))
                bars.add(bar)

        self.play(
            LaggedStart(*[GrowFromEdge(bar, DOWN)
                        for bar in bars], lag_ratio=0.02),
            run_time=3
        )
        self.wait(1)

        # ============================================
        # SCENE 6: NORMAL OVERLAY (68-82 seconds)
        # ============================================
        show_narration("The distribution becomes approximately normal!", 3.5)

        # Overlay normal curve
        mean_sampling = np.mean(many_means)
        std_sampling = np.std(many_means)

        def normal_curve(x):
            return (1 / (std_sampling * np.sqrt(2 * np.pi))) * np.exp(-0.5 * ((x - mean_sampling) / std_sampling) ** 2)

        normal_plot = axes_sampling.plot(
            normal_curve,
            x_range=[mean_sampling - 3 * std_sampling,
                     mean_sampling + 3 * std_sampling],
            color=RED,
            stroke_width=5
        )

        normal_label = Text("Normal Distribution", font_size=24, color=RED)
        normal_label.next_to(normal_plot, UR, buff=0.3)

        self.play(Create(normal_plot), run_time=2.5)
        self.play(Write(normal_label), run_time=1)
        self.wait(1.5)

        # Add mathematical formula
        clt_formula = MathTex(
            r"\bar{X} \sim N\left(\mu, \frac{\sigma^2}{n}\right)",
            font_size=40,
            color=YELLOW
        ).to_edge(DOWN, buff=1.5)

        self.play(Write(clt_formula), run_time=2)
        self.wait(2)

        # ============================================
        # SCENE 7: SAMPLE SIZE COMPARISON (82-98 seconds)
        # ============================================
        show_narration("Larger samples → Better approximation", 3)

        self.play(
            *[FadeOut(mob) for mob in [axes_sampling, bars, normal_plot,
                                       normal_label, sampling_label, clt_formula]],
            run_time=1.5
        )

        # Create side-by-side comparison
        comparison_title = Text("Effect of Sample Size",
                                font_size=32, weight=BOLD).to_edge(UP, buff=0.3)
        self.play(Write(comparison_title), run_time=1.5)

        # Small sample (n=5)
        axes_small = Axes(
            x_range=[0, 10, 5],
            y_range=[0, 0.8, 0.4],
            x_length=4.5,
            y_length=3,
            axis_config={"stroke_width": 2},
        ).shift(LEFT * 3.5 + DOWN * 0.5)

        small_label = Text("n = 5", font_size=24, color=BLUE).next_to(
            axes_small, DOWN, buff=0.3)

        # Generate small sample means
        small_means = []
        for _ in range(500):
            sample = np.random.gamma(2, 2, 5)
            small_means.append(np.mean(sample))

        hist_small, bins_small = np.histogram(
            small_means, bins=15, density=True)
        bars_small = VGroup()

        for i in range(len(hist_small)):
            if hist_small[i] > 0:
                bar = Rectangle(
                    width=axes_small.x_axis.unit_size *
                    (bins_small[i + 1] - bins_small[i]) * 0.85,
                    height=axes_small.y_axis.unit_size * hist_small[i],
                    stroke_width=1,
                    fill_color=BLUE,
                    fill_opacity=0.6
                )
                bar.move_to(axes_small.c2p(
                    (bins_small[i] + bins_small[i + 1]) / 2, hist_small[i] / 2))
                bars_small.add(bar)

        # Large sample (n=50)
        axes_large = Axes(
            x_range=[0, 10, 5],
            y_range=[0, 2.5, 1],
            x_length=4.5,
            y_length=3,
            axis_config={"stroke_width": 2},
        ).shift(RIGHT * 3.5 + DOWN * 0.5)

        large_label = Text("n = 50", font_size=24, color=GREEN).next_to(
            axes_large, DOWN, buff=0.3)

        # Generate large sample means
        large_means = []
        for _ in range(500):
            sample = np.random.gamma(2, 2, 50)
            large_means.append(np.mean(sample))

        hist_large, bins_large = np.histogram(
            large_means, bins=15, density=True)
        bars_large = VGroup()

        for i in range(len(hist_large)):
            if hist_large[i] > 0:
                bar = Rectangle(
                    width=axes_large.x_axis.unit_size *
                    (bins_large[i + 1] - bins_large[i]) * 0.85,
                    height=axes_large.y_axis.unit_size * hist_large[i],
                    stroke_width=1,
                    fill_color=GREEN,
                    fill_opacity=0.6
                )
                bar.move_to(axes_large.c2p(
                    (bins_large[i] + bins_large[i + 1]) / 2, hist_large[i] / 2))
                bars_large.add(bar)

        self.play(
            Create(axes_small),
            Create(axes_large),
            Write(small_label),
            Write(large_label),
            run_time=2
        )

        self.play(
            LaggedStart(*[GrowFromEdge(bar, DOWN)
                        for bar in bars_small], lag_ratio=0.03),
            LaggedStart(*[GrowFromEdge(bar, DOWN)
                        for bar in bars_large], lag_ratio=0.03),
            run_time=3
        )
        self.wait(2)

        # ============================================
        # SCENE 8: FINAL SUMMARY (98-120 seconds)
        # ============================================
        show_narration("Larger n → More concentrated, more normal", 3.5)

        self.play(
            *[FadeOut(mob) for mob in [
                axes_small, axes_large, bars_small, bars_large,
                small_label, large_label, comparison_title
            ]],
            run_time=2
        )

        # Final summary
        final_title = Text(
            "Central Limit Theorem",
            font_size=50,
            weight=BOLD,
            gradient=(BLUE, GREEN)
        )

        key_points = VGroup(
            Text("• Sample means form a normal distribution", font_size=26),
            Text("• Holds for ANY population distribution", font_size=26),
            Text("• Larger samples → Better approximation", font_size=26),
            Text("• Foundation of hypothesis testing", font_size=26),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.45)

        key_points.next_to(final_title, DOWN, buff=0.8)

        formula_box = MathTex(
            r"\bar{X} \xrightarrow{n \to \infty} N\left(\mu, \frac{\sigma^2}{n}\right)",
            font_size=38,
            color=YELLOW
        ).next_to(key_points, DOWN, buff=0.6)

        self.play(Write(final_title), run_time=2)
        self.wait(0.8)
        self.play(
            LaggedStart(*[FadeIn(point, shift=RIGHT)
                        for point in key_points], lag_ratio=0.4),
            run_time=3.5
        )
        self.wait(1)
        self.play(Write(formula_box), run_time=2)
        self.wait(3.5)

        # Final fade out
        self.play(
            *[FadeOut(mob) for mob in self.mobjects],
            run_time=2.5
        )
        self.wait(0.5)
