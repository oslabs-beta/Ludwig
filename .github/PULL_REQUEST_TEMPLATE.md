# Contribution Guidelines

## Pre-Push Check Instructions

Before pushing your changes, please follow these steps to ensure code quality and consistency:

1. Ensure all dependencies are installed: `pnpm install`

2. Run the linting and formatting checks: `pnpm run lint`

3. If issues are found, attempt to auto-fix them: `pnpm run lint:fix`

4. If any issues remain after auto-fixing, address them manually in your code and re-run `pnpm run lint`

5. Once all checks pass, commit your changes and push to your branch.

## Notes

- The CI pipeline will run these checks automatically on push and pull requests.
- Minor issues may be auto-fixed by the CI, but it's best to resolve issues locally before pushing.

## Code Style

- ESLint is used for JavaScript and TypeScript linting.
- Prettier is used for code formatting.
- Configuration files (.eslintrc and .prettierrc) define the specific rules.
