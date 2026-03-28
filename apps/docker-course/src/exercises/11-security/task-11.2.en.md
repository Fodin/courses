# Task 11.2: Vulnerability Scanning

## Objective

Explore tools for scanning Docker images for vulnerabilities (CVEs), understand severity levels, and learn to integrate scanning into CI/CD. Create an interactive reference component on scanning.

## Requirements

1. Create a component with three switchable sections: "CVE Levels", "Scanning Tools", "CI/CD Integration"
2. The "CVE Levels" section shows a table with four severity levels (CRITICAL, HIGH, MEDIUM, LOW), a description of each, a CVE example, an SLA for remediation, and color-coded indicators
3. The "Scanning Tools" section shows cards for 4 tools: Docker Scout, Trivy, Grype, Snyk — with a description, key commands, pros and cons
4. For each tool, add a "Show commands" button — clicking it displays a code block with the main commands
5. The "CI/CD Integration" section shows an example GitHub Actions workflow for scanning on push and scheduled nightly scanning — with explanations for each step
6. Add an interactive "scan results simulator" — a "Run scan" button that, when clicked, shows a sample output with found vulnerabilities of different levels
7. At the bottom of the component — a "Recommendation" block with advice on choosing a tool

## Hints

- `useState<string>` for the active section
- `useState<Record<string, boolean>>` for the visibility of commands for each tool
- `useState<boolean>` for the scan simulator (result shown/hidden)
- CVE colors: CRITICAL — red, HIGH — orange, MEDIUM — yellow, LOW — gray

## Checklist

- [ ] Three sections are switchable
- [ ] CVE levels table with 4 entries and colors
- [ ] Cards for 4 scanning tools
- [ ] "Show commands" buttons work independently
- [ ] CI/CD examples with explanations
- [ ] Scan simulator with a button and results
- [ ] "Recommendation" block at the bottom

## How to Verify

1. Switch sections — the content changes
2. The CVE table contains 4 levels with colors and examples
3. Each tool has a "Show commands" button — it works
4. In CI/CD, workflow examples are visible with explanations
5. The "Run scan" button shows a result with CVEs of different levels
6. The recommendation block is visible at the bottom
