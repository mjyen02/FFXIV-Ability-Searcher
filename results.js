// Defining a baseURL as part of the request URL for image acquisition
const baseURL = 'https://v2.xivapi.com/api';

// Grab references to DOM elements needed for manipulation
const section = document.querySelector('section');

export function displayResults(filteredData, startIndex, endIndex)
{
    // Clear all previous elements when updating display
    while (section.firstChild)
    {
        section.removeChild(section.firstChild);
    }

    // Display "No results found on 0 matching elements"
    if (filteredData.length === 0)
    {
        const heading = document.createElement("h2");
        heading.textContent = "No results found";
        section.appendChild(heading);
        return;
    }

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
        classInfo.textContent = `Class/Job: ${filteredData[i].fields?.ClassJob.fields.NameEnglish} (${filteredData[i].fields?.ClassJob.fields.Abbreviation})`;

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