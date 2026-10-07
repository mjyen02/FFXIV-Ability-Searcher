// Defining a baseURL as part of the request URL
const baseURL = 'https://v2.xivapi.com/api';

export async function fetchResults(
	searchTermValue,
	SelectedJob,
	classJobCategory,
	classJobsFiltered,
	filters
) {
	// Configuration Object to handle different types of requests
	const searchConfigs = {
		Action: {
			fields: `Name,Icon,ClassJobLevel,IsPvP,IsPlayerAction,IsRoleAction,ClassJob,ClassJobCategory,UnlockLink,CastType,ActionCategory,ActionProcStatus,
            CooldownGroup,PrimaryCostType,PrimaryCostValue,Recast100ms,Cast100ms,Cost,Description`,
			levelField: 'ClassJobLevel'
		},
		Trait: {
			fields: 'Name,Icon,Level,ClassJob,ClassJobCategory',
			levelField: 'Level'
		}
	};

	// Set the Action/Trait search from the search form
	const config = searchConfigs[filters.type];

	// Create an initial list of items to be queried based on certain criteria
	const queryConditions = [];

	// Apply level filtering to PvE actions only
	if (!(filters.mode === 'pvp' && filters.type === 'Action')) {
		queryConditions.push(
			`+${config.levelField}>=${filters.minLevel}`,
			`+${config.levelField}<=${filters.maxLevel}`
		);
	}

	if (filters.type === 'Action') {
		if (filters.mode === 'pvp') {
			queryConditions.push('+IsPvP=true');
		} else {
			queryConditions.push('+IsPvP=false');
		}
	}

	if (filters.mode !== 'pvp') {
		queryConditions.push('-ClassJobCategory=0');
	}

	const baseQuery = queryConditions.join(' ');
	// Construct parameters for searching for relevant fields
	const params = new URLSearchParams({
		sheets: filters.type,
		fields: config.fields,
		transient: 'Description@as(html),Description',
		sort: 'Name'
	});

	// Construct the array for all the objects to be displayed
	let allResults = [];

	// Make a universal Search Term for both searching and empty field
	const searchCondition =
		searchTermValue.trim() !== '' ? ` +Name~"${searchTermValue}"` : ``;

	if (SelectedJob && SelectedJob !== 'all') {
		// Fetch results related to having a Job Selected
		allResults = await searchSelectedJob(
			classJobCategory,
			classJobsFiltered,
			SelectedJob,
			params,
			baseQuery,
			searchCondition
		);
	} else {
		// Fetch Results for Search Term Only
		allResults = await searchByTerm(params, baseQuery, searchCondition);
	}

	// Sort skills in ascending level order before returning
	allResults = sortResultsByLevel(allResults);

	// Remove unusable actions from searches
	allResults = removeInvalidActions(allResults, filters.mode);

	// Remove duplicated objects, likely made to have different potencies for the same ability easier to calculate
	allResults = removeDuplicates(allResults);
	// debugDescription(allResults[0]);

	return allResults;
}

function debugDescription(result) {
	console.log("========== DESCRIPTION DEBUG ==========");
    console.log("Name:", result.fields.Name);
    console.log("HTML:", result.transient?.["Description@as(html)"]);
}

