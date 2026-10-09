import { useState, useRef, useEffect, useMemo } from "react";
import AbilityDescription from "./AbilityDescription";
import "../styles/abilityReference.css"

function AbilityReference({ability, color, checkIfAbilityExists, isAbilityInResults}) {
    const [isHovered, setIsHovered] = useState(false);
    const [placement, setPlacement] = useState({
        horizontal: "center",
        vertical: "below"
    });

    const isOrange = color === "rgb(255, 123, 26)";
    const isInResults = isAbilityInResults(ability);

    const triggerRef = useRef(null);
    const tooltipRef = useRef(null);

    const context = useMemo(() => ({
        mode: ability.fields.IsPvP ? "pvp" : "pve",
        classJobCategory: ability.fields.ClassJobCategory.value,
        classJobAbbrev: ability.fields.ClassJob.Abbreviation
    }), [
        ability.fields.IsPvP,
        ability.fields.ClassJobCategory.value,
        ability.fields.ClassJob.Abbreviation
    ]);

    const baseURL = 'https://v2.xivapi.com/api';
    
    useEffect(() => {
        if (!isHovered || !triggerRef.current || !tooltipRef.current) {
            return;
        }

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();

        const spaceBelow = window.innerHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;

        let horizontal = "center";
        let vertical = "below";

        // Check whether the tooltip overflows horizontally
        if (tooltipRect.left < 8) {
            horizontal = "left";
        } else if (tooltipRect.right > window.innerWidth - 8) {
            horizontal = "right";
        }

        // Flip above if the tooltip doesn't fit below and
        // there's more room above the trigger
        if (
            tooltipRect.height + 8 > spaceBelow &&
            spaceAbove > spaceBelow
        ) {
            vertical = "above";
        }

        setPlacement({ horizontal, vertical });
    }, [isHovered]);

    console.log(ability);
    console.log(ability.transient);
    return (
        <span 
            className="ability-reference-wrapper"
            onMouseEnter={() => {
                if (isOrange) setIsHovered(true)
            }}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span 
                ref={triggerRef}
                style={{color}}
                className={`ability-reference ${isOrange ? "is-link" : ""}`}
            >
                {ability.fields.Name}
            </span>
                {isHovered && isOrange && (
                    <article 
                        ref={tooltipRef} 
                        className={`ability-tooltip ${placement.horizontal} ${placement.vertical}`}
                    >
                        <header className="ability-header">
                            <img
                                className="ability-icon"
                                src={`${baseURL}/asset?path=${ability.fields.Icon.path_hr1}&format=jpg`}
                                alt={`Icon for ${ability.fields.Name}`}
                            />

                            <div className="ability-title">
                                <h2>{ability.fields.Name}</h2>
                            </div>
                        </header>
                        <AbilityDescription
                            description={ability.transient["Description@as(html)"]}
                                context={context}
                            checkIfAbilityExists={checkIfAbilityExists}
                            isAbilityInResults={isAbilityInResults}
                        />
                        <p className="ability-level">
                            Level:
                            <span>
                                {ability.fields.ClassJobLevel
                                    ? ` ${ability.fields.ClassJobLevel}`
                                    : ` ${ability.fields.Level}`}
                            </span>
                        </p>
                        <button 
                            type="button" 
                            className={`scroll-button ${isInResults 
                                ? "scroll-button-existing" 
                                : "scroll-button-add"}`}
                            onClick={() => checkIfAbilityExists(ability)}
                        >
                            {isInResults ? "Scroll to ability" : "Add Ability"}
                        </button>
                    </article>
                )}
        </span>
    )
}

export default AbilityReference;