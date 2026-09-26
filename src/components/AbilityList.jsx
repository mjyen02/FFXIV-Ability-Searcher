const baseURL = 'https://v2.xivapi.com/api';

function AbilityList(props)
{
    return (
        <section>
            {props.results.map((result) => 
            <article key={result.row_id}>
                <div className="ability-header">
                    <img 
                        className="ability-icon" 
                        src={`${baseURL}/asset?path=${result.fields.Icon.path_hr1}&format=jpg`}
                        alt={`Icon for ${result.fields.Name}`}
                    />
                    <h2 className="ability-header-text">{result.fields.Name}</h2>
                    <h3>{`Class/Job:`}</h3>
                </div>
            </article>
        )}
        </section>
    );
}

export default AbilityList;