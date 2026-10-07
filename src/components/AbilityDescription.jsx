import { useState, useEffect } from "react";
import { referenceResolver } from "../utils/referenceResolver";
import AbilityReference from "./AbilityReference";

function AbilityDescription({ description, context }) {
    const [resolvedAbilities, setResolvedAbilities] = useState([]);

    const parser = new DOMParser();
    const document = parser.parseFromString(description, "text/html");

    let referenceIndex = 0;

    const nodes = Array.from(document.body.childNodes);
    useEffect(() => {
        let resultList = [];
        const abilityNames = nodes
            .filter(node => node.nodeName === "SPAN")
            .map(node => node.textContent);
        
        async function resolveReferences() {
            
            for (const ability of abilityNames)
            {
                const result = await referenceResolver(ability, context);
                resultList.push(result);
            }
            setResolvedAbilities(resultList);
            console.log("Returned Results: ", resultList);
        }

        resolveReferences();
    }, [description, context]);

    return (
        <div className="ability-description">
            {nodes.map((node, index) => {
                if (node.nodeName === "#text") {
                    return node.textContent;
                }

                if (node.nodeName === "BR") {
                    return <br key={index} />
                }

                if (node.nodeName === "SPAN") {
                    const resolvedAbility = resolvedAbilities[referenceIndex];

                    referenceIndex++;
                    const color = node.style.color;
                    if (resolvedAbility) {
                        return (
                            <AbilityReference 
                                key={index}
                                ability={resolvedAbility}
                                context={context}
                                color={color}
                            />
                        );
                    }
                    else {
                        return (
                            <span 
                                key ={index}
                                style={{color}}
                            >
                                {node.textContent}
                            </span>
                        );
                    }
                }
            })}
        </div>
    )
}

export default AbilityDescription;