async function debugReferenceSearch() {
    const searches = [
        {
            sheet: "Status",
            name: "Meisui"
        },
        {
            sheet: "Action",
            name: "Meisui"
        },
		{
			sheet: "Action",
			name: "Bhavachakra"
		},
		{
			sheet: "Action",
			name: "Zesho Meppo"
		},
		{
			sheet: "Action",
			name: "Dokumori"
		}
	]
    for (const search of searches) {
        const fields = search.sheet === "Action"
            ? "Name,Icon,ClassJobLevel,IsPvP,IsPlayerAction,IsRoleAction,ClassJob,ClassJobCategory,ActionCategory,UnlockLink"
            : search.sheet === "Status"
                ? "Name,Icon,Param0,Param1,Param2,Param3,Param4,Param5,Param6,Param7"
                : "Name,Icon";

        const sheetParameter = search.sheet
            ? `&sheets=${search.sheet}`
            : "";

        const url =
            `${baseURL}/search?query=Name~"${encodeURIComponent(search.name)}"` +
            `${sheetParameter}&fields=${fields}`;

        const response = await fetch(url);

		if (!response.ok) {
			console.error(`Request failed: ${response.status}`, url);
			continue;
		}
        const data = await response.json();

        console.log(`===== ${search.sheet ?? "All Sheets"}: ${search.name} =====`);

        data.results.forEach((result) => {
            console.log({
                sheet: result.sheet,
                row_id: result.row_id,
                fields: JSON.stringify(result.fields, null, 2)
            });
        });

        if (search.sheet === "Action") {
            console.table(
                data.results.map(result => ({
                    row_id: result.row_id,
                    name: result.fields.Name,
                    classJob: result.fields.ClassJob?.value,
                    classJobLevel: result.fields.ClassJobLevel,
                    classJobCategory: result.fields.ClassJobCategory?.value,
                    isPvP: result.fields.IsPvP,
                    isPlayerAction: result.fields.IsPlayerAction,
                    isRoleAction: result.fields.IsRoleAction,
                    actionCategory: result.fields.ActionCategory?.value
                }))
            );
        }
    }
}

// debugReferenceSearch();

async function debugStatusRow(rowId) {
    const url = `${baseURL}/sheet/Status/${rowId}`;

    const response = await fetch(url);
    const data = await response.json();

    console.table({
    row_id: data.row_id,
    name: data.fields.Name,
    classJobCategory: data.fields.ClassJobCategory?.value,
    statusCategory: data.fields.StatusCategory,
    maxStacks: data.fields.MaxStacks,
    canStatusOff: data.fields.CanStatusOff,
    isPermanent: data.fields.IsPermanent,
    description: data.fields.Description,
    icon: data.fields.Icon?.id
});
	console.log("Item Fields: ", data.fields);
}

async function debugActionRow(rowId) {
    const url = `${baseURL}/sheet/Action/${rowId}`;

    const response = await fetch(url);
    const data = await response.json();

    console.table({
		row_id: data.row_id,
		name: data.fields.Name,
		classJob: data.fields.ClassJob?.value,
		classJobLevel: data.fields.ClassJobLevel,
		classJobCategory: data.fields.ClassJobCategory?.value,
		isPvP: data.fields.IsPvP,
		isPlayerAction: data.fields.IsPlayerAction,
		isRoleAction: data.fields.IsRoleAction,
		actionCategory: data.fields.ActionCategory?.value
	});
	console.log("Item Fields: ", data.fields);
}


async function debugTraitRow(rowId) {
    const url = `${baseURL}/sheet/Trait/${rowId}`;

    const response = await fetch(url);
    const data = await response.json();
    // 'Name,Icon,Level,ClassJob,ClassJobCategory,Description',
    console.table({
		row_id: data.row_id,
		name: data.fields.Name,
		classJob: data.fields.ClassJob?.value,
		classJobLevel: data.fields.Level,
		classJobCategory: data.fields.ClassJobCategory?.value,
	});
	console.log("Item Fields: ", data.fields);
	console.log("Description: ", data.transient?.["Description@as(html)"]);
}

// await debugTraitRow(32);

export async function fetchClassJobs() {
	// Define a list of jobs to reorganize the selection menu
	const jobOrder = [
		'PLD',
		'WAR',
		'DRK',
		'GNB',
		'MNK',
		'DRG',
		'NIN',
		'SAM',
		'RPR',
		'VPR',
		'WHM',
		'SCH',
		'AST',
		'SGE',
		'BRD',
		'MCH',
		'DNC',
		'BLM',
		'SMN',
		'RDM',
		'PCT',
		'BLU',
		'BST'
	];

	// Construct the Search Parameters for ClassJobs
	const params = new URLSearchParams({
		fields: 'Name,NameEnglish,Abbreviation,ClassJobParent,JobIndex,IsLimitedJob'
	});

	// Fetch the data for ClassJobs
	const classJobList = await fetch(
		`https://v2.xivapi.com/api/sheet/ClassJob?${params}`
	);
	const classJobResults = await classJobList.json();
	const classJobs = classJobResults.rows;

	// Remove the 0 index "Adventurer"
	const classJobsFiltered = classJobs.filter((result) => {
		return result.fields.JobIndex !== 0;
	});

	// Order these to be the same as in-game
	classJobsFiltered.sort((a, b) => {
		const aIndex = jobOrder.indexOf(a.fields.Abbreviation);
		const bIndex = jobOrder.indexOf(b.fields.Abbreviation);

		return aIndex - bIndex;
	});

	return classJobsFiltered;
}

