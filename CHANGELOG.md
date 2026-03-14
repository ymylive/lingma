# Changelog

All notable changes to this project are documented in this file.

## 2026-03-14

### Added

- Added Prompt Arena inside `Vibe Coding Lab`
- Added AI-generated prompt-writing challenges across five tracks
- Added prompt-only scoring with dimension breakdown, strengths, weaknesses, and rewrite example
- Added account-level Prompt Arena history and adaptive difficulty/profile endpoints
- Added backend pytest coverage for Prompt Arena API flows

### Changed

- Reworked `VibeCodingLab` into a real training interface instead of a static methodology panel
- Added typed frontend service and model layer for vibe coding flows
- Updated README to reflect current product structure and verification commands

### Fixed

- Fixed multiple dark/light theme inconsistencies across practice-related pages
- Fixed AI generator dropdown stacking and missing exercise title English coverage

### Security

- Closed unauthenticated AI proxy and judge exposure paths behind authenticated proxy flows
- Added internal judge token enforcement and hardened judge deployment settings
