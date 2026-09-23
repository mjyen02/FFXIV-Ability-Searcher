// Import linked ability card data
import { fetchAbilityByName } from "./api.js";

// Defining a baseURL as part of the request URL for image acquisition
const baseURL = 'https://v2.xivapi.com/api';

// Grab references to DOM elements needed for manipulation
const section = document.querySelector('section');
const modeSelector = document.querySelector("#modeSelector");

let tooltipHovered = false;
let tooltipHideTimeout;

let nestedTooltipHovered = false;
let nestedTooltipHideTimeout;

export async function displayResults(filteredData, startIndex, endIndex, classJobCategory)
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
        const popUp = await fetchAbilityByName(filteredData[i].fields.Name, filteredData[i].fields.ClassJobCategory.row_id);

        console.log("Gekko:", popUp);

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
        
        // Check for PvP to remove level text
        if (modeSelector.value !== "pvp")
        {
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
        }

        // Fill the created elements with their relevant information
        heading.textContent = filteredData[i].fields.Name;
        // console.log("Tendo Goken ClassJobCategory:",
        //     filteredData[i].fields.ClassJobCategory
        // );
        
        // console.log("Category array:", classJobCategory);
        // console.log("Category array length:", classJobCategory.length);
        // console.log(
        //     "Tendo Goken category ID:",
        //     filteredData[i].fields.ClassJobCategory?.[0]?.row_id
        // );
        // console.log(
        //     "Matching category:",
        //     classJobCategory.find(
        //         category => category.row_id === 111
        //     )
        // );

        // console.log(
        //     "ClassJobCategory object:",
        //     filteredData[i].fields.ClassJobCategory
        // );

        // console.log(
        //     "ClassJobCategory row_id:",
        //     filteredData[i].fields.ClassJobCategory.row_id
        // );

        // console.log(
        //     "ClassJobCategory value:",
        //     filteredData[i].fields.ClassJobCategory.value
        // );

        const abilityTooltip = filteredData[i].transient['Description@as(html)'];
        const parser = new DOMParser();
        const doc = parser.parseFromString(abilityTooltip, "text/html");
        const spanList = doc.getElementsByTagName("span");
        let orangeList = [];

        for (const spanElement of spanList)
        {
            if (spanElement.style.color === "rgb(255, 123, 26)")
            {
                
                orangeList.push(spanElement);
            }
        }
        
        for (const spanElement of orangeList)
        {
            spanElement.classList.add("ability-link");
            console.log("Orange List: ", spanElement);    
        }

        const abilityLinks = doc.querySelectorAll(".ability-link");
        console.log(abilityLinks);

        const category = classJobCategory.find(
            category => category.row_id === filteredData[i].fields.ClassJobCategory?.row_id
        );

        const linkedAbilityCache = new Map();

        const linkedToolTip = document.createElement("div");
        linkedToolTip.classList.add("linked-ability-tooltip");
        document.body.appendChild(linkedToolTip);

        const nestedToolTip = document.createElement("div");
        nestedToolTip.classList.add("linked-ability-tooltip");
        nestedToolTip.style.display = "none";

        document.body.appendChild(nestedToolTip);
        setupNestedTooltip(nestedToolTip);

        linkedToolTip.addEventListener("mouseenter", () =>
        {
            clearTimeout(tooltipHideTimeout);
            tooltipHovered = true;
        });

        linkedToolTip.addEventListener("mouseleave", () =>
        {
            tooltipHovered = false;
            tooltipHideTimeout = setTimeout(() => 
            {
                if (!tooltipHovered)
                {
                    linkedToolTip.style.display = "none";
                }
            }, 100);
        });

        for (const abilityLink of abilityLinks)
        {
            setupAbilityLink(abilityLink, linkedToolTip, nestedToolTip, linkedAbilityCache, category);
        }

        // const cleanedOrangeList = orangeList.map(item => item.textContent);
        // console.log("Clean Orange List: ", cleanedOrangeList);

        // const abilityList = await Promise.all(cleanedOrangeList.map(item => fetchAbilityByName(item, category.row_id)));
        // console.log("AbilityList using Map: ", abilityList);

        classInfo.textContent = `Class/Job: ${category?.fields.Name ?? "Unknown"}`;
        tooltipContainer.appendChild(...doc.body.childNodes);

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

