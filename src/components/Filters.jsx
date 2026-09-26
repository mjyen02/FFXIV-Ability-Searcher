import { useState } from "react";

function Filters(props)
{
    const [selectedMode, setSelectedMode] = useState("pve");
    const [selectedCategory, setSelectedCategory] = useState("Action");
    const [minLevel, setMinLevel] = useState(1);
    const [maxLevel, setMaxLevel] = useState(100);

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
        <div>
            <select value={props.filters.mode} onChange={onModeChange}>
                <option value="pve">PvE</option>
                <option value="pvp">PvP</option>
                <option value="all">All</option>
            </select>
            <select value={props.filters.type} onChange={onCategoryChange}>
                <option value="Action">Actions</option>
                <option value="Trait">Traits</option>
            </select>
            <input type="number" value={props.filters.minLevel} onChange={onMinLevelChange}></input>
            <input type="number" value={props.filters.maxLevel} onChange={onMaxLevelChange}></input>
        </div>
    );
}

export default Filters;