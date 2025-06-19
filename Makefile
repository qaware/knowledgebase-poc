# Knowledge base maintenance tasks

.PHONY: check format lint-fix

# Run all checks (format, lint, and links) - default target
check:
	@npx prettier --check **/*.md --log-level=warn
	@npx markdownlint --ignore node_modules **/*.md
	@node scripts/check-links.js

# Format all markdown files
format:
	@npx prettier --write **/*.md --log-level=warn

# Lint and fix all markdown files
lint-fix:
	@npx markdownlint --fix --ignore node_modules **/*.md