import AbilityCard from './AbilityCard.jsx';

function AbilityList(props) {
	// const category = props.results.fields.ClassJobCategory;
	return (
		<section className="ability-list">
			{props.results.map((result) => (
				<AbilityCard 
					key={result.row_id} 
					result={result} 
					checkIfAbilityExists={props.checkIfAbilityExists}
					isAbilityInResults={props.isAbilityInResults}
					isHighlighted={result.row_id === props.pendingScrollId}
					highlightKey={props.sameScrollCounter}
				/>
			))}
		</section>
	);
}

export default AbilityList;
