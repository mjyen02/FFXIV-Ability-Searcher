// Reference to relevant filtering fields
const modeSelector = document.querySelector("#modeSelector");
const lowLevel = document.querySelector("#lowLevel");
const highLevel = document.querySelector("#highLevel");
const jobSelect = document.querySelector("#jobSelect");

export function filterResults(data, classJobsFiltered)
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