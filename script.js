// Defining a baseURL as part of the request URL
const baseURL = 'https://v2.xivapi.com/api';

// Grab references to all the DOM elements you'll need to manipulate
const searchTerm = document.querySelector('.search');
const searchForm = document.querySelector('form');
const category = document.querySelector("#category");
const modeSelector = document.querySelector("#modeSelector");
const lowLevel = document.querySelector("#lowLevel");
const highLevel = document.querySelector("#highLevel");
const jobSelect = document.querySelector("#jobSelect");
const nextBtn = document.querySelector('.next');
const previousBtn = document.querySelector('.prev');
const section = document.querySelector('section');
const nav = document.querySelector('nav');

// Hide the "Previous"/"Next" navigation to begin with, as we don't need it immediately
nav.style.display = 'none';

// Define Global Arrays
let previousCursors = [];
let classJobsFiltered = [];

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

function nextPage()
{
    pageNumber++;
    displayResults();

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
    displayResults();

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

function submitSearch(e)
{
    // Refresh all global parameters
    pageNumber = 0;
    nav.style.display = "none";
    fetchResults(e);
}

async function fetchClassJobs()
{
    // Define a list of jobs to reorganize the selection menu
    const jobOrder = 
    [
        "PLD",
        "WAR",
        "DRK",
        "GNB",
        "MNK",
        "DRG",
        "NIN",
        "SAM",
        "RPR",
        "VPR",
        "WHM",
        "SCH",
        "AST",
        "SGE",
        "BRD",
        "MCH",
        "DNC",
        "BLM",
        "SMN",
        "RDM",
        "PCT",
        "BLU",
        "BST"
    ];

    // Check available sheets
    // const sheetList = await fetch('https://v2.xivapi.com/api/sheet');
    // const sheetListData = await sheetList.json();
    // console.log(sheetListData);
    // const classJobList = sheetListData.sheets.find((result) => result.ame === "ClassJob");
    // console.log("ClassJob Sheet: ", classJobList);
    const params = new URLSearchParams(
        {
            fields: "Name,NameEnglish,Abbreviation,ClassJobParent,JobIndex,IsLimitedJob"
        }
    );

    const classJobList = await fetch(`https://v2.xivapi.com/api/sheet/ClassJob?${params}`);
    const classJobResults = await classJobList.json();
    const classJobs = classJobResults.rows;
    console.log("Pre-filtered ClassJobs: ", classJobs);
    
    classJobsFiltered = classJobs.filter((result) => {
        return result.fields.JobIndex !== 0
    })

    console.log("Post-Filter ClassJobs Array: ", classJobsFiltered);
    classJobsFiltered.sort((a,b) =>
    {
        const aIndex = jobOrder.indexOf(a.fields.Abbreviation);
        const bIndex = jobOrder.indexOf(b.fields.Abbreviation);

        return aIndex - bIndex;
    })
    console.log("Re-arranged Array to Match In-Game: ", classJobsFiltered);

    for (const job of classJobsFiltered)
    {
        const jobOption = document.createElement("option");
        jobOption.textContent = `${job.fields.NameEnglish} (${job.fields.Abbreviation})`;
        jobOption.value = job.fields.Abbreviation;

        if (job.fields.Abbreviation !== job.fields.ClassJobParent.fields.Abbreviation)
        {
            jobOption.textContent += ` / ${job.fields.ClassJobParent.fields.NameEnglish} (${job.fields.ClassJobParent.fields.Abbreviation})`;
        }

        jobSelect.appendChild(jobOption);
    }

    console.log("ClassJob Sheet: ", classJobResults);

    const classJobCategoryList = await fetch('https://v2.xivapi.com/api/sheet/ClassJobCategory/31');
    const classJobCategoryResults = await classJobCategoryList.json();
    console.log("ClassJobCategory Sheet: ", classJobCategoryResults);
}

async function fetchResults(e)
{
    // Use preventDefault() to stop the form submitting
    const heading = document.createElement("h2");
    heading.textContent = `Searching...`;
    section.replaceChildren(heading);

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
        let data = await response.json();

        let allResults = data.results;
        if (data.next)
        {
            let newURL = `${baseURL}/search?${params}&cursor=${data.next}`;
            while (data.next)
            {
                const loopedResponse = await fetch(newURL);
                data = await loopedResponse.json();
                allResults = allResults.concat(data.results);
                newURL = `${baseURL}/search?${params}&cursor=${data.next}`;
            }
        }

        // console.log("Before Filtering:", allResults.map(result => result.fields.Name));
        console.log("allResults Array: ", allResults);
        filteredData = filterResults(allResults);
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
        const sheetTest = await fetch(`${baseURL}/sheet/Action/16574`);
        const testData = await sheetTest.json();
        console.log(testData);

        const pvpSheetTest = await fetch(`${baseURL}/sheet/Action/49072`);
        const pvpTestData = await pvpSheetTest.json();
        console.log(pvpTestData);
    }
    catch (error)
    {
        console.error("Search Error: ", error);
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

    let results = data.filter(
        result => result.fields.ClassJobCategory?.value !== 0 && result.fields.IsPlayerAction === true
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

    if (jobSelect.value !== "all")
    {
        const abbreviationFilter = classJobsFiltered.find(classAbbrev => classAbbrev.fields.Abbreviation === jobSelect.value);

        results = results.filter(result => 
        {
            return result.fields.ClassJob.fields.Abbreviation === abbreviationFilter.fields.Abbreviation
            || result.fields.ClassJob.fields.Abbreviation === abbreviationFilter.fields.ClassJobParent.fields.Abbreviation;
        }
    );
    }

    if (lowLevel.value || highLevel.value)
    {
        results = results.filter(result => 
            {
                const level = result.fields.Level ?? result.fields.ClassJobLevel;

                return (
                    (!lowLevel.value || level >= Number(lowLevel.value)) &&
                    (!highLevel.value || level <= Number(highLevel.value))
                );
            }
        )
    }

    return results;
}

function displayResults()
{
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
        const classInfo = document.createElement("h3");
        const levelInfo = document.createElement("p");
        const img = document.createElement("img");
        const tooltipContainer = document.createElement("div");
        
        // Create Specialized Header Elements
        const abilityHeader = document.createElement("div");
        const abilityHeaderText = document.createElement("div");
        abilityHeader.classList.add("ability-header");
        abilityHeaderText.classList.add("ability-header-text");
        
        // Create class for ability tooltip and icons
        tooltipContainer.classList.add("ability-tooltip");
        levelInfo.classList.add("ability-level");

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
        
        // Get Ability level
        const level = filteredData[i].fields.ClassJobLevel
            ? filteredData[i].fields.ClassJobLevel
            : filteredData[i].fields.Level;

        // Build acquired level text
        const acquiredText = document.createElement("span");
        const levelText = document.createElement("span");

        acquiredText.textContent = "Acquired at: ";
        levelText.textContent = `Level ${level}`;

        acquiredText.classList.add("acquired-text");
        levelText.classList.add("level-text");
        levelInfo.appendChild(acquiredText);
        levelInfo.appendChild(levelText);

        // Fill the created elements with their relevant information
        heading.textContent = filteredData[i].fields.Name;
        classInfo.textContent = `Class/Job: ${filteredData[i].fields.ClassJob.fields.NameEnglish} (${filteredData[i].fields.ClassJob.fields.Abbreviation})`;

        const abilityTooltip = filteredData[i].transient['Description@as(html)'];

        tooltipContainer.insertAdjacentHTML('beforeend', abilityTooltip);

        // Build the header
        abilityHeaderText.appendChild(heading);
        abilityHeaderText.appendChild(classInfo);

        abilityHeader.appendChild(img);
        abilityHeader.appendChild(abilityHeaderText);

        // Insert elements into the page
        article.appendChild(abilityHeader);
        article.appendChild(tooltipContainer);
        article.appendChild(levelInfo);
        section.appendChild(article);
    }

    // console.log(data.results);
}

fetchClassJobs();