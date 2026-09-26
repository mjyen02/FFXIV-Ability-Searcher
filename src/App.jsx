import SearchForm from "./components/SearchForm.jsx";
import AbilityList from "./components/AbilityList.jsx";
import { useState, useEffect } from "react";
import { fetchResults } from "./api/api.js";
import { fetchClassJobs } from "./api/api.js";
import { fetchClassJobCategory } from "./api/api.js";
import './App.css'

function App() {

  const [results, setResults] = useState([]);
  const [classJobs, setClassJobs] = useState([]);
  const [classJobCategories, setClassJobCategories] = useState([]);

  useEffect(() => {
    async function loadClassJobCategories()
    {
      const jobCategories = await fetchClassJobCategory();
      setClassJobCategories(jobCategories);
    }
    async function loadClassJob()
    {
      const jobs = await fetchClassJobs();
      setClassJobs(jobs);
    }

    loadClassJobCategories();
    loadClassJob();
  }, []);

  async function handleSearch(searchTerm, selectedJob)
  {
    const allResults = await fetchResults(searchTerm, selectedJob);
    console.log(allResults);
    setResults(allResults);
  }

  return (
    <div>
      <h1>FFXIV Ability Searcher</h1>
      <SearchForm 
        onSearch={handleSearch}
        jobList={classJobs}
      />
      <AbilityList results={results}/>
    </div>
  );
}

export default App
