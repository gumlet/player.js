# Changelog

All notable changes to [@gumlet/player.js](https://github.com/gumlet/player.js) are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.9] - 2026-07-28

### Changed

- Applied code formatting and style cleanup across the codebase.
- Updated package dependencies.

### Added

- Added `.npmrc` configuration for npm publishing.

## [3.0.8] - 2026-03-14

### Fixed

- Guarded `window` usage so the library can be imported in server-side rendering (SSR) environments without errors.
- Removed an unnecessary `window` assignment.

## [3.0.7] - 2026-03-14

### Added

- Exported `Player`, `Receiver`, and related classes from the module entry point.

## [3.0.6] - 2026-03-14

### Added

- Exported additional TypeScript types from the module.

## [3.0.5] - 2026-03-14

### Fixed

- Fixed npm publish workflow for `player.js`.

## [3.0.4] - 2026-03-13

### Changed

- Replaced `tsup` with `tsdown` as the build tool.
- Updated the build target to ES2020.
- Upgraded GitHub Actions (`actions/checkout` and `actions/setup-node` to v6).
- Updated npm publish workflow configuration.

### Added

- Added playback rate tests.

### Removed

- Removed Dependabot configuration.

## [3.0.3] - 2025-12-10

### Added

- Added Biome linter and enforced lint and type checking before deploy.
- Added a configurable logger for console output.

### Changed

- Disabled caching in the GitHub Actions workflow.
- Updated npm publish workflow.

## [3.0.2] - 2025-09-10

### Fixed

- Fixed a bug when the player script is opened directly on a page.

### Changed

- Updated `@types/node` dependency.
- Removed legacy `esbuild.js` build script.

## [3.0.1] - 2025-07-30

### Fixed

- Build fixes for the TypeScript release.

## [3.0.0] - 2025-07-24

### Added

- Full TypeScript conversion with bundled type definitions.
- Promise-based API for all player methods, enabling `async`/`await` usage.
- Split receiver and callback API documentation (`RECEIVER.md`, `CALLBACK_API.md`).

### Changed

- Refactored module exports and removed the barrel export pattern.
- Simplified project dependencies.
- Updated the events section in documentation.

## [2.0.16] - 2025-05-20

### Fixed

- Fixed module export structure for `playerjs`.

## [2.0.15] - 2025-05-20

### Fixed

- Fixed `playerjs` export for module consumers.

### Changed

- Lint fixes.

## [2.0.14] - 2025-05-20

### Fixed

- Typo fix in source.

### Changed

- Lint fixes.

## [2.0.13] - 2025-05-20

### Fixed

- Fixed `player.js` export.

## [2.0.12] - 2025-05-20

### Fixed

- Corrected module export.

## [2.0.11] - 2025-05-20

### Fixed

- Corrected export hierarchy for `playerjs`.
- Fixed multiple drill-down issues in the `playerjs` export.

## [2.0.10] - 2025-04-30

### Changed

- Logging to the console is now conditional (only when appropriate).

## [2.0.9] - 2025-03-03

### Changed

- Lint fixes.

## [2.0.8] - 2025-03-03

### Added

- Added npm and JSDelivr badges to the README.

### Changed

- Updated CI/CD pipeline configuration.
- Bumped `esbuild` from 0.24.2 to 0.25.0.

## [2.0.7] - 2024-11-24

### Added

- Added Standard linter.
- Added Dependabot configuration.

### Changed

- Bumped `esbuild` from 0.21.5 to 0.24.0.

## [2.0.6] - 2024-09-17

### Changed

- Switched build output format to ESM.

## [2.0.5] - 2024-09-17

### Fixed

- Debugging fixes for default export.

## [2.0.4] - 2024-09-17

### Added

- Exported the `playerjs` object from the module entry point.

### Changed

- Updated Node.js version used in CI.

## [2.0.3] - 2024-09-16

### Changed

- Updated build output format and structure.

## [2.0.2] - 2024-09-16

### Changed

- Changed module to use `export default`.

## [2.0.1] - 2024-09-16

### Added

- Added default export for module consumers.

### Fixed

- Minor fixes.

## [2.0.0] - 2024-06-30

### Changed

- **Breaking:** Refactored the codebase to use ES6 classes (`Player`, `Receiver`, `Keeper`).
- Introduced a shared `core` module.
- Removed legacy `playerjs` global references from internal code.
- Updated tests to work with the latest QUnit version.
- General code cleanup.

## [1.0.5] - 2024-03-11

### Added

- Added `getPlaybackRate` method support across adapters.
- Added PhantomJS and GitHub Actions build configuration.

## [1.0.4] - 2024-03-11

### Added

- Added `setPlaybackRate` method to each adapter.

### Changed

- Downgraded Node.js version used for publishing.

## [1.0.3] - 2024-03-11

### Added

- Added GitHub Actions workflow for npm publishing.

### Changed

- Updated Grunt build dependencies.

## [1.0.2] - 2024-03-11

### Added

- Added support for more events in the receiver and emitter.
- Added `prepublish` npm script.
- Added documentation for supported events.

### Changed

- Ignored `dist/` directory in version control.

## [1.0.1] - 2023-05-31

### Added

- Added additional events for playback tracking.

## [1.0.0] - 2023-05-25

### Added

- Initial release of Player.js — a JavaScript library for interacting with iframes that support the Player.js spec.
- Player, Receiver, and Keeper implementations.
- HTML5, Video.js, and Mock adapters.
- Grunt-based build pipeline producing `player.js` and `player.min.js` bundles.
- QUnit test suite.

[3.0.9]: https://github.com/gumlet/player.js/compare/3.0.8...3.0.9
[3.0.8]: https://github.com/gumlet/player.js/compare/3.0.7...3.0.8
[3.0.7]: https://github.com/gumlet/player.js/compare/3.0.6...3.0.7
[3.0.6]: https://github.com/gumlet/player.js/compare/3.0.5...3.0.6
[3.0.5]: https://github.com/gumlet/player.js/compare/3.0.4...3.0.5
[3.0.4]: https://github.com/gumlet/player.js/compare/3.0.3...3.0.4
[3.0.3]: https://github.com/gumlet/player.js/compare/3.0.2...3.0.3
[3.0.2]: https://github.com/gumlet/player.js/compare/3.0.1...3.0.2
[3.0.1]: https://github.com/gumlet/player.js/compare/3.0.0...3.0.1
[3.0.0]: https://github.com/gumlet/player.js/compare/2.0.16...3.0.0
[2.0.16]: https://github.com/gumlet/player.js/compare/2.0.15...2.0.16
[2.0.15]: https://github.com/gumlet/player.js/compare/2.0.14...2.0.15
[2.0.14]: https://github.com/gumlet/player.js/compare/2.0.13...2.0.14
[2.0.13]: https://github.com/gumlet/player.js/compare/2.0.12...2.0.13
[2.0.12]: https://github.com/gumlet/player.js/compare/2.0.11...2.0.12
[2.0.11]: https://github.com/gumlet/player.js/compare/2.0.10...2.0.11
[2.0.10]: https://github.com/gumlet/player.js/compare/2.0.9...2.0.10
[2.0.9]: https://github.com/gumlet/player.js/compare/2.0.8...2.0.9
[2.0.8]: https://github.com/gumlet/player.js/compare/2.0.7...2.0.8
[2.0.7]: https://github.com/gumlet/player.js/compare/2.0.6...2.0.7
[2.0.6]: https://github.com/gumlet/player.js/compare/2.0.5...2.0.6
[2.0.5]: https://github.com/gumlet/player.js/compare/2.0.4...2.0.5
[2.0.4]: https://github.com/gumlet/player.js/compare/2.0.3...2.0.4
[2.0.3]: https://github.com/gumlet/player.js/compare/2.0.2...2.0.3
[2.0.2]: https://github.com/gumlet/player.js/compare/2.0.1...2.0.2
[2.0.1]: https://github.com/gumlet/player.js/compare/2.0.0...2.0.1
[2.0.0]: https://github.com/gumlet/player.js/compare/1.0.5...2.0.0
[1.0.5]: https://github.com/gumlet/player.js/compare/1.0.4...1.0.5
[1.0.4]: https://github.com/gumlet/player.js/compare/1.0.3...1.0.4
[1.0.3]: https://github.com/gumlet/player.js/compare/1.0.2...1.0.3
[1.0.2]: https://github.com/gumlet/player.js/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/gumlet/player.js/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/gumlet/player.js/releases/tag/1.0.0
