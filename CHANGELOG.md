# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

## [5.1.0] - 2020-03-31

### Added 
- Blog post: statistics of Q1 2020 (see [issue 120](https://github.com/dancehall-battle/website/issues/120))

## [5.1.0] - 2020-03-24

### Added
- Add upcoming events to country page (see [issue 70](https://github.com/dancehall-battle/website/issues/70))
- Titles of pages (see [issue 115](https://github.com/dancehall-battle/website/issues/115))

## [5.0.0] - 2020-03-16

### Added
- Use [utils-js](https://github.com/dancehall-battle/utils-js) (see [issue 103](https://github.com/dancehall-battle/website/issues/103))
- JSON-LD to country pages (see [issue 108](https://github.com/dancehall-battle/website/issues/108))
- Put data preparation in different library (see [issue 111](https://github.com/dancehall-battle/website/issues/111))

### Fixed
- Replace dancehallbattle.org urls in data with localhost when serving locally (see [issue 88](https://github.com/dancehall-battle/website/issues/88))

## [4.2.2] - 2020-01-11

### Fixed
- Year in footer (see [issue 104](https://github.com/dancehall-battle/website/issues/104))

## [4.2.1] - 2020-01-04

### Added
- Page for 2020 wins (see [issue 99](https://github.com/dancehall-battle/website/issues/99))

### Fixed
- Fix year separator on recent wins page (see [issue 98](https://github.com/dancehall-battle/website/issues/98))

## [4.2.0] - 2019-12-31

### Added
- Blog post: statistics of Q4 2019 (see [issue 94](https://github.com/dancehall-battle/website/issues/94))
- Blog post: statistics of 2019 (see [issue 95](https://github.com/dancehall-battle/website/issues/95))

## [4.1.0] - 2019-12-30

### Fixed
- Show full dates of wins on country page (see [issue 79](https://github.com/dancehall-battle/website/issues/79))

## [4.0.0] - 2019-12-30

### Added
- Ranking pages (see [issue 51](https://github.com/dancehall-battle/website/issues/51))
- Build in different stages to reduce memory usage
- Select TPF servers (dev or live) via environment variables
- Explain how rankings are calculated (see [issue 83](https://github.com/dancehall-battle/website/issues/83))

### Fixed
- Dancehall battle ontology namespace (see [issue 67](https://github.com/dancehall-battle/website/issues/67))

## [3.2.0] - 2019-12-08

### Added
- Show Instagram of organisers on event page (see [issue 68](https://github.com/dancehall-battle/website/issues/68))
- Show Instagram on dancer page (see [issue 69](https://github.com/dancehall-battle/website/issues/69))
- Script to check for dead links on the live website (see [issue 75](https://github.com/dancehall-battle/website/issues/75))

### Fixed
- Show full date of battles on dancer page (see [issue 66](https://github.com/dancehall-battle/website/issues/66))

## [3.1.0] - 2019-11-09

### Added
- Instagram account of organisers to upcoming events (see [issue 39](https://github.com/dancehall-battle/website/issues/39))
- Twitter:site (see [issue 62](https://github.com/dancehall-battle/website/issues/62))

### Fixed
- Group battles of the same event with the same date in lists (see [issue 59](https://github.com/dancehall-battle/website/issues/59))

## [3.0.3] - 2019-10-30

### Fixed
- Show battles on event page (see [issue 55](https://github.com/dancehall-battle/website/issues/55))

## [3.0.2] - 2019-10-27

### Added
- FAQ: difference event and battle (see [issue 37](https://github.com/dancehall-battle/website/issues/37))

### Fixed
- Country with events but without winners not shown on country index page (see [issue 48](https://github.com/dancehall-battle/website/issues/48))

## [3.0.1] - 2019-10-19

### Added
- Apple touch icon (see [issue 36](https://github.com/dancehall-battle/website/issues/36))

### Removed
- Unused dependency: csv-parse (see [issue 45](https://github.com/dancehall-battle/website/issues/45))

## [3.0.0] - 2019-10-13

### Added
- Event pages

## [2.3.0] -  2019-10-11

### Added
- Blog post: statistics of Q3 2019

## [2.2.2] - 2019-10-01

### Fixed
- Add F.A.Q. to nav bar (see [issue 34](https://github.com/dancehall-battle/website/issues/34))

## [2.2.1] - 2019-10-01

### Added
- F.A.Q. page (see [issue 31](https://github.com/dancehall-battle/website/issues/31))

## [2.2.0] - 2019-09-15

### Added
- Show events organised in a specific country on the country's page (see [issue 25](https://github.com/dancehall-battle/website/issues/25))

### Fixed
- Multiple JSON-LD script tags in HTML are dumped to JSON-LD and N-Quad files
- Second winner of 2 vs 2 on country page has link (see [issue 26](https://github.com/dancehall-battle/website/issues/26))

## [2.1.4] - 2019-09-03

### Added
- Links pages of dancers in lists of battles (see [issue 22](https://github.com/dancehall-battle/website/issues/22))

## [2.1.3] - 2019-08-31

### Fixed
- Link per battle is now shown at country page (see [issue 19](https://github.com/dancehall-battle/website/issues/19))

## [2.1.2] - 2019-08-29

### Fixed
- Show only one date when start and end date are the same for upcoming events (see [issue 14](https://github.com/dancehall-battle/website/issues/14))
- Show years for dates of upcoming events (see [issue 13](https://github.com/dancehall-battle/website/issues/13))

## [2.1.1] - 2019-08-12

### Fixed
- Ignore hours and minutes when determining upcoming events (see [issue 12](https://github.com/dancehall-battle/website/issues/12))

## [2.1.0] - 2019-08-11

### Added
- Page with upcoming events
- Titles to existing pages

### Fixed
- Use Bootstrap navbar

## [2.0.3] - 2019-08-10

### Added
- Cache query results when serving Eleventy
- Social media links ([issue 9](https://github.com/dancehall-battle/website/issues/9))
- Show country flag always for every dancer in 2 vs 2 ([issue 8](https://github.com/dancehall-battle/website/issues/8))

## [2.0.2] - 2019-08-06

### Fixed
- Don't try to show flag on country page next to dancer who doesn't have a country specified

## [2.0.1] - 2019-08-04

### Added

- Show link to battle when clicking ALT

## [2.0.0] - 2019-08-01

### Added

- Page with list of dancers
- Separate page for each dancer
- Separate JS file for Comunica engine
- Favicons

### Fixed
- Titles in navbar
- Rename build and serve scripts

## [1.0.2] - 2019-07-28

### Fixed
- Battle's name on smaller screen for all pages

## [1.0.1] - 2019-07-28

### Added
- Changelog file

### Fixed
- Battle's name on smaller screen

[5.2.0]: https://github.com/dancehall-battle/website/compare/v5.1.0...v5.2.0
[5.1.0]: https://github.com/dancehall-battle/website/compare/v5.0.0...v5.1.0
[5.0.0]: https://github.com/dancehall-battle/website/compare/v4.2.2...v5.0.0
[4.2.2]: https://github.com/dancehall-battle/website/compare/v4.2.1...v4.2.2
[4.2.1]: https://github.com/dancehall-battle/website/compare/v4.2.0...v4.2.1
[4.2.0]: https://github.com/dancehall-battle/website/compare/v4.1.0...v4.2.0
[4.1.0]: https://github.com/dancehall-battle/website/compare/v4.0.0...v4.1.0
[4.0.0]: https://github.com/dancehall-battle/website/compare/v3.2.0...v4.0.0
[3.2.0]: https://github.com/dancehall-battle/website/compare/v3.1.0...v3.2.0
[3.1.0]: https://github.com/dancehall-battle/website/compare/v3.0.3...v3.1.0
[3.0.3]: https://github.com/dancehall-battle/website/compare/v3.0.1...v3.0.3
[3.0.2]: https://github.com/dancehall-battle/website/compare/v3.0.2...v3.0.2
[3.0.1]: https://github.com/dancehall-battle/website/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/dancehall-battle/website/compare/v2.3.0...v3.0.0
[2.3.0]: https://github.com/dancehall-battle/website/compare/v2.2.2...v2.3.0
[2.2.2]: https://github.com/dancehall-battle/website/compare/v2.2.1...v2.2.2
[2.2.1]: https://github.com/dancehall-battle/website/compare/v2.2.0...v2.2.1
[2.2.0]: https://github.com/dancehall-battle/website/compare/v2.1.4...v2.2.0
[2.1.4]: https://github.com/dancehall-battle/website/compare/v2.1.3...v2.1.4
[2.1.3]: https://github.com/dancehall-battle/website/compare/v2.1.2...v2.1.3
[2.1.2]: https://github.com/dancehall-battle/website/compare/v2.1.1...v2.1.2
[2.1.1]: https://github.com/dancehall-battle/website/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/dancehall-battle/website/compare/v2.0.3...v2.1.0
[2.0.3]: https://github.com/dancehall-battle/website/compare/v2.0.2...v2.0.3
[2.0.2]: https://github.com/dancehall-battle/website/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/dancehall-battle/website/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/dancehall-battle/website/compare/v1.0.2...v2.0.0
[1.0.2]: https://github.com/dancehall-battle/website/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/dancehall-battle/website/compare/v1.0.0...v1.0.1