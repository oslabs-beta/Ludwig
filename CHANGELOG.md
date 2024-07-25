# Change Log

All notable changes to the "ludwig-es" extension will be documented in this file.

## [v2.0.0] - 2024-07-24
### Added
- Introduced a new dashboard for viewing ESLint results.
- Added support for multiple files with separate JSON libraries.
- New command `ludwig.getResults` to save and display lint results.
- Added progression chart to display lint results over time.
- Added custom severty metrics for all errors and warnings.

### Changed
- Refactored `eslintDiagnostics.ts` to use the new JSON library.
- Updated `createDashboard.ts` to show the progression chart in the bottom panel.

### Removed
- Deprecated old commands `ludwig.scanFiles`, `ludwig.scanFilesWithCustomConfig`, `Ludwig: Compose`, and `Ludwig: Caesura`

### Fixed
- Fixed issues with duplicate lint results being added to the chart.
- Fixed issue with diagnostics not clearing correctly.

## [v1.5.0] - 2024-07-12
### Added
- Initial support for highlighting HTML elements.
- Command `ludwig.highlightElements` to highlight accessibility issues in HTML.
- Migrated to TypeScript

### Fixed
- Fixed issue with diagnostics not highlighting correctly.
- Removed redundant code.

## [v1.0.0] - 2023-12-30
### Added
- Initial release of Ludwig ES extension.
- Basic linting support for HTML, JavaScript, and TypeScript.
- Commands `ludwig.toggleLintActiveFile`, `ludwig.toggleLintAllFiles`, `ludwig.clearDiagnostics`.