function setupAbilityLink(abilityLink, linkedToolTip, nestedToolTip, linkedAbilityCache, category)
{
    abilityLink.addEventListener("mouseenter", async () =>
    {
        clearTimeout(tooltipHideTimeout);
        const cacheKey = abilityLink.textContent;
        let linkedAbilityCard;

        if (linkedAbilityCache.has(cacheKey))
        {
            linkedAbilityCard = linkedAbilityCache.get(cacheKey);
            console.log("Using cached ability");
        }
        else
        {
            linkedAbilityCard = await fetchAbilityByName(
                abilityLink.textContent,
                category.row_id
            );

            linkedAbilityCache.set(cacheKey, linkedAbilityCard);
            console.log("Fetched and cached ability");
        }

        const linkedDescription = buildAbilityTooltip(linkedAbilityCard, linkedToolTip);

            // Inspect the spans in this description
        const linkedSpanList =
            linkedDescription.getElementsByTagName("span");

        for (const spanElement of linkedSpanList)
        {
            console.log(
                spanElement.style.color,
                spanElement.textContent
            );

            if (spanElement.style.color === "rgb(255, 123, 26)")
            {
                spanElement.classList.add("ability-link");
            }
        }

        console.log(linkedDescription.querySelectorAll(".ability-link"));
        const nestedAbilityLinks =
        linkedDescription.querySelectorAll(".ability-link");

        for (const nestedAbilityLink of nestedAbilityLinks)
        {
            setupNestedAbilityLink(nestedAbilityLink, nestedToolTip, linkedAbilityCache, category);
        }
        
        // Display linked ability tooltip
        linkedToolTip.style.display = "block";
        
        const linkPosition = abilityLink.getBoundingClientRect();
        linkedToolTip.style.left = `${linkPosition.left}px`;
        linkedToolTip.style.top = `${linkPosition.bottom - 2}px`;

        const tooltipHeight = linkedToolTip.offsetHeight;
        const tooltipWidth = linkedToolTip.offsetWidth;

        if (linkPosition.left + tooltipWidth > window.innerWidth)
        {
            linkedToolTip.style.left = `${window.innerWidth - tooltipWidth}px`;
        }
        else
        {
            linkedToolTip.style.left = `${linkPosition.left}px`;
        }

        if (linkPosition.bottom + tooltipHeight > window.innerHeight)
        {
            linkedToolTip.style.top = `${linkPosition.top - tooltipHeight + 2}px`;
        }
        else
        {
            linkedToolTip.style.top = `${linkPosition.bottom - 2}px`;
        }
    });

    abilityLink.addEventListener("mouseleave", () =>
    {
        tooltipHideTimeout = setTimeout(() =>
        {
            if (!tooltipHovered)
            {
                linkedToolTip.style.display = "none";
            }
        }, 100);
    });
}

function setupNestedAbilityLink(nestedAbilityLink, nestedToolTip, linkedAbilityCache, category)
{
    nestedAbilityLink.addEventListener("mouseenter", async () =>
    {
        console.log("Nested ability hovered:", nestedAbilityLink.textContent);
        clearTimeout(tooltipHideTimeout);
        tooltipHovered = true;

        const cacheKey = nestedAbilityLink.textContent;
        let nestedAbilityCard;

        if (linkedAbilityCache.has(cacheKey))
        {
            nestedAbilityCard = linkedAbilityCache.get(cacheKey);
            console.log("Using cached nested ability");
        }
        else
        {
            nestedAbilityCard = await fetchAbilityByName(
                nestedAbilityLink.textContent,
                category.row_id
            );

            linkedAbilityCache.set(cacheKey, nestedAbilityCard);
            console.log("Fetched and cached nested ability");
        }

        const nestedDescription = buildAbilityTooltip(nestedAbilityCard, nestedToolTip);
        
        const nestedPosition =
            nestedAbilityLink.getBoundingClientRect();

        nestedToolTip .style.left = `${nestedPosition.right + 5}px`;
        nestedToolTip .style.top = `${nestedPosition.top}px`;

        const nestedSpanList =
            nestedDescription.getElementsByTagName("span");

        for (const spanElement of nestedSpanList)
        {
            if (spanElement.style.color === "rgb(255, 123, 26)")
            {
                spanElement.classList.add("ability-link");
            }
        }

        console.log(
            "Nested links:",
            nestedDescription.querySelectorAll(".ability-link")
        );


        nestedToolTip.style.display = "block";
    });

    nestedAbilityLink.addEventListener("mouseleave", () =>
    {
        nestedTooltipHideTimeout = setTimeout(() =>
        {
            if (!nestedTooltipHovered)
            {
                nestedToolTip.style.display = "none";
            }
        }, 100);
    });
}

function setupNestedTooltip(nestedToolTip)
{
    nestedToolTip.addEventListener("mouseenter", () =>
    {
        clearTimeout(nestedTooltipHideTimeout);
        nestedTooltipHovered = true;
    });

    nestedToolTip.addEventListener("mouseleave", () =>
    {
        nestedTooltipHovered = false;

        nestedTooltipHideTimeout = setTimeout(() =>
        {
            if (!nestedTooltipHovered)
            {
                nestedToolTip.style.display = "none";
            }
        }, 100);
    });
}

function buildAbilityTooltip(ability, tooltip)
{
    const hoverIconParam = new URLSearchParams({
        path: ability.fields.Icon?.path_hr1,
        format: 'jpg'
    });

    const linkedIcon = document.createElement("img");
    linkedIcon.src = `${baseURL}/asset?${hoverIconParam}`;
    linkedIcon.alt = `Icon for ${ability.fields.Name}`;

    console.log(ability.fields.Icon);
    console.log("Icon URL:", linkedIcon.src);

    const linkedName = document.createElement("span");
    linkedName.textContent = ability.fields.Name;

    const linkedHeader = document.createElement("div");
    linkedHeader.classList.add("linked-ability-header");

    linkedHeader.appendChild(linkedIcon);
    linkedHeader.appendChild(linkedName);

    const linkedLevel = document.createElement("p");
    linkedLevel.textContent = `Level ${ability.fields.ClassJobLevel}`;

    const linkedDescription = document.createElement("p");
    linkedDescription.classList.add("linked-ability-description");

    linkedDescription.innerHTML =
        ability.transient["Description@as(html)"];

    tooltip.replaceChildren();
    tooltip.appendChild(linkedHeader);
    tooltip.appendChild(linkedLevel);
    tooltip.appendChild(linkedDescription);

    return linkedDescription;
}