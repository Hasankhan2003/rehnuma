#!/usr/bin/env python3
"""
Fixed conversion script that properly separates problem statements from solutions.
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Any


def extract_chapter_number(question_number: str) -> str:
    """Extract chapter number from question number (e.g., '2-1' -> '2')."""
    return question_number.split('-')[0]


def generate_topic(question_number: str, raw_text: str) -> str:
    """Generate topic based on chapter and content."""
    chapter = extract_chapter_number(question_number)

    # Chapter-specific topics mapping
    chapter_topics = {
        '2': 'Chapter 2 - Probability',
        '3': 'Chapter 3 - Discrete Random Variables and Probability Distributions',
        '4': 'Chapter 4 - Continuous Random Variables and Probability Distributions',
        '5': 'Chapter 5 - Joint Probability Distributions',
        '7': 'Chapter 7 - Point Estimation',
        '8': 'Chapter 8 - Statistical Intervals',
        '9': 'Chapter 9 - Tests of Hypotheses for a Single Sample',
        '10': 'Chapter 10 - Tests of Hypotheses for Two Samples',
        '11': 'Chapter 11 - Simple Linear Regression and Correlation',
        '12': 'Chapter 12 - Multiple Linear Regression',
        '13': 'Chapter 13 - Design and Analysis of Single-Factor Experiments',
        '14': 'Chapter 14 - Design of Experiments with Several Factors',
        '15': 'Chapter 15 - Statistical Quality Control'
    }

    base_topic = chapter_topics.get(chapter, f'Chapter {chapter}')

    # Try to identify specific subtopic from content
    raw_lower = raw_text.lower()

    # Detailed subtopic keywords
    subtopics = {
        'sample space': ' - Sample Spaces and Events',
        'event': ' - Events and Set Operations',
        'conditional': ' - Conditional Probability',
        'independent': ' - Independence',
        'bayes': ' - Bayes\' Theorem',
        'pmf': ' - Probability Mass Function',
        'pdf': ' - Probability Density Function',
        'cdf': ' - Cumulative Distribution Function',
        'mean': ' - Mean and Variance',
        'variance': ' - Mean and Variance',
        'expected value': ' - Expected Value',
        'binomial': ' - Binomial Distribution',
        'poisson': ' - Poisson Distribution',
        'normal': ' - Normal Distribution',
        'exponential': ' - Exponential Distribution',
        'uniform': ' - Uniform Distribution',
        'geometric': ' - Geometric Distribution',
        'hypergeometric': ' - Hypergeometric Distribution',
        'joint probability': ' - Joint Probability Distributions',
        'marginal': ' - Marginal Distributions',
        'covariance': ' - Covariance and Correlation',
        'correlation': ' - Covariance and Correlation',
        'point estimat': ' - Point Estimation',
        'confidence interval': ' - Confidence Intervals',
        'hypothesis test': ' - Hypothesis Testing',
        't-test': ' - t-Tests',
        'z-test': ' - z-Tests',
        'chi-square': ' - Chi-Square Tests',
        'regression': ' - Regression Analysis',
        'anova': ' - Analysis of Variance',
        'control chart': ' - Control Charts',
    }

    for keyword, suffix in subtopics.items():
        if keyword in raw_lower:
            return base_topic + suffix

    return base_topic


def generate_id(question_number: str, topic: str) -> str:
    """Generate a unique ID for the problem."""
    chapter = extract_chapter_number(question_number)
    problem_num = question_number.split('-')[1]

    # Extract key topic words
    topic_words = topic.split(
        ' - ')[-1].lower() if ' - ' in topic else topic.lower()
    topic_words = re.sub(r'[^\w\s]', '', topic_words)
    topic_key = '_'.join(topic_words.split()[:4])  # First 4 words

    return f"ch{chapter}_prob{problem_num}_{topic_key}"


def split_problem_and_solution(raw_text: str) -> tuple:
    """
    Split raw text into problem statement and solution.
    Returns (problem, solution) tuple.
    """
    lines = raw_text.strip().split('\n')

    # Common solution markers
    solution_markers = [
        'solution:', 'answer:', 'from', 'given:', 'using',
        'calculate', 'therefore', 'hence', 'so,', 'thus',
        'let x', 'let y', 'let z', 'let p', 'we have',
        'substituting', 'solving', 'the probability', 'the mean',
        'the variance', 'the expected', 'step 1', 'step 2',
        '(a)', '(b)', '(c)', '(d)', '(e)', '(f)',
        'part a', 'part b', 'part c'
    ]

    # Try to find where solution starts
    problem_lines = []
    solution_lines = []
    in_solution = False
    problem_ended = False

    for i, line in enumerate(lines):
        line_stripped = line.strip()
        if not line_stripped:
            continue

        line_lower = line_stripped.lower()

        # Check if this line marks the start of solution
        if not in_solution:
            # Look for explicit solution indicators
            is_solution_marker = False

            # Check for part indicators like (a), (b), etc.
            if re.match(r'^\([a-f]\)', line_lower) or re.match(r'^part [a-f]', line_lower):
                in_solution = True
                solution_lines.append(line_stripped)
                continue

            # Check for "Given:" or "Solution:" type markers
            for marker in ['solution:', 'answer:', 'given:', 'proof:']:
                if line_lower.startswith(marker):
                    in_solution = True
                    solution_lines.append(line_stripped)
                    break

            if not in_solution:
                # Check if line looks like it's showing work/calculations
                # (contains lots of = signs, mathematical operations, etc.)
                eq_count = line_stripped.count('=')
                if eq_count >= 2 and len(problem_lines) > 0:
                    # Likely showing calculations
                    in_solution = True
                    solution_lines.append(line_stripped)
                else:
                    problem_lines.append(line_stripped)
        else:
            solution_lines.append(line_stripped)

    # Join the lines
    problem = ' '.join(problem_lines)
    solution = '\n'.join(solution_lines)

    # Clean up
    problem = re.sub(r'\s+', ' ', problem).strip()
    solution = solution.strip()

    # If we didn't find a clear split, use the first sentence(s) as problem
    if not solution or len(solution) < 20:
        # Use first 60% as problem, rest as solution
        all_text = raw_text.strip()
        split_point = int(len(all_text) * 0.4)

        # Try to split at a sentence boundary
        for i in range(split_point, min(split_point + 200, len(all_text))):
            if i < len(all_text) and all_text[i] in '.!?\n':
                problem = all_text[:i+1].strip()
                solution = all_text[i+1:].strip()
                break
        else:
            # Fallback: just use the split point
            problem = all_text[:split_point].strip()
            solution = all_text[split_point:].strip()

    # If problem is empty, use the first part of raw text
    if not problem or len(problem) < 10:
        sentences = raw_text.split('.')
        problem = sentences[0].strip() + '.' if sentences else raw_text[:200]

    # Ensure solution has content
    if not solution or len(solution) < 10:
        solution = raw_text.strip()

    # Clean up excessive whitespace
    problem = re.sub(r'\s+', ' ', problem)
    solution = re.sub(r'\n{3,}', '\n\n', solution)

    return problem, solution


def generate_theory_description(topic: str, raw_text: str) -> str:
    """Generate theory/description based on topic."""
    chapter = topic.split(' - ')[0].lower()

    # Template descriptions based on chapter
    templates = {
        'probability': "Probability theory deals with the analysis of random phenomena. The sample space S is the set of all possible outcomes of an experiment. Events are subsets of the sample space. The probability of an event A, denoted P(A), measures the likelihood of A occurring and must satisfy: 0 ≤ P(A) ≤ 1, P(S) = 1, and for mutually exclusive events, P(A∪B) = P(A) + P(B).",

        'discrete random': "A discrete random variable is a function that assigns numerical values to outcomes in a sample space, where the range consists of countable values (often integers). The probability mass function (PMF) f(x) = P(X=x) specifies the probability for each value. Properties: f(x) ≥ 0 for all x, and Σf(x) = 1 over all possible values. The cumulative distribution function (CDF) is F(x) = P(X≤x).",

        'continuous random': "A continuous random variable can take any value in an interval. The probability density function (PDF) f(x) describes the relative likelihood, where P(a≤X≤b) = ∫[a to b]f(x)dx. Properties: f(x) ≥ 0 for all x, ∫f(x)dx = 1 over the entire range, and P(X=c) = 0 for any specific value c. The CDF is F(x) = ∫[-∞ to x]f(t)dt.",

        'joint probability': "Joint probability distributions describe the behavior of two or more random variables simultaneously. For discrete variables, the joint PMF is f(x,y) = P(X=x, Y=y). Marginal distributions are obtained by summing over the other variable. Covariance measures linear relationship: Cov(X,Y) = E[(X-μₓ)(Y-μᵧ)]. Variables are independent if f(x,y) = fₓ(x)·fᵧ(y).",

        'estimation': "Point estimation involves using sample data to calculate a single value (statistic) that serves as a best guess for an unknown population parameter. Common estimators include the sample mean X̄ for μ, sample variance s² for σ², and sample proportion p̂ for p. Good estimators are unbiased (E(θ̂)=θ), consistent, and efficient (minimum variance).",

        'confidence interval': "A confidence interval provides a range of plausible values for a parameter with a specified confidence level. A 100(1-α)% confidence interval has probability 1-α of containing the true parameter. For a mean with known σ: X̄ ± z_{α/2}·σ/√n. For unknown σ: X̄ ± t_{α/2,n-1}·s/√n. The width decreases with larger sample size.",

        'hypothesis test': "Hypothesis testing is a statistical procedure to make decisions about population parameters based on sample data. The null hypothesis H₀ represents the status quo, while the alternative Hₐ represents what we're testing for. We reject H₀ if the p-value < α (significance level), or if the test statistic falls in the rejection region. Type I error: rejecting true H₀ (α). Type II error: failing to reject false H₀ (β).",

        'regression': "Regression analysis examines the relationship between variables. Simple linear regression models Y as a linear function of X: Y = β₀ + β₁X + ε. Least squares estimation minimizes Σ(yᵢ - ŷᵢ)². The coefficient of determination R² measures the proportion of variance in Y explained by X. Multiple regression extends this to several predictors.",

        'anova': "Analysis of Variance (ANOVA) tests whether means of several populations are equal. One-way ANOVA partitions total variation into between-groups and within-groups components. The F-statistic is the ratio of between-groups to within-groups variance. Reject H₀ (all means equal) if F > F_{α,a-1,N-a}. Assumptions: normality, equal variances, independence.",

        'control chart': "Statistical quality control uses control charts to monitor process stability over time. Control charts plot sample statistics against control limits. Common charts: X̄-chart (mean), R-chart (range), p-chart (proportion), c-chart (counts). Upper/Lower Control Limits typically at ±3σ from centerline. Points outside limits or systematic patterns indicate out-of-control process."
    }

    # Find matching template
    for key, template in templates.items():
        if key in topic.lower():
            return template

    # Default fallback
    return f"This problem relates to {topic}. Statistical analysis involves collecting, organizing, analyzing, and interpreting data to make informed decisions. Key concepts include probability distributions, sampling methods, estimation techniques, and hypothesis testing procedures."


def generate_animation_metadata(topic: str, problem: str) -> Dict[str, str]:
    """Generate animation hint/metadata."""

    # Determine focus based on topic
    if 'probability' in topic.lower() and 'distribution' not in topic.lower():
        return {
            "visual_focus": "Display Venn diagrams showing events and their relationships. Highlight sample space and specific events with shaded regions.",
            "objects_to_animate": "Circle objects for events, Rectangle for sample space, shaded regions with Polygon, set operation symbols, probability values",
            "animation_style": "Create Circle objects with Create animation. Use FillBetween for intersections and unions. Display formulas with MathTex. Use Indicate to highlight specific regions.",
            "color_coding": "Event A in BLUE, Event B in GREEN, intersection in PURPLE, union in YELLOW with transparency, sample space in WHITE outline, probabilities in WHITE text",
            "narration_summary": "Probability problems require careful identification of the sample space and events. Set operations (union, intersection, complement) correspond to logical combinations of events. Apply probability rules systematically to find the solution."
        }

    elif 'binomial' in topic.lower():
        return {
            "visual_focus": "Show the binomial distribution as a discrete bar chart with bars at each possible value of X. Highlight the bars corresponding to the probabilities being calculated.",
            "objects_to_animate": "BarChart showing binomial PMF, Pascal's triangle for binomial coefficients, highlighted bars for specific probabilities, formula display",
            "animation_style": "Create BarChart with bars at heights corresponding to binomial probabilities. Use Indicate to highlight specific bars. Display binomial formula with MathTex showing coefficient calculation.",
            "color_coding": "PMF bars in PURPLE, peak value in YELLOW, calculated probabilities in RED, cumulative regions shaded in LIGHT_BLUE with transparency",
            "narration_summary": "The binomial distribution models the number of successes in n independent trials with constant probability p. Use the binomial formula P(X=x) = C(n,x)p^x(1-p)^(n-x) to calculate probabilities."
        }

    elif 'normal' in topic.lower():
        return {
            "visual_focus": "Display the normal bell curve with the area under the curve shaded to represent probabilities. Mark z-scores and relevant boundaries on the x-axis.",
            "objects_to_animate": "Smooth bell curve using ParametricFunction, shaded regions under curve with Polygon, vertical lines at z-scores, standard normal table values",
            "animation_style": "Create smooth normal curve with Create animation. Use area shading with FillBetween for probability regions. Animate Transform showing standardization (X to Z). Display calculations with MathTex.",
            "color_coding": "Normal curve in BLUE, shaded probability regions in YELLOW with transparency, mean line in RED, z-score markers in GREEN, area values in WHITE text",
            "narration_summary": "Normal distribution problems require standardization using z = (x-μ)/σ. Find probabilities using the standard normal table or calculator. The total area under the curve equals 1, representing 100% probability."
        }

    elif 'poisson' in topic.lower():
        return {
            "visual_focus": "Show the Poisson distribution as discrete bars representing probabilities for different counts. Emphasize how the shape changes with parameter λ.",
            "objects_to_animate": "BarChart showing Poisson PMF, parameter λ value display, highlighted bars for calculated probabilities, exponential decay pattern",
            "animation_style": "Create BarChart with Poisson probabilities using Create. Use Indicate for specific x values. Display Poisson formula P(X=x) = (λ^x · e^(-λ))/x! with MathTex.",
            "color_coding": "Poisson bars in TEAL, peak at λ in ORANGE, calculated values in RED, mean line at λ in YELLOW dashed",
            "narration_summary": "The Poisson distribution models the number of events in a fixed interval when events occur independently at constant average rate λ. It's useful for rare events like defects, arrivals, or radioactive decay."
        }

    elif 'pmf' in topic.lower() or 'discrete' in topic.lower():
        return {
            "visual_focus": "Create a bar chart showing the probability mass function with bars at each possible value. Highlight specific bars and show probability calculations.",
            "objects_to_animate": "BarChart with PMF bars, highlighted bars for calculated probabilities, running sum displays, interval markers",
            "animation_style": "Use BarChart with Create animation. Indicate specific bars with color changes. Show summation with Transform animation accumulating probabilities. Display formulas with MathTex.",
            "color_coding": "PMF bars in BLUE, highlighted bars in YELLOW, summed regions in GREEN with transparency, probability values in WHITE bold text",
            "narration_summary": "For discrete random variables, probabilities are found by summing the PMF over relevant values. The PMF must satisfy f(x) ≥ 0 and Σf(x) = 1."
        }

    elif 'pdf' in topic.lower() or 'continuous' in topic.lower():
        return {
            "visual_focus": "Display the probability density function as a smooth curve. Shade areas under the curve to represent probabilities for intervals.",
            "objects_to_animate": "Smooth curve using ParametricFunction, shaded regions under curve, vertical boundary lines, area labels with calculated probabilities",
            "animation_style": "Create smooth PDF curve with Create. Use FillBetween to shade probability regions. Animate integration process showing accumulation of area. Display integral notation with MathTex.",
            "color_coding": "PDF curve in BLUE, shaded probability areas in YELLOW/GREEN with transparency, boundary lines in RED, area values in WHITE text",
            "narration_summary": "For continuous random variables, P(a ≤ X ≤ b) equals the area under the PDF curve between a and b. P(X=c) = 0 for any specific value. Use integration to find probabilities."
        }

    elif 'confidence interval' in topic.lower():
        return {
            "visual_focus": "Show a number line with the confidence interval marked as a bracket. Display the point estimate at the center and margin of error extending on both sides.",
            "objects_to_animate": "NumberLine for the parameter range, confidence interval bracket, point estimate marker, margin of error arrows, confidence level indicator",
            "animation_style": "Create NumberLine with Create. Draw confidence interval using Line with endpoints. Add Brace to show margin of error. Animate GrowFromCenter for interval construction. Display formula with MathTex.",
            "color_coding": "Number line in WHITE, confidence interval in BLUE thick line, point estimate in RED circle, margin of error in GREEN arrows, true parameter (if shown) in YELLOW",
            "narration_summary": "A confidence interval provides a range of plausible values for a parameter. The confidence level (e.g., 95%) means that if we repeated the sampling many times, about 95% of intervals would contain the true parameter."
        }

    elif 'hypothesis test' in topic.lower() or 't-test' in topic.lower() or 'z-test' in topic.lower():
        return {
            "visual_focus": "Display the sampling distribution under H₀ with rejection regions shaded in the tails. Mark the test statistic value and p-value area.",
            "objects_to_animate": "Bell curve for null distribution, rejection regions shaded, test statistic marker, p-value area, critical value markers, decision rule text",
            "animation_style": "Create distribution curve with Create. Shade rejection regions with Polygon. Add vertical line for test statistic with Write. Highlight p-value area with FillBetween. Display hypothesis and decision with MathTex.",
            "color_coding": "Null distribution in BLUE, rejection regions in RED with transparency, test statistic line in GREEN, p-value area in YELLOW, critical values in ORANGE markers",
            "narration_summary": "Hypothesis testing compares observed data to what we'd expect under H₀. If the test statistic falls in the rejection region (or p-value < α), we reject H₀ in favor of Hₐ. Otherwise, we fail to reject H₀."
        }

    elif 'regression' in topic.lower():
        return {
            "visual_focus": "Show a scatter plot of data points with the regression line fitted through them. Display residuals as vertical lines from points to the line.",
            "objects_to_animate": "Scatter plot points, regression line, residual lines, equation of fitted line, R² value, prediction intervals",
            "animation_style": "Plot data points with Create. Animate regression line appearing with Write. Show residuals with GrowFromCenter for vertical lines. Display equation ŷ = b₀ + b₁x with MathTex.",
            "color_coding": "Data points in BLUE dots, regression line in RED, residuals in GREEN dashed lines, prediction bands in YELLOW transparency, equation text in WHITE",
            "narration_summary": "Linear regression finds the best-fit line through data points by minimizing the sum of squared residuals. The slope b₁ measures the change in Y per unit change in X. R² indicates the proportion of variance explained."
        }

    elif 'anova' in topic.lower():
        return {
            "visual_focus": "Display box plots or dot plots for each group side by side. Show overall mean and group means. Illustrate between-group and within-group variation.",
            "objects_to_animate": "Box plots for each group, group means as horizontal lines, overall grand mean, F-statistic visualization, ANOVA table with sum of squares",
            "animation_style": "Create box plots with Create for each group. Draw mean lines with DashedLine. Use arrows to show deviations from means. Display ANOVA table with MathTex showing calculations.",
            "color_coding": "Each group in different color (BLUE, GREEN, ORANGE, PURPLE), group means in RED, grand mean in YELLOW, significant differences highlighted",
            "narration_summary": "ANOVA tests if multiple group means are equal by comparing between-group variation to within-group variation. Large F-statistic (ratio of these variances) provides evidence that at least one mean differs from others."
        }

    elif 'control chart' in topic.lower():
        return {
            "visual_focus": "Show a time series plot with sample statistics plotted over time. Display center line, upper and lower control limits as horizontal lines.",
            "objects_to_animate": "Time series line plot, UCL and LCL horizontal lines, center line, out-of-control points highlighted, control limit calculations",
            "animation_style": "Create axes with NumberLine. Plot points connected with lines using Create. Add DashedLine for control limits. Use Indicate to highlight out-of-control points. Display limit calculations with MathTex.",
            "color_coding": "Process data in BLUE line, center line in GREEN, control limits in RED dashed, in-control points in BLUE, out-of-control points in RED circles",
            "narration_summary": "Control charts monitor process stability over time. Points outside control limits or exhibiting non-random patterns indicate the process is out of control and requires investigation."
        }

    else:
        # Default generic metadata
        return {
            "visual_focus": f"Visualize the key concepts and calculations for this {topic} problem. Display relevant formulas, diagrams, and step-by-step solution process.",
            "objects_to_animate": "Mathematical formulas with MathTex, diagrams appropriate to the problem type, numerical calculations, step-by-step solution displays",
            "animation_style": "Use Create and Write animations for formulas. Transform to show algebraic steps. Indicate to highlight key results. FadeIn/FadeOut for transitions between steps.",
            "color_coding": "Given information in BLUE, calculations in GREEN, intermediate results in YELLOW, final answer in RED highlighted, formulas in WHITE",
            "narration_summary": f"Solve this {topic} problem by applying the relevant formulas and statistical principles. Follow each step carefully, showing all calculations and explaining the reasoning."
        }


def convert_raw_to_high_quality(input_file: Path, output_file: Path):
    """Convert raw solution JSON to high-quality format."""

    print(f"Reading from: {input_file}")
    with open(input_file, 'r', encoding='utf-8') as f:
        raw_data = json.load(f)

    print(f"Converting {len(raw_data)} problems...")

    high_quality_data = []

    for i, item in enumerate(raw_data, 1):
        question_number = item['question_number']
        raw_text = item['raw']

        # Generate topic
        topic = generate_topic(question_number, raw_text)

        # Generate ID
        problem_id = generate_id(question_number, topic)

        # Split problem and solution
        problem, solution = split_problem_and_solution(raw_text)

        # Generate theory description
        theory = generate_theory_description(topic, raw_text)

        # Generate animation metadata
        animation_metadata = generate_animation_metadata(topic, problem)

        # Create high-quality object
        hq_object = {
            "id": problem_id,
            "topic": topic,
            "problem": problem,
            "theory/description": theory,
            "solution/explanation": solution,
            "animation_hint/metadata": animation_metadata
        }

        high_quality_data.append(hq_object)

        # Progress indicator
        if i % 50 == 0:
            print(f"Processed {i}/{len(raw_data)} problems...")

    # Write output
    print(f"\nWriting to: {output_file}")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(high_quality_data, f, indent=2, ensure_ascii=False)

    # Get file size
    file_size = output_file.stat().st_size / (1024 * 1024)  # MB

    print(f"\n✅ Conversion complete!")
    print(f"Converted {len(high_quality_data)} problems")
    print(f"Output file size: {file_size:.2f} MB")
    print(f"Saved to: {output_file}")


if __name__ == "__main__":
    # Set up paths
    base_dir = Path(__file__).parent
    raw_dir = base_dir / "data" / "raw"
    processed_dir = base_dir / "data" / "processed"

    input_file = raw_dir / "prob_raw_solution.json"
    output_file = processed_dir / "prob_solution.json"

    # Run conversion
    convert_raw_to_high_quality(input_file, output_file)
