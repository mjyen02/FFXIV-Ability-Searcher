function Filters(props)
{
    function onModeChange(event)
    {
        const newMode = event.target.value;
        props.onFilterChange({
            ...props.filters,
            mode: newMode
        });
    }

    function onCategoryChange(event)
    {
        const newType = event.target.value;
        props.onFilterChange({
            ...props.filters,
            type: newType
        });
    }

    function onMinLevelChange(event)
    {
        const newMinLevel = Number(event.target.value);
        console.log("New Min Level: ", newMinLevel);
        props.onFilterChange({
            ...props.filters,
            minLevel: newMinLevel
        });
    }

    function onMaxLevelChange(event)
    {
        const newMaxLevel = Number(event.target.value);
        console.log("New Max Level: ", newMaxLevel);
        props.onFilterChange({
            ...props.filters,
            maxLevel: newMaxLevel
        });
    }

    return(
        <aside className="filters">
            <h2>Filters</h2>
            <div className="filter-group">
                <label htmlFor="mode">Mode</label>
                <select 
                    id="mode"
                    value={props.filters.mode} 
                    onChange={onModeChange}
                >
                    <option value="pve">PvE</option>
                    <option value="pvp">PvP</option>
                    <option value="all">All</option>
                </select>
            </div>
            <div className="filter-group">
                <label htmlFor="type">Category</label>
                <select 
                    id="type"
                    value={props.filters.type} 
                    onChange={onCategoryChange}
                >
                    <option value="Action">Actions</option>
                    <option value="Trait">Traits</option>
                </select>
            </div>
            <div className="filter-group">
                <label>Level Range</label>
                <div className="level-inputs">
                    <input 
                        type="number" 
                        value={props.filters.minLevel} 
                        onChange={onMinLevelChange} 
                        min="1"
                        max="100"
                    />
                    <input 
                        type="number" 
                        value={props.filters.maxLevel} 
                        onChange={onMaxLevelChange} 
                        min="1"
                        max="100"
                    />
                </div>
            </div>
        </aside>
    );
}

export default Filters;