export async function fetchClassJobCategory() {
	// Fetch ClassJobCategories
	const classJobCategoryList = await fetch(
		`https://v2.xivapi.com/api/sheet/ClassJobCategory`
	);

	let classJobCategoryResults = await classJobCategoryList.json();
	let allResults = classJobCategoryResults.rows;

	while (classJobCategoryResults.rows.length === 100) {
		const lastRow = classJobCategoryResults.rows.at(-1);

		const newURL = `https://v2.xivapi.com/api/sheet/ClassJobCategory?after=${lastRow.row_id}`;

		const loopedResponse = await fetch(newURL);
		classJobCategoryResults = await loopedResponse.json();

		allResults = allResults.concat(classJobCategoryResults.rows);
	}

	return allResults;
}

async function fetchJSON(url) {
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Request Failed: ${response.status}`);
	}

	return response.json();
}

function removeDuplicates(results) {
	const seen = new Set();

	return results.filter((action) => {
		const key = `${action.fields.Name}|${action.transient['Description@as(html)']}`;

		if (seen.has(key)) {
			return false;
		}

		seen.add(key);
		return true;
	});
}

function sortResultsByLevel(results) {
	return results.sort((a, b) => {
		const levelA = a.fields.Level ?? a.fields.ClassJobLevel;
		const levelB = b.fields.Level ?? b.fields.ClassJobLevel;

		return levelA - levelB;
	});
}

function removeInvalidActions(results, mode) {
	if (mode === 'pvp') {
		return results.filter(
			(action) => action.fields.ClassJob && action.fields.ClassJob.value !== -1
		);
	} else {
		return results.filter((action) => action.fields.Recast100ms !== 0);
	}
}

async function searchSelectedJob(
	classJobCategory,
	classJobsFiltered,
	SelectedJob,
	params,
	baseQuery,
	searchCondition
) {
	const categoryFilter = classJobCategory.find(
		(category) => category.fields.Name === SelectedJob
	);

	const classFilter = classJobsFiltered.find(
		(classAbbrev) => classAbbrev.fields.Abbreviation === SelectedJob
	);

	const jobRowId = classFilter.row_id;
	const parentRowId = classFilter.fields.ClassJobParent.row_id;
	const categoryRowId = categoryFilter.row_id;

	params.set(
		'query',
		`${baseQuery} +ClassJobCategory=${categoryRowId}${searchCondition}`
	);

	const jobData = await fetchJSON(`${baseURL}/search?${params}`);
	let results = jobData.results;

	const jobsWithoutParentSearch = ["SCH"]; // Exclude Scholar because it is an exception with exclusive actions

	if (parentRowId !== jobRowId && !jobsWithoutParentSearch.includes(SelectedJob)) {
		// Search the Parent Class too
		params.set(
			'query',
			`${baseQuery} +ClassJob=${parentRowId}${searchCondition}`
		);

		const parentData = await fetchJSON(`${baseURL}/search?${params}`);
		results = results.concat(parentData.results);
	}

	return results;
}

async function searchByTerm(params, baseQuery, searchCondition) {
	params.set('query', `${baseQuery}${searchCondition}`);

	let data = await fetchJSON(`${baseURL}/search?${params}`);
	let results = data.results;

	if (data.next) {
		let newURL = `${baseURL}/search?${params}&cursor=${data.next}`;
		while (data.next) {
			data = await fetchJSON(newURL);
			results = results.concat(data.results);
			newURL = `${baseURL}/search?${params}&cursor=${data.next}`;
		}
	}

	return results;
}
