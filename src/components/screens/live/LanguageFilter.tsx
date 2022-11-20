type Props = {
	value: string;
	onValueChanged: (newValue: string) => void;
};

const LanguageFilter = ({ value, onValueChanged }: Props) => {
	return (
		<div className="LanguageFilter">
			<label htmlFor="language-filter">
				Filter: &nbsp;
				<input type="text" value={value} onChange={(event) => onValueChanged(event.target.value)} />
			</label>
		</div>
	);
};

export default LanguageFilter;
