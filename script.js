// Defining a baseURL as part of the request URL
const baseURL = 'https://v2.xivapi.com/api';

// Grab references to all the DOM elements you'll need to manipulate
const searchTerm = document.querySelector('.search');
const searchForm = document.querySelector('form');
const category = document.querySelector("#category");
const modeSelector = document.querySelector("#modeSelector");
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
previousBtn.addEventListener("click", prevPage);

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

// Scrapping old pagination which uses the XIVAPI search directly. 
// function nextPage(e)
// {
//     // Push the current cursor ID to an array to make it accessible via the previous page function
//     previousCursors.push(nextCursor);
//     fetchResults(e);
// }

// function previousPage(e)
// {
//     // Check if previousCursors array is only on second page to handle edge case
//     if (previousCursors.length === 1)
//     {
//         previousCursors.pop();
//         nextCursor = null;
//     }
//     // Else backtrack one page
//     if (previousCursors.length > 1)
//     {
//         nextCursor = previousCursors.pop();
//     }

//     fetchResults(e);
// }

function nextPage()
{
    const lastPage = Math.ceil(filteredData.length / totalDisplayed) - 1;

    if (pageNumber >= lastPage)
    {
        return;
    }

    pageNumber++;
    displayResults();
}

function prevPage()
{
    if (pageNumber === 0)
    {
        return;
    }
    else
    {
        pageNumber--;
        displayResults();
    }
}
function submitSearch(e)
{
    // Refresh all global parameters
    pageNumber = 0;
    nav.style.display = "none";
    fetchResults(e);
}

async function fetchResults(e)
{
    // Use preventDefault() to stop the form submitting
    e.preventDefault();

    // Configuration Object to handle different types of requests
    const searchConfigs = 
    {
        Action: 
        {
            fields: "Name,Icon,ClassJobLevel,IsPvP,IsPlayerAction,IsRoleAction,ClassJob,ClassJobCategory,UnlockLink,CastType,ActionCategory"
        },
        Trait: 
        {
            fields: "Name,Icon,Level,ClassJob"
        }
    };

    // Assign config based on selected sheet
    const config = searchConfigs[category.value];

    // Construct parameters for searching for relevant fields
    const params = new URLSearchParams({
        sheets: category.value,
        fields: config.fields,
        transient: 'Description@as(html)',
        query: `Name~"${searchTerm.value}"`,
        sort: "Name"
    });

    // Assemble the full URL
    let url = `${baseURL}/search?${params}`;
    console.log(url);

    // Fetch the api
    try
    {
        const response = await fetch(url);
        const data = await response.json();

        console.log("Before Filtering:", data.results.map(result => result.fields.Name));
        filteredData = filterResults(data);
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

        displayResults();

        // Fields use to test sheets directly for field data
        const sheetTest = await fetch(`${baseURL}/sheet/Trait/460`);
        const testData = await sheetTest.json();
        console.log(testData);

        // const pvpSheetTest = await fetch(`${baseURL}/sheet/Action/47438`);
        // const pvpTestData = await pvpSheetTest.json();
        // console.log(pvpTestData);
    }
    catch (error)
    {
        console.error("Search Error: ", error);

        const heading = document.createElement("h2");
        heading.textContent = `An error occured during the search`;

        section.replaceChildren(heading);
    }
}

function filterResults(data)
{
    // Used for testing various fields during examination of IsPlayerAction
    // console.log("API Results: ", data.results);

    // for (const result of data.results)
    // {
    //     console.log(
    //         result.fields.Name,
    //         "IsPlayerAction:",
    //         result.fields.IsPlayerAction,
    //         "IsPvP:",
    //         result.fields.IsPvP
    //     )
    // }

    let results = data.results.filter(
        result => result.fields.ClassJobCategory?.value !== 0
    );

    console.log("After initial filter: ", results);

    if (modeSelector.value === "pve")
    {
        results = results.filter(
            result => result.fields.IsPvP !== true
        );
        console.log("After IsPvP Filter:", results);
    }

    if (modeSelector.value === "pvp")
    {
        results = results.filter(
            result => result.fields.IsPvP === true
        );
    }
    return results;
}

function displayResults()
{
    console.log(`prevCursor Length: ${previousCursors.length}`);
    console.log(`Cursor: ${nextCursor}`);

    // Clear all previous elements when updating display
    while (section.firstChild)
    {
        section.removeChild(section.firstChild);
    }

    // Display "No results found on 0 matching elements"
    if (filteredData.length === 0)
    {
        const heading = document.createElement("h1");
        heading.textContent = "No results found";
        section.appendChild(heading);
        return;
    }

    const startIndex = pageNumber * totalDisplayed;
    const endIndex = Math.min(
        startIndex + totalDisplayed,
        filteredData.length
    );

    // Iterate data array to begin populating the page with elements
    for (let i = startIndex; i < endIndex; i++)
    {
        // // Fields Testing
        // console.log(
        //     entry.fields.Name,
        //     "ID:", entry.row_id,
        //     "Player:", entry.fields.IsPlayerAction,
        //     "PvP:", entry.fields.IsPvP,
        //     "Role:", entry.fields.IsRoleAction,
        //     "ClassJob:", entry.fields.ClassJob?.value,
        //     "ClassJobCategory:", entry.fields.ClassJobCategory?.value,
        //     "Level:", entry.fields.ClassJobLevel,
        //     "Unlock:", entry.fields.UnlockLink?.value,
        //     "CastType:", entry.fields.CastType,
        //     "ActionCategory:", entry.fields.ActionCategory?.value
        // );

        console.log(filteredData[i]);

        // Construct elements of article
        const article = document.createElement("article");
        const heading = document.createElement("h2");
        const levelInfo = document.createElement("h3");
        const img = document.createElement("img");
        const tooltipContainer = document.createElement("div");
        
        // Create class for ability tooltip and icons
        tooltipContainer.classList.add("ability-tooltip");
        img.classList.add("ability-icon");

        const iconPath = filteredData[i].fields.Icon?.path_hr1;

        if (iconPath)
        {
            // Construct Parameter to obtain ability images
            const iconParams = new URLSearchParams({
                path: iconPath,
                format: 'jpg'
            });

            img.src = `${baseURL}/asset?${iconParams}`;
            img.alt = `Icon for ${filteredData[i].fields.Name}`;
        }
        else
        {
            img.alt = "No Icon Available";
        }
        
        // Fill the created elements with their relevant information
        heading.textContent = filteredData[i].fields.Name;
        levelInfo.textContent = `Class Level: ${filteredData[i].fields.ClassJobLevel
            ? filteredData[i].fields.ClassJobLevel
            : filteredData[i].fields.Level
        }`;
        const abilityTooltip = filteredData[i].transient['Description@as(html)'];

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