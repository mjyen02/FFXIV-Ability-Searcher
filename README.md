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

- ✅ Search state / loading indicator
- [ ] Improved error messages
- [ ] Sorting search results
- [ ] Individual ability detail views
- [ ] Linked abilities and effects
- [ ] More advanced search filters
- [ ] Improve mobile responsiveness
- [ ] Improve UI styling
- [ ] Refactor JavaScript into additional modules
- [ ] Deploy the finished application

## Disclaimer

This project is a fan-made tool and is not affiliated with or endorsed by Square Enix.

Final Fantasy XIV and related assets are property of Square Enix.

## Credits

Data provided by [XIVAPI](https://v2.xivapi.com/).
