// Defining a baseURL and key to as part of the request URL

const baseURL = 'https://v2.xivapi.com/api';


// Grab references to all the DOM elements you'll need to manipulate
const searchTerm = document.querySelector('.search');
const searchForm = document.querySelector('form');
const category = document.querySelector("#category");
const nextBtn = document.querySelector('.next');
const previousBtn = document.querySelector('.prev');
const section = document.querySelector('section');
const nav = document.querySelector('nav');

// Hide the "Previous"/"Next" navigation to begin with, as we don't need it immediately
nav.style.display = 'none';

// define the nextCursor for pagination
let nextCursor = null;
let previousCursors = [];

// Event listeners to control the functionality
searchForm.addEventListener("submit", submitSearch);
nextBtn.addEventListener("click", nextPage);
previousBtn.addEventListener("click", previousPage);

function nextPage(e)
{
    // Push the current cursor ID to an array to make it accessible via the previous page function
    previousCursors.push(nextCursor);
    fetchResults(e);
}

function previousPage(e)
{
    // Check if previousCursors array is only on second page to handle edge case
    if (previousCursors.length === 1)
    {
        previousCursors.pop();
        nextCursor = null;
    }
    // Else backtrack one page
    if (previousCursors.length > 1)
    {
        nextCursor = previousCursors.pop();
    }

    fetchResults(e);
}

function submitSearch(e)
{
    // Refresh all global parameters
    nextCursor = null
    nav.style.display = "none";
    previousCursors = [];
    fetchResults(e);
}

async function fetchResults(e)
{
    // Use preventDefault() to stop the form submitting
    e.preventDefault();

    // Construct parameters for searching for relevant fields
    const params = new URLSearchParams({
        sheets: category.value,
        fields: 'Name,Icon,ClassJobLevel',
        transient: 'Description@as(html)',
        query: `Name~"${searchTerm.value}"`,
        limit:  10
    });

    // Check for cursor from previous pagination
    if (nextCursor)
    {
        params.append("cursor", nextCursor);
    }

    // Assemble the full URL
    let url = `${baseURL}/search?${params}`;
    console.log(url);

    // Fetch the api
    const response = await fetch(url);
    const data = await response.json();
    
    // Assign a cursor if limit exceeded
    nextCursor = data.next;

    // Enable pagination buttons if limit exceeded
    if (nextCursor)
    {
        nextBtn.style.display = 'block';
        nav.style.display = 'block'
    }
    else
    {
        nextBtn.style.display = 'none';
    }

    if (previousCursors.length > 0)
    {
        previousBtn.style.display = 'block';
    }
    else
    {
        previousBtn.style.display = 'none';
    }

    displayResults(data);
}

function displayResults(data)
{
    console.log(`prevCursor Length: ${previousCursors.length}`);
    console.log(`Cursor: ${nextCursor}`);

    // Clear all previous elements when updating display
    while (section.firstChild)
    {
        section.removeChild(section.firstChild);
    }

    // Display "No results found on 0 matching elements"
    if (data.results.length === 0)
    {
        const heading = document.createElement("h1");
        heading.textContent = "No results found";
        section.appendChild(heading);
        return;
    }

    // Iterate data array to begin populating the page with elements
    for (const entry of data.results)
    {
        console.log(entry);
        // Construct elements of article
        const article = document.createElement("article");
        const heading = document.createElement("h2");
        const levelInfo = document.createElement("h3");
        const img = document.createElement("img");
        const tooltipContainer = document.createElement("div");
        
        // Create class for ability tooltip and icons
        tooltipContainer.classList.add("ability-tooltip");
        img.classList.add("ability-icon");

        const iconPath = entry.fields.Icon.path_hr1;

        // Construct Parameter to obtain ability images
        const iconParams = new URLSearchParams({
            path: iconPath,
            format: 'jpg'
        });
        
        // Fill the created elements with their relevant information
        heading.textContent = entry.fields.Name;
        levelInfo.textContent = `Class Level: ${entry.fields.ClassJobLevel}`;
        img.src = `${baseURL}/asset?${iconParams}`;
        const abilityTooltip = entry.transient['Description@as(html)'];

        tooltipContainer.insertAdjacentHTML('beforeend', abilityTooltip);

        // Insert elements into the page
        article.appendChild(img);
        article.appendChild(heading);
        article.appendChild(levelInfo);
        article.appendChild(tooltipContainer);
        section.appendChild(article);
    }

    // console.log(data.results);
}