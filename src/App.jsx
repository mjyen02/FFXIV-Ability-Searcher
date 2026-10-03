import SearchForm from "./components/SearchForm.jsx";
import AbilityList from "./components/AbilityList.jsx";
import { sortAbilities } from "./utils/abilitySorting.js";
import { useState, useEffect } from "react";
import { fetchResults } from "./api/api.js";
import { fetchClassJobs } from "./api/api.js";
import { fetchClassJobCategory } from "./api/api.js";
import './App.css'

function App() {

  // States relating to initlization
  const [isLoading, setIsLoading] = useState(true);
  const [classJobs, setClassJobs] = useState([]);
  const [classJobCategories, setClassJobCategories] = useState([]);
  const [isLightMode, setIsLightMode] = useState(false);

  // States relating to data flow
  const [results, setResults] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState({
    mode: "pve",
    type: "Action",
    minLevel: 1,
    maxLevel: 100
  });

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

  function toggleTheme() {
    setIsLightMode(!isLightMode);
    document.body.classList.toggle("light-mode");
  }

  async function handleSearch(searchTerm, selectedJobResponse)
  {
    setIsSearching(true);
    try {
      const allResults = await fetchResults (
        searchTerm,
        selectedJobResponse,
        classJobCategories,
        classJobs,
        filters
      );

      setResults(sortAbilities(allResults, classJobs));
      setSelectedJob(selectedJobResponse);
    } catch (error) {
      return <h2>Sorry, an error during the search has occurred.</h2>
    } finally {
      setIsSearching(false);
    }
  }

  if (isLoading)
  {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="app">
      <h1>FFXIV Ability Searcher</h1>
      <button 
        className="theme-button"
        onClick={toggleTheme}
        aria-label={isLightMode ? "Switch to dark mode" : "Switch to light mode"}
      >
        {isLightMode ? "☾ Dark Mode" : "☀ Light Mode"}
      </button>
      <SearchForm 
        onSearch={handleSearch}
        jobList={classJobs}
        filters={filters}
        onFilterChange={setFilters}
      />
      {isSearching && <p>Searching...</p>}
      <AbilityList results={results} classJobCategories={classJobCategories} classJobs={classJobs} selectedJob={selectedJob}/>
    </div>
  );
}

export default App
