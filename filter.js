// Reference to relevant filtering fields
const modeSelector = document.querySelector("#modeSelector");
const lowLevel = document.querySelector("#lowLevel");
const highLevel = document.querySelector("#highLevel");
const jobSelect = document.querySelector("#jobSelect");

export function filterResults(data, categoryValue, classJobsFiltered)
{
    let results;
    
    if (categoryValue === "Action")
    {
        results = data.filter(
            result =>
                result.fields.ClassJobCategory?.value !== 0 &&
                result.fields.IsPlayerAction === true
        );
    }
    else if (categoryValue === "Trait")
    {   
        results = data;
    }

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

    console.log("List before level sorting: ", results);
    // Sort skills in ascending order before returning
    results.sort((a, b) => {
        const levelA = a.fields.Level ?? a.fields.ClassJobLevel;
        const levelB = b.fields.Level ?? b.fields.ClassJobLevel;

        return levelA - levelB;
    });
    console.log("List after level sorting: ", results);

    return results;
}