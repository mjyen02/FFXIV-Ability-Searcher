import AbilityDescription from "./AbilityDescription.jsx";

const baseURL = 'https://v2.xivapi.com/api';

const costTypes = {
    3: {label: "MP"},
    22: {label: "Beast Gauge"},
    23: {label: "Polyglot"},
    25: {label: "Blood Gauge"},
    27: {label: "Ninki"},
    30: {label: "Aetherflow"},
    39: {label: "Kenki"},
    41: {label: "Oath Gauge"},
    43: {label: "Black and White Mana"},
    54: {label: "Esprit"},
    55: {label: "Cartridge(s)"},
    56: {label: "Blood Lily"},
    57: {label: "Lily"},
    59: {label: "Soul Voice Gauge"},
    61: {label: "Heat Gauge"},
    62: {label: "Battery Gauge"},
    64: {label: "Soul (Red) Gauge"},
    65: {label: "Shroud (Blue) Gauge"},
    68: {label: "Addersgall (Blue)"},
    69: {label: "Addersting (Pink)"},
    75: {label: "Firstmind's Focus"},
    87: {label: "Rattling Coil (Gem)"},
    88: {label: "Serpent's Offering"},
    91: {label: "Pallete Gauge"},
    92: {label: "Paint"}
};

function getResourceCost(result) { // Function to normalize outlier cost values
    const costValue = result.fields.PrimaryCostValue;

    switch(result.fields.PrimaryCostType)
    {
        case 3:
            return costValue * 100;
        case 92:
            return 1;
        default:
            return costValue;
    }
}
function AbilityCard({ result }) {

    const costType = costTypes[result.fields.PrimaryCostType];
    const context = {
        mode: result.fields.IsPvP ? "pvp" : "pve",
        classJobCategory: result.fields.ClassJobCategory.value
    };

    const properties = [
        {
            label: "Cast Time",
            value: result.fields.Cast100ms === 0
                ? "Instant"
                : `${(result.fields.Cast100ms / 10).toFixed(2)}s`
            
        },
        {
            label: "Recast Time",
            value: `${(result.fields.Recast100ms / 10).toFixed(2)}s`
        },
        ...(costTypes[result.fields.PrimaryCostType] && result.fields.PrimaryCostValue != null
            ? [{
                label: "Cost",
                value: `${getResourceCost(result)} ${costType.label}`
            }]
            : []
        )
    ];

	return (
		<article className="ability-card" id={`ability-${result.row_id}`}>
			<header className="ability-header">
				<img
					className="ability-icon"
					src={`${baseURL}/asset?path=${result.fields.Icon.path_hr1}&format=jpg`}
					alt={`Icon for ${result.fields.Name}`}
				/>

				<div className="ability-title">
					<h2>{result.fields.Name}</h2>
					<h3>
						{`Class/Job: ${result?.fields.ClassJobCategory.fields.Name ?? 'Unknown'}`}
					</h3>
				</div>
			</header>
            <dl className="ability-properties">
                {properties.map((property) => (
                    <div className="ability-property" key={property.label}>
                        <dt>{property.label}</dt>
                        <dd>{property.value}</dd>
                    </div>
                ))}
            </dl>
			<AbilityDescription description={result.transient["Description@as(html)"]}
                context={context}
            />
			<p className="ability-level">
				Level:
				<span>
					{result.fields.ClassJobLevel
						? ` ${result.fields.ClassJobLevel}`
						: ` ${result.fields.Level}`}
				</span>
			</p>
		</article>
	);
}

export default AbilityCard;
