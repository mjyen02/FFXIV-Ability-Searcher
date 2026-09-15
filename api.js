// Defining a baseURL as part of the request URL
const baseURL = 'https://v2.xivapi.com/api';

export async function fetchResults(categoryValue, searchTermValue)
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
        query: `Name~"${searchTermValue}"`,
        sort: "Name"
    });

    // Assemble the full URL
    let url = `${baseURL}/search?${params}`;
    console.log(url);

    // Fetch the api
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

    // Fields use to test sheets directly for field data
    // const sheetTest = await fetch(`${baseURL}/sheet/Action/16574`);
    // const testData = await sheetTest.json();
    // console.log(testData);

    // const pvpSheetTest = await fetch(`${baseURL}/sheet/Action/49072`);
    // const pvpTestData = await pvpSheetTest.json();
    // console.log(pvpTestData);

    return allResults; 
}