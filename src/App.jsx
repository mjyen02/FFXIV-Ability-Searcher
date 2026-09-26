import SearchForm from "./components/SearchForm.jsx";
import AbilityList from "./components/AbilityList.jsx";
import { useState, useEffect } from "react";
import { fetchResults } from "./api/api.js";
import { fetchClassJobs } from "./api/api.js";
import { fetchClassJobCategory } from "./api/api.js";
import './App.css'

function App() {

  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [classJobs, setClassJobs] = useState([]);
  const [classJobCategories, setClassJobCategories] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");

  useEffect(() => {
    async function loadData() 
    {
      const [jobCategories, jobs] = await Promise.all([
        fetchClassJobCategory(),
        fetchClassJobs()
      ])

      setClassJobCategories(jobCategories);
      setClassJobs(jobs);
      setIsLoading(false);
    }
    loadData();
  }, []);

  async function handleSearch(searchTerm, selectedJobResponse)
  {
    const allResults = await fetchResults(searchTerm, selectedJobResponse, classJobCategories, classJobs);
    console.log(allResults);
    setResults(allResults);
    setSelectedJob(selectedJobResponse);
  }

  if (isLoading)
  {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="app">
      <h1>FFXIV Ability Searcher</h1>
      <SearchForm 
        onSearch={handleSearch}
        jobList={classJobs}
      />
      <AbilityList results={results} classJobCategories={classJobCategories} classJobs={classJobs} selectedJob={selectedJob}/>
    </div>
  );
}

export default App
