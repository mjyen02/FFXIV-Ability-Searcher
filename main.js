// Import functions from other modules
import { fetchResults } from "./api.js";
import { displayResults } from "./results.js";
import { fetchClassJobs } from "./jobs.js";
import { filterResults } from "./filter.js";

// Grab references to all the DOM elements you'll need to manipulate
const searchTerm = document.querySelector('.search');
const searchLabel = document.querySelector('#searchLabel');
const searchForm = document.querySelector('form');
const category = document.querySelector("#category");
const jobSelect = document.querySelector("#jobSelect");
const section = document.querySelector('section');
const nextBtn = document.querySelector('.next');
const previousBtn = document.querySelector('.prev');
const nav = document.querySelector('nav');

// Hide the "Previous"/"Next" navigation to begin with, as we don't need it immediately
nav.style.display = 'none';

// Define Global Arrays
let classJobsFiltered = [];

// Event listeners to control the functionality
classJobsFiltered = await fetchClassJobs();
searchForm.addEventListener("submit", submitSearch);
nextBtn.addEventListener("click", nextPage);
previousBtn.addEventListener("click", prevPage);
jobSelect.addEventListener("change", () => {
    if (jobSelect.value === "all")
    {
        searchTerm.required = true;
        searchLabel.textContent = "Enter search term (required if no Job selected): ";
    }
    else
    {
        searchTerm.required = false;
        searchLabel.textContent = "Search Term (Optional): ";
    }
})

// Define variable to page through filtered data
let pageNumber = 0;
let filteredData = [];
const totalDisplayed = 10;

// Dark Mode Button
const darkModeButton = document.querySelector("#darkMode");
darkModeButton.addEventListener("click", () => 
{
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode"))
    {
        darkModeButton.textContent = "Light Mode";
    }
    else
    {
        darkModeButton.textContent = "Dark Mode";
    }
});

function nextPage()
{
    pageNumber++;

    const startIndex = pageNumber * totalDisplayed;
    const endIndex = Math.min(
        startIndex + totalDisplayed,
        filteredData.length
    );

    displayResults(filteredData, startIndex, endIndex);

    const lastPage = Math.ceil(filteredData.length / totalDisplayed) - 1;
    if (pageNumber >= lastPage)
    {
        nextBtn.style.display = 'none';
    }
    previousBtn.style.display = 'block';
}

function prevPage()
{
    pageNumber--;

    const startIndex = pageNumber * totalDisplayed;
    const endIndex = Math.min(
        startIndex + totalDisplayed,
        filteredData.length
    );

    displayResults(filteredData, startIndex, endIndex);

    if (pageNumber === 0)
    {
        previousBtn.style.display = "none";
    }

    const lastPage = Math.ceil(filteredData.length / totalDisplayed) - 1;
    if (pageNumber < lastPage)
    {
        nextBtn.style.display = 'block';
    }
}

async function submitSearch(e)
{
    // Use preventDefault() to stop the form submitting
    e.preventDefault();

    // Refresh all global parameters
    pageNumber = 0;
    nav.style.display = "none";

    // Display Searching State
    const heading = document.createElement("h2");
    heading.textContent = `Searching...`;
    section.replaceChildren(heading);

    try
    {
        const data = await fetchResults(
            category.value, 
            searchTerm.value, 
            jobSelect.value, 
            classJobsFiltered,
        );

        // console.log("Before Filtering:", allResults.map(result => result.fields.Name));
        console.log("allResults Array: ", data);
        filteredData = filterResults(data, category.value, classJobsFiltered);
        console.log("Filtered Data:", filteredData);

        // Enable pagination buttons if limit exceeded
        if (filteredData.length > totalDisplayed)
        {
            nextBtn.style.display = 'block';
            nav.style.display = 'block'
        }
        else
        {
            nextBtn.style.display = 'none';
        }

        if (pageNumber > 0)
        {
            previousBtn.style.display = 'block';
        }
        else
        {
            previousBtn.style.display = 'none';
        }

        const startIndex = pageNumber * totalDisplayed;
        const endIndex = Math.min(
            startIndex + totalDisplayed,
            filteredData.length
        );

        displayResults(filteredData, startIndex, endIndex);
    }
    catch (error)
    {
        console.error("Search Error: ", error);
        heading.textContent = `An error occured during the search`;
        return;
    }
}

