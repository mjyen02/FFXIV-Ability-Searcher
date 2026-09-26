import { useState } from "react";
import Filters from "./Filters";

function SearchForm(props)
{
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedJob, setSelectedJob] = useState("all");
    const [showFilters, setShowFilters] = useState(false);

    function handleChange(event)
    {
        setSearchTerm(event.target.value);
    }

    function handleSubmit(event)
    {
        event.preventDefault();
        props.onSearch(searchTerm, selectedJob);
    }

    function onJobChange(event)
    {
        setSelectedJob(event.target.value);
    }

    return (
        <>
            <form className="search-form" onSubmit={handleSubmit}>
                <select value={selectedJob} onChange={onJobChange}>
                    <option key="0" value="all">All</option>
                    {props.jobList.map((job) => 
                        <option key={job.row_id} value={job.fields.Abbreviation}>
                        {job.fields.NameEnglish} ({job.fields.Abbreviation})

                        {job.fields.Abbreviation !== job.fields.ClassJobParent.fields.Abbreviation && (
                            ` / ${job.fields.ClassJobParent.fields.NameEnglish} (${job.fields.ClassJobParent.fields.Abbreviation})`
                        )}
                    </option>
                    )}
                </select>
                <label>Enter a search term: </label>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleChange}
                    placeholder={
                        selectedJob === "all"
                            ? "Required if no job selected"
                            : "Optional with Job Selected"
                    }
                />
                <button type="button" onClick={() => setShowFilters(!showFilters)}>
                    Filters
                </button>
                <button type="submit">Submit Search</button>
            </form>
            {showFilters && (
                <Filters
                    filters={props.filters}
                    onFilterChange={props.onFilterChange}
                />
            )}
        </>
        
    );
}

export default SearchForm;