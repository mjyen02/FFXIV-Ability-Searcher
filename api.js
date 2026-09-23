// Defining a baseURL as part of the request URL
const baseURL = 'https://v2.xivapi.com/api';

export async function fetchResults(categoryValue, searchTermValue, jobSelectValue, classJobsFiltered, classJobCategory)
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

    // Assign config based on selected sheet
    const config = searchConfigs[categoryValue];

    // Construct parameters for searching for relevant fields
    const params = new URLSearchParams({
        sheets: categoryValue,
        fields: config.fields,
        transient: 'Description@as(html)',
        sort: "Name"
    });

    let allResults = [];
    let jobRowId;
    let parentRowId;
    let categoryRowId;

    if (jobSelectValue && jobSelectValue !== "all")
    {
        const classFilter = classJobsFiltered.find(
            classAbbrev => classAbbrev.fields.Abbreviation === jobSelectValue
        );

        const categoryFilter = classJobCategory.find(
            category => category.fields.Name === jobSelectValue
        );
        console.log("Selected Job Category: ", categoryFilter);

        console.log("API Class Filter Abbreviation: ", classFilter.fields.Abbreviation);
        jobRowId = classFilter.row_id;
        parentRowId = classFilter.fields.ClassJobParent.row_id;
        categoryRowId = categoryFilter.row_id;

        console.log(
            "WAR ClassJobCategory:",
            classFilter.fields.ClassJobCategory
        );
    }

    if (jobSelectValue && jobSelectValue !== "all" && searchTermValue)
    {
        params.set(
            'query',
            `+ClassJobCategory=${categoryRowId} +Name~"${searchTermValue}"`
        );

        const jobResponse = await fetch(`${baseURL}/search?${params}`);
        const jobData = await jobResponse.json();   

        allResults = jobData.results;

        if (parentRowId !== jobRowId)
        {
            // Search the parent class too
            params.set(
            'query',
            `+ClassJob=${parentRowId} +Name~"${searchTermValue}"`
        );

            const parentResponse = await fetch(`${baseURL}/search?${params}`);
            const parentData = await parentResponse.json();
            allResults = allResults.concat(parentData.results);

        }
    }
    else if (jobSelectValue && jobSelectValue !== "all")
    {
        // Search selected job
        const categoryFilter = classJobCategory.find(
            category => category.fields.Name === jobSelectValue
        );
        console.log("Selected Job Category: ", categoryFilter);
        params.set('query', `ClassJobCategory=${categoryRowId}`);

        const jobResponse = await fetch(`${baseURL}/search?${params}`);
        const jobData = await jobResponse.json();

        allResults = jobData.results;

        // Search parent/base class
        params.set('query', `ClassJob=${parentRowId}`);

        const parentResponse = await fetch(`${baseURL}/search?${params}`);
        const parentData = await parentResponse.json();

        allResults = allResults.concat(parentData.results);

        allResults = [
            ...new Map(
                allResults.map(action => [action.row_id, action])
            ).values()
];
    }
    else
    {
        params.set('query', `Name~"${searchTermValue}"`);

        const response = await fetch(`${baseURL}/search?${params}`);
        const data = await response.json();

        allResults = data.results;
    }

    // Fields use to test sheets directly for field data
    const testParams = new URLSearchParams({
        sheets: 'Action',
        fields: 'Name,ClassJobCategory,ClassJob,ClassJobLevel,IsPlayerAction,IsRoleAction,IsPvP',
        query: 'ClassJobCategory=22'
    });

    const sheetTest = await fetch(`${baseURL}/search?${testParams}`);
    const testData = await sheetTest.json();

    console.log(testData);
    // const pvpSheetTest = await fetch(`${baseURL}/sheet/Action/49072`);
    // const pvpTestData = await pvpSheetTest.json();
    // console.log(pvpTestData);

    return allResults; 
}