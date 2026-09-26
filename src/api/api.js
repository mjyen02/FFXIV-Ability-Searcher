// Defining a baseURL as part of the request URL
const baseURL = 'https://v2.xivapi.com/api';

export async function fetchResults(searchTermValue, SelectedJob)
{   
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

    // Construct parameters for searching for relevant fields
    const params = new URLSearchParams({
        sheets: "Action",
        fields: searchConfigs.Action.fields,
        transient: 'Description@as(html)',
        sort: "Name"
    });

    let allResults = [];
    params.set('query', `Name~"${searchTermValue}"`);

    const response = await fetch(`${baseURL}/search?${params}`);
    const data = await response.json();
    allResults = data.results;

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

    return allResults;
}

export async function fetchClassJobs()
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
    
    const classJobsFiltered = classJobs.filter((result) => {
        return result.fields.JobIndex !== 0
    })

    classJobsFiltered.sort((a,b) =>
    {
        const aIndex = jobOrder.indexOf(a.fields.Abbreviation);
        const bIndex = jobOrder.indexOf(b.fields.Abbreviation);

        return aIndex - bIndex;
    })

    return classJobsFiltered;
}

export async function fetchClassJobCategory()
{
    const classJobCategoryList = await fetch(
        'https://v2.xivapi.com/api/sheet/ClassJobCategory'
    );

    let classJobCategoryResults = await classJobCategoryList.json();
    let allResults = classJobCategoryResults.rows;

    while (classJobCategoryResults.rows.length === 100)
    {
        const lastRow = classJobCategoryResults.rows.at(-1);

        const newURL =
            `https://v2.xivapi.com/api/sheet/ClassJobCategory?after=${lastRow.row_id}`;

        const loopedResponse = await fetch(newURL);
        classJobCategoryResults = await loopedResponse.json();

        allResults = allResults.concat(classJobCategoryResults.rows);
    }

    return allResults;
}