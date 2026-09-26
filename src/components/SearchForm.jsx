import { useState } from "react";

function SearchForm(props)
{
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedJob, setSelectedJob] = useState("all");

    function handleChange(event)
    {
        setSearchTerm(event.target.value);
    }

    function handleSubmit(event)
    {
        event.preventDefault();
        props.onSearch(searchTerm, selectedJob);
    }

    function onChange(event)
    {
        setSelectedJob(event.target.value);
    }

    return (
        <form onSubmit={handleSubmit}>
            <select value={selectedJob} onChange={onChange}>
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
            >

            </input>
            <button type="submit">Submit Search</button>
        </form>
    );
}

export default SearchForm;