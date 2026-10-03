function Filters(props)
{
    function onModeChange(event)
    {
        const newMode = event.target.value;
        props.onFilterChange({
            ...props.filters,
            mode: newMode,
            type: newMode === "pvp" ? "Action" : props.filters.type
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
                <label>Mode</label>
                <button
                    className={`modeButton ${props.filters.mode === "pve" ? "active" : ""}`}
                    value="pve"
                    onClick={onModeChange}
                >
                    PvE
                </button>
                <button
                    className={`modeButton ${props.filters.mode === "pvp" ? "active" : ""}`}
                    value="pvp"
                    onClick={onModeChange}
                >
                    PvP
                </button>
                <button
                    className={`modeButton ${props.filters.mode === "all" ? "active" : ""}`}
                    value="all"
                    onClick={onModeChange}
                >
                    All
                </button>                                
            </div>
            {props.filters.mode !== "pvp" && (
            <>
                <div className="filter-group">
                    <label >Category</label>
                    <button
                        className={`modeType ${props.filters.type === "Action" ? "active" : ""}`}
                        value="Action"
                        onClick={onCategoryChange}
                    >
                        Actions
                    </button>
                    <button
                        className={`modeType ${props.filters.type === "Trait" ? "active" : ""}`}
                        value="Trait"
                        onClick={onCategoryChange}
                    >
                        Traits
                    </button>                    
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
            </>
            )}
        </aside>
    );
}

export default Filters;