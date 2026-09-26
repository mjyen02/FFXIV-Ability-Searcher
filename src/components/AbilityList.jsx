import AbilityCard from "./AbilityCard.jsx";

function AbilityList(props)
{
    // const category = props.results.fields.ClassJobCategory;
    return (
        <section className="ability-list">
            {props.results.map((result) => 
            <AbilityCard key={result.row_id} result={result} />
        )}
        </section>
    );
}

export default AbilityList;