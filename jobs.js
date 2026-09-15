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
    console.log("Pre-filtered ClassJobs: ", classJobs);
    
    const classJobsFiltered = classJobs.filter((result) => {
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

    // const classJobCategoryList = await fetch('https://v2.xivapi.com/api/sheet/ClassJobCategory/31');
    // const classJobCategoryResults = await classJobCategoryList.json();
    // console.log("ClassJobCategory Sheet: ", classJobCategoryResults);

    return classJobsFiltered;
}