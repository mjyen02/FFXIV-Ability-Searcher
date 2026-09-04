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
    previousCursors.push(nextCursor);
    fetchResults(e);
}

function previousPage(e)
{
    if (previousCursors.length === 1)
    {
        previousCursors.pop();
        nextCursor = null;
    }
    
    if (previousCursors.length > 1)
    {
        nextCursor = previousCursors.pop();
    }

    fetchResults(e);
}

function submitSearch(e)
{
    nextCursor = null
    nav.style.display = "none";
    previousCursors = [];
    fetchResults(e);
}

async function fetchResults(e)
{
    // Use preventDefault() to stop the form submitting
    e.preventDefault();

    const params = new URLSearchParams({
        sheets: category.value,
        fields: 'Name,Icon',
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
    while (section.firstChild)
    {
        section.removeChild(section.firstChild);
    }

    if (data.results.length === 0)
    {
        const heading = document.createElement("h1");
        heading.textContent = "No results found";
        section.appendChild(heading);
        return;
    }

    for (const entry of data.results)
    {
        console.log(entry);

        const article = document.createElement("article");
        const heading = document.createElement("h2");
        const img = document.createElement("img");

        heading.textContent = entry.fields.Name;

        article.appendChild(heading);
        section.appendChild(article);
    }

    // console.log(data.results);
}