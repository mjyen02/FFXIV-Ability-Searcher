import { useState, useEffect } from "react";
import AbilityDescription from "./AbilityDescription";

function AbilityReference({ability, color}) {
    const [isHovered, setIsHovered] = useState(false);
    const baseURL = 'https://v2.xivapi.com/api';
    // useEffect(() => {
    //     if (isHovered)
    //     {
    //         console.log("Hovered");
    //     }
    //     else
    //     {
    //         console.log("Unhovered");
    //     }
    // }, [isHovered]);
    console.log(ability);
    console.log(ability.transient);
    return (
        <span className="ability-reference-wrapper">
            <span 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{color}}
                className="ability-reference"
            >
                {ability.fields.Name}
            </span>
                {isHovered && (
                    <article className="ability-tooltip">
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
                            context={{
                                mode: ability.fields.IsPvP ? "pvp" : "pve",
                                classJobCategory: ability.fields.ClassJobCategory.value
                            }}
                        />
                        <p className="ability-level">
                            Level:
                            <span>
                                {ability.fields.ClassJobLevel
                                    ? ` ${ability.fields.ClassJobLevel}`
                                    : ` ${ability.fields.Level}`}
                            </span>
                        </p>
                    </article>
                )}
        </span>
    )
}

export default AbilityReference;