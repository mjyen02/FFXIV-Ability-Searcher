const baseURL = 'https://v2.xivapi.com/api';

function AbilityCard({ result })
{

    return (
        <article className="ability-card">
            <header className="ability-header">
                <img 
                className="ability-icon" 
                src={`${baseURL}/asset?path=${result.fields.Icon.path_hr1}&format=jpg`}
                alt={`Icon for ${result.fields.Name}`}
            />

            <div className="ability-title">
                <h2>{result.fields.Name}</h2>
                <h3>
                    {`Class/Job: ${result?.fields.ClassJobCategory.fields.Name ?? "Unknown"}`}
                </h3>
            </div>
    
            </header>
            <div
            className="ability-description"
                dangerouslySetInnerHTML={{
                    __html: result.transient["Description@as(html)"]
                }}
            />
            <p className="ability-level">Level:  
                <span>
                    {result.fields.ClassJobLevel
                        ? ` ${result.fields.ClassJobLevel}`
                        : ` ${result.fields.Level}`
                    }    
                </span> 
            </p>
        </article>
    );
}

export default AbilityCard;