export function sortAbilities(allResults, classJobs)
{
    const sortedResults = allResults.sort((a,b) => {
        const jobDifference = getJobGroup(a, classJobs).localeCompare(getJobGroup(b, classJobs));

        if (jobDifference !== 0)
        {
            return jobDifference;
        }

        const aLevel = a.fields.ClassJobLevel ? a.fields.ClassJobLevel : a.fields.Level;
        const bLevel = b.fields.ClassJobLevel ? b.fields.ClassJobLevel : b.fields.Level;

        const levelDifference = aLevel - bLevel;
        if (levelDifference !== 0)
        {
            return levelDifference;
        }
        
        return a.fields.Name.localeCompare(b.fields.Name);
    })
    console.log("Sorted Results: ", sortedResults);
    return sortedResults;
}

function getJobGroup(ability, classJobs)
{
    const categoryName = ability.fields.ClassJobCategory.fields.Name;

    if (!categoryName)
    {
        return "";
    }

    const abbreviations = categoryName.split(" ");

    const job = classJobs.find((classJob) => 
        abbreviations.includes(classJob.fields.Abbreviation) &&
        classJob.fields.JobIndex !== 0
    );

    return job?.fields?.Abbreviation ?? categoryName;
}