// function referenceResolver(text) {
//     // Pseudocode
//     fetch(abilities with text from same job using PvE/PvP filter)
//     if nothing exists, then return an empty result
//     else, call the ability card constructor
// }

export async function referenceResolver(text, context) {
    const baseURL = 'https://v2.xivapi.com/api';

    const url = `${baseURL}/search?query=Name~"${text}"` +
    `&sheets=Action` +
    `&fields=Name,Icon,ClassJobLevel,IsPvP,IsPlayerAction,IsRoleAction,ClassJob,ClassJobCategory,UnlockLink,CastType,ActionCategory,ActionProcStatus,CooldownGroup,PrimaryCostType,PrimaryCostValue,Recast100ms,Cast100ms,Cost,Description` +
    `&transient=Description,Description@as(html)`;

    const response = await fetch(url);

    if (!response.ok) {
        console.error(`Request Failed:  ${response.status}`, url);
        return null;
    }

    const data = await response.json();

    const matchingMode = data.results.filter(result => 
        context.mode === "pvp"
            ? result.fields.IsPvP === true
            : result.fields.IsPvP === false
    );

    const matchingJob = matchingMode.filter(result => 
        result.fields.ClassJobCategory?.value === context.classJobCategory
    );

    if (matchingJob.length === 0) {
        return null;
    }

    return matchingJob[0];
}