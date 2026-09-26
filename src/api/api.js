// Defining a baseURL as part of the request URL
const baseURL = 'https://v2.xivapi.com/api';

export async function fetchResults(searchTermValue, SelectedJob, classJobCategory, classJobsFiltered, filters)
{   
    // Configuration Object to handle different types of requests
    const searchConfigs = 
    {
        Action: 
        {
            fields: "Name,Icon,ClassJobLevel,IsPvP,IsPlayerAction,IsRoleAction,ClassJob,ClassJobCategory,UnlockLink,CastType,ActionCategory",
            levelField: "ClassJobLevel"
        },
        Trait: 
        {
            fields: "Name,Icon,Level,ClassJob,ClassJobCategory",
            levelField: "Level"
        }
    };
    const config = searchConfigs[filters.type];
    let baseQuery = `+${config.levelField}>=${filters.minLevel} +${config.levelField}<=${filters.maxLevel}`;
    // Construct parameters for searching for relevant fields
    const params = new URLSearchParams({
        sheets: filters.type,
        fields: config.fields,
        transient: 'Description@as(html)',
        sort: "Name",
    });

    if (filters.mode === "pvp" && filters.type === "Action")
    {
        baseQuery += " +IsPvP=true -ClassJobCategory=0";
    }

    let allResults = [];

    if (SelectedJob && SelectedJob !== "all")
    {
        const categoryFilter = classJobCategory.find(
            category => category.fields.Name === SelectedJob
        );

        const classFilter = classJobsFiltered.find(
            classAbbrev => classAbbrev.fields.Abbreviation === SelectedJob
        );

        const jobRowId = classFilter.row_id;
        const parentRowId = classFilter.fields.ClassJobParent.row_id;
        const categoryRowId = categoryFilter.row_id;
        if (searchTermValue)
        {
            params.set(
                'query',
                `${baseQuery} +ClassJobCategory=${categoryRowId} +Name~"${searchTermValue}"`
            );

            const jobResponse = await fetch(`${baseURL}/search?${params}`);
            const jobData = await jobResponse.json();   

            allResults = jobData.results;

            if (parentRowId !== jobRowId)
            {
                // Search the parent class too
                params.set(
                    'query',
                    `${baseQuery} +ClassJob=${parentRowId} +Name~"${searchTermValue}"`
                );
                const parentResponse = await fetch(`${baseURL}/search?${params}`);
                const parentData = await parentResponse.json();
                allResults = allResults.concat(parentData.results);
            }
        }
        else
        {
            // Search selected job
            params.set('query', `${baseQuery} +ClassJobCategory=${categoryRowId}`);

            const jobResponse = await fetch(`${baseURL}/search?${params}`);
            const jobData = await jobResponse.json();

            allResults = jobData.results;

            if (parentRowId !== jobRowId)
            {
                // Search the parent class too
                params.set('query', `${baseQuery} +ClassJob=${parentRowId}`);

                const parentResponse = await fetch(`${baseURL}/search?${params}`);
                const parentData = await parentResponse.json();

                allResults = allResults.concat(parentData.results);
            }
        }
    }
    else
    {
        params.set('query', `${baseQuery} +Name~"${searchTermValue}" -ClassJobCategory=0`);
        console.log(params.get("query"));

        const response = await fetch(`${baseURL}/search?${params}`);
        let data = await response.json();
        allResults = data.results;
        console.log(data.results.map(result => result.fields.Name));
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
    }

        // Sort skills in ascending order before returning
        allResults.sort((a, b) => {
            const levelA = a.fields.Level ?? a.fields.ClassJobLevel;
            const levelB = b.fields.Level ?? b.fields.ClassJobLevel;

            return levelA - levelB;
        });

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