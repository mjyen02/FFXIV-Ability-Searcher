# FFXIV Ability Searcher

A web-based search tool for finding Final Fantasy XIV actions and abilities using the XIVAPI.

This project was created as a JavaScript learning project to practice working with APIs, asynchronous JavaScript, DOM manipulation, filtering, and pagination.

## Features

- Search for FFXIV abilities by name
- Display ability icons and descriptions
- Display class/job information
- Display the level an ability is acquired
- Filter results by:
  - PvE / PvP
  - Class / Job
  - Level range
- Pagination for search results
- Dark mode
- Handles searches across multiple XIVAPI result pages
- Displays loading, empty, and error states

## Project Architecture

The project is separated into modules based on responsibility:

```text
main.js
├── api.js       → Handles XIVAPI requests
├── filter.js    → Handles search result filtering
├── jobs.js      → Fetches and manages job data
└── results.js   → Creates and displays result cards
```

### `main.js`

Acts as the main controller for the application. It handles event listeners, search flow, application state, and pagination.

### `api.js`

Handles communication with XIVAPI and retrieves search results. It also follows API pagination so that all matching results can be filtered locally.

### `filter.js`

Contains the filtering logic for search results, including PvE/PvP mode, job selection, and optional level ranges.

### `jobs.js`

Retrieves ClassJob information from XIVAPI and uses it to populate the job selection dropdown.

### `results.js`

Handles displaying search results in the page, including ability names, icons, job information, levels, and tooltips.


## Technologies

- HTML
- CSS
- JavaScript
- [XIVAPI](https://v2.xivapi.com/)

## How It Works

The application sends a search request to XIVAPI and retrieves matching actions.

Because XIVAPI limits the number of results returned per request, the application follows the API's pagination cursors to retrieve additional results when necessary.

The retrieved results are then filtered based on the user's selected options before being displayed.

Results are displayed 10 at a time using client-side pagination.

## What I Learned

This project has helped me practice:

- ES modules and `import` / `export`
- `fetch()` and working with REST APIs
- `async` / `await`
- URL parameters and `URLSearchParams`
- Handling paginated API responses
- Array methods such as:
  - `filter()`
  - `find()`
  - `map()`
  - `concat()`
  - `slice()`
- DOM manipulation
- Creating HTML elements with JavaScript
- Event listeners and form submission
- Conditional filtering
- Managing application state
- Error handling
- CSS layouts and dark mode
- Working with nested API data

## Future Improvements

- [x] Search state / loading indicator
- [ ] Improved error messages
- [ ] Sorting search results
- [ ] Individual ability detail views
- [ ] Linked abilities and effects
- [ ] More advanced search filters
- [ ] Improve mobile responsiveness
- [ ] Improve UI styling
- [x] Refactor JavaScript into additional modules
- [ ] Deploy the finished application

## Disclaimer

This project is a fan-made tool and is not affiliated with or endorsed by Square Enix.

Final Fantasy XIV and related assets are property of Square Enix.

## Credits

Data provided by [XIVAPI](https://v2.xivapi.com/).
