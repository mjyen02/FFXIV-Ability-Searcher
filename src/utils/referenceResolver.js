const referenceCache = new Map();

export async function referenceResolver(text, context) {

    const cacheKey = [
        text.toLowerCase().trim(),
        context.mode,
        context.classJobCategory,
        context.ClassJobAbbrev
    ].join("|");

    // Return the existing request/result if cached
    if (referenceCache.has(cacheKey)) {
        return referenceCache.get(cacheKey);
    }

    const baseURL = 'https://v2.xivapi.com/api';

    const url = `${baseURL}/search?query=Name~"${text}"` +
    `&sheets=Action` +
    `&fields=Name,Icon,ClassJobLevel,IsPvP,IsPlayerAction,IsRoleAction,ClassJob,ClassJobCategory,UnlockLink,CastType,ActionCategory,ActionProcStatus,CooldownGroup,PrimaryCostType,PrimaryCostValue,Recast100ms,Cast100ms,Cost,Description` +
    `&transient=Description,Description@as(html)`;

    // Cache the promuse immediately before awaiting it
    const request = (async () => {
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

        const filteredUnusableObjects = matchingMode.filter(result => 
            result.fields.ClassJob.value !== -1)

        const matchingJob = filteredUnusableObjects.filter(result => 
            result.fields.ClassJobCategory?.value === context.classJobCategory
            || result.fields.ClassJob.Abbreviation === context.ClassJobAbbrev
        );

        if (matchingJob.length === 0) {
            return null;
        }

        return matchingJob[0] ?? null;
    })();

    referenceCache.set(cacheKey, request);

    try {
        return await request;
    } catch (error) {
        // Don't cache failures; allow future attempts
        referenceCache.delete(cacheKey);
        return null;
    }